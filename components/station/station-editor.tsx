import { SupportedLanguage } from "@/types/base/editor";
import { IDBStation } from "@/types/models/planet";
import { CODE_SNIPPETS } from "@/utils/constants/codeEditor/editor";
import { Session } from 'next-auth';
import CodeEditor from "../editor/code-editor";
import styles from './station.module.css'

interface StationEditorProps {
    station: IDBStation;
    language: SupportedLanguage;
    output: string | null;
    logs: string[];
    session: Session | null;
    onLanguageChange?: (lang: SupportedLanguage) => void;  // Made optional
    onCodeSubmit?: (code: string) => Promise<void>;        // Made optional
    onReturn: () => void;
  }
  
  export default function StationEditor({
    station,
    language,
    output,
    logs,
    session,
    onLanguageChange,
    onCodeSubmit,
    onReturn
  }: StationEditorProps) {
    return (
      <div className={styles.editorSection}>
        <div className={styles.editorContainer}>
          <div className={styles.editorWrapper}>
            <CodeEditor
              initialCode={station.challenge.initialCode}
              height="100%"
              defaultLanguage={language}
              defaultValue={CODE_SNIPPETS[language]}
              onLanguageChange={onLanguageChange}
              onCodeSubmit={onCodeSubmit}
              stationId={station.stationId}
              userEmail={session?.user?.email}
            />
          </div>
        </div>
  
        {(output || logs.length > 0) && (
          <div className={styles.resultsPanel}>
            <div className={styles.output}>
              {output && (
                <div className={`${styles.outputDefault} ${
                  output.includes('Success') 
                    ? styles.outputSuccess
                    : output.includes('Failed attempt') 
                      ? styles.outputError
                      : ''
                }`}>
                  {output}
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
          </div>
        )}
  
        <div className={styles.navigationBar}>
          <button
            onClick={onReturn}
            className={styles.navigationButton}
          >
            Return to Planet
          </button>
        </div>
      </div>
    );
  }