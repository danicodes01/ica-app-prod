'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import styles from './code-editor.module.css';
import { loader } from '@monaco-editor/react';
import { CodeEditorProps, SupportedLanguage } from '@/types/base/editor';
import { CODE_SNIPPETS } from '@/utils/constants/codeEditor/editor';
import { LanguageSelector } from './language-selector';
import { cleanupOldCode } from '@/utils/localStorage';
import { executeCode } from '@/utils/editor/codeExecuter';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

const claudeTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: '9CDCFE' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'identifier', foreground: '9CDCFE' },
    { token: 'function', foreground: '4FC1FF' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'delimiter', foreground: 'D4D4D4' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'constant', foreground: '4FC1FF' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2F2F2F',
    'editor.selectionBackground': '#264F78',
    'editorCursor.foreground': '#FFFFFF',
    'editor.selectionHighlightBackground': '#264F78',
    'editorLineNumber.foreground': '#858585',
    'editorIndentGuide.background': '#404040',
  },
};

export default function CodeEditor({
  initialCode = '// your code here',
  height = '40vh',
  readOnly = false,
  onCodeSubmit,
  defaultLanguage = 'typescript',
  stationId,
  userEmail,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState<string>(initialCode);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);

  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    setCode(CODE_SNIPPETS[newLanguage]);
  };

  const beforeMount = (monaco: Monaco) => {
    loader.config({ monaco });
    monaco.editor.defineTheme('claude', claudeTheme);
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;
    editor.focus();
    monaco.editor.setTheme('claude');
  };

  const getStorageKey = useCallback(() => {
    if (!userEmail) return null;
    return `savedCode-${userEmail}-${stationId}`;
  }, [userEmail, stationId]);

  useEffect(() => {
    setCode(initialCode);

    const storageKey = getStorageKey();
    if (storageKey) {
      const savedCode = localStorage.getItem(storageKey);
      if (savedCode) {
        setCode(savedCode);
      }
    }
  }, [initialCode, getStorageKey]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      const storageKey = getStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, value);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clear code when component unmounts
      setCode(initialCode);
      // Clean up old saved code
      if (userEmail) {
        cleanupOldCode(userEmail);
      }
    };
  }, [initialCode, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onCodeSubmit) {
        await onCodeSubmit(code);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExecuting(true);
  
    try {
      setLogs([]);
      const logMessages: string[] = [];
  
      const customConsole = {
        log: (...args: unknown[]) => {
          const logMessage = args
            .map(arg =>
              typeof arg === 'object'
                ? JSON.stringify(arg, null, 2)
                : String(arg),
            )
            .join(' ');
          logMessages.push(logMessage);
        },
      };
  
      await executeCode({
        code,
        language,
        customConsole,
      });
  
      setLogs(logMessages);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={styles.container}>
      <LanguageSelector language={language} onSelect={handleLanguageChange} />
      <form
        onSubmit={handleSubmit}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div className={styles.editorWrapper}>
          <MonacoEditor
            height={height}
            language={language}
            value={code}
            onChange={handleEditorChange}
            beforeMount={beforeMount}
            onMount={handleEditorDidMount}
            theme='claude'
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 21,
              fontFamily: 'Fira Code, monospace',
              fontWeight: '400',
              fontLigatures: true,
              scrollBeyondLastLine: false,
              folding: false,
              lineNumbers: 'on',
              renderLineHighlight: 'none',
              matchBrackets: 'always',
              cursorStyle: 'line',
              cursorBlinking: 'smooth',
              formatOnPaste: true,
              roundedSelection: false,
              formatOnType: true,
              tabSize: 2,
              autoIndent: 'advanced',
              readOnly,
              accessibilitySupport: 'auto',
              guides: {
                indentation: true,
                bracketPairs: true,
              },
            }}
          />
        </div>

        <div className={styles.resultsPanel}>
          {result && (
            <div
              className={`${styles.result} ${
                result.includes('Error') ? styles.error : ''
              }`}
            >
              {result}
            </div>
          )}
          {logs.length > 0 && (
            <div className={styles.logs}>
              {logs.map((log, index) => (
                <pre key={index} className={styles.logLine}>
                  {log}
                </pre>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className='flex justify-end gap-2 pt-2'>
          <button
            type='button'
            onClick={handleRunCode}
            disabled={isExecuting || readOnly}
            className={styles.button}
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
          <button
            type='submit'
            disabled={isSubmitting || readOnly}
            className={`${styles.button} bg-green-600 hover:bg-green-700`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </button>
        </div>
      </form>
    </div>
  );
}
