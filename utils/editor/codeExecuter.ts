import { SupportedLanguage } from '@/types/base/editor';
import ts from 'typescript';

export type CustomConsole = {
  log: (...args: unknown[]) => void;
};

export interface ExecuteCodeParams {
  code: string;
  language: SupportedLanguage;
  customConsole: CustomConsole;
}

class VariableScope {
  private variables: Map<string, unknown> = new Map();

  set(name: string, value: unknown): void {
    this.variables.set(name, value);
  }

  get(name: string): unknown {
    return this.variables.get(name);
  }

  has(name: string): boolean {
    return this.variables.has(name);
  }
}

export const executeCode = async ({
  code,
  language,
  customConsole
}: ExecuteCodeParams): Promise<void> => {
  try {
    switch (language) {
      case 'typescript': {
        const transpiledCode = ts.transpileModule(code, {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2018,
            jsx: ts.JsxEmit.React,
          },
        }).outputText;

        try {
          const executeTsFunction = new Function('console', transpiledCode);
          executeTsFunction(customConsole);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          customConsole.log(`TypeScript Runtime Error: ${errorMessage}`);
        }
        break;
      }

      case 'javascript': {
        try {
          const executeJsFunction = new Function('console', code);
          executeJsFunction(customConsole);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          customConsole.log(`JavaScript Runtime Error: ${errorMessage}`);
        }
        break;
      }

      case 'python': {
        const scope = new VariableScope();
        const lines = code.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('#')) continue;

          if (trimmedLine.startsWith('print(')) {
            const content = trimmedLine.slice(6, -1).trim();
            try {
              if (scope.has(content)) {
                customConsole.log(scope.get(content));
              } else {
                const result = content.startsWith('"') && content.endsWith('"')
                  ? content.slice(1, -1)
                  : eval(content);
                customConsole.log(result);
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              customConsole.log(`Error in print statement: ${errorMessage}`);
            }
          } else if (trimmedLine.includes('=')) {
            const [varName, ...rest] = trimmedLine.split('=');
            const expression = rest.join('=').trim();
            try {
              scope.set(varName.trim(), eval(expression));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              customConsole.log(`Error in assignment: ${errorMessage}`);
            }
          }
        }
        break;
      }

      case 'java': {
        const scope = new VariableScope();
        const lines = code.split('\n');
        let mainMethodFound = false;
        let inMainMethod = false;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.includes('public static void main')) {
            mainMethodFound = true;
            inMainMethod = true;
            continue;
          }

          if (!inMainMethod) continue;

          // handle variables, declarations and assignment
          const variableMatch = trimmedLine.match(/^(\w+)\s+(\w+)\s*=\s*(.+);$/);
          if (variableMatch) {
            const [, , name, value] = variableMatch;
            try {
              scope.set(name, eval(value));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              customConsole.log(`Error in variable assignment: ${errorMessage}`);
            }
          }

          if (trimmedLine.startsWith('System.out.println')) {
            const match = trimmedLine.match(/System\.out\.println\((.*)\);/);
            if (match) {
              const content = match[1].trim();
              try {
                if (scope.has(content)) {
                  customConsole.log(scope.get(content));
                } else {
                  const output = content.startsWith('"') && content.endsWith('"')
                    ? content.slice(1, -1)
                    : eval(content);
                  customConsole.log(output);
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                customConsole.log(`Error in println: ${errorMessage}`);
              }
            }
          }
        }
        
        if (!mainMethodFound) {
          customConsole.log('Error: public static void main(String[] args) method not found');
        }
        break;
      }

      case 'csharp': {
        const scope = new VariableScope();
        const lines = code.split('\n');
        let mainMethodFound = false;
        let inMainMethod = false;

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.includes('static void Main')) {
            mainMethodFound = true;
            inMainMethod = true;
            continue;
          }

          if (!inMainMethod) continue;

          const variableMatch = trimmedLine.match(/^(var|int|string|double)\s+(\w+)\s*=\s*(.+);$/);
          if (variableMatch) {
            const [, , name, value] = variableMatch;
            try {
              scope.set(name, eval(value));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              customConsole.log(`Error in variable assignment: ${errorMessage}`);
            }
          }

          if (trimmedLine.startsWith('Console.WriteLine')) {
            const match = trimmedLine.match(/Console\.WriteLine\((.*)\);/);
            if (match) {
              const content = match[1].trim();
              try {
                if (scope.has(content)) {
                  customConsole.log(scope.get(content));
                } else {
                  const output = content.startsWith('"') && content.endsWith('"')
                    ? content.slice(1, -1)
                    : eval(content);
                  customConsole.log(output);
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                customConsole.log(`Error in WriteLine: ${errorMessage}`);
              }
            }
          }
        }
        
        if (!mainMethodFound) {
          customConsole.log('Error: static void Main(string[] args) method not found');
        }
        break;
      }

      case 'php': {
        const scope = new VariableScope();
        const lines = code.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();

          const assignmentMatch = trimmedLine.match(/^\$(\w+)\s*=\s*(.+);/);
          if (assignmentMatch) {
            const [, varName, expression] = assignmentMatch;
            try {
              const cleanExpression = expression.replace(/["';]/g, '').trim();
              scope.set(varName, eval(cleanExpression));
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              customConsole.log(`Error in variable assignment: ${errorMessage}`);
            }
            continue;
          }

          if (trimmedLine.startsWith('echo') || trimmedLine.startsWith('print')) {
            const match = trimmedLine.match(/(echo|print)\s+(.+);/);
            if (match) {
              try {
                let content = match[2].trim();
                
                content = content.replace(/"\s*\.\s*\$(\w+)\s*\.\s*"/g, (_, varName) => {
                  const value = scope.get(varName);
                  return value?.toString() || '';
                });
                
                content = content.replace(/\$(\w+)/g, (_, varName) => {
                  if (scope.has(varName)) {
                    const value = scope.get(varName);
                    return String(value);
                  }
                  customConsole.log(`Warning: Undefined variable $${varName}`);
                  return '';
                });

                const output = content.startsWith('"') && content.endsWith('"')
                  ? content.slice(1, -1)
                  : content;

                customConsole.log(output);
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                customConsole.log(`Error in echo/print: ${errorMessage}`);
              }
            }
          }
        }
        break;
      }

      default:
        customConsole.log(`Language ${language} is not supported yet`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    customConsole.log(`Runtime Error: ${errorMessage}`);
  }
};