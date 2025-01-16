// switch (language) {
//     case 'typescript':
//       const transpiledCode = ts.transpileModule(codeToExecute, {
//         compilerOptions: {
//           module: ts.ModuleKind.CommonJS,
//           target: ts.ScriptTarget.ES2018,
//           jsx: ts.JsxEmit.React,
//         },
//       }).outputText;

//       const executeTsFunction = new Function('console', transpiledCode);
//       executeTsFunction(customConsole);
//       break;

//       case 'javascript':
//         try {
//           const executeJsFunction = new Function('console', codeToExecute);
//           executeJsFunction(customConsole);
//         } catch (error) {
//           const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//           customConsole.log(`Runtime Error: ${errorMessage}`);
//         }
//         break;

//     case 'python':
//       // Simple Python simulation
//       const pythonLines = codeToExecute.split('\n');
//       for (const line of pythonLines) {
//         if (line.trim().startsWith('print(')) {
//           const content = line.trim().slice(6, -1);
//           customConsole.log(eval(content)); // Note: eval is used for simulation purposes only
//         }
//       }
//       break;

//     case 'java':
//       // Simple Java simulation
//       const javaLines = codeToExecute.split('\n');
//       let mainMethodFound = false;
//       for (const line of javaLines) {
//         const trimmedLine = line.trim();
//         if (trimmedLine.includes('public static void main')) {
//           mainMethodFound = true;
//         }
//         if (
//           mainMethodFound &&
//           trimmedLine.startsWith('System.out.println')
//         ) {
//           const match = trimmedLine.match(/System\.out\.println\((.*)\);/);
//           if (match) {
//             const content = match[1].trim();
//             // Remove surrounding quotes if it's a string literal
//             const output =
//               content.startsWith('"') && content.endsWith('"')
//                 ? content.slice(1, -1)
//                 : content;
//             customConsole.log(output);
//           }
//         }
//       }
//       if (!mainMethodFound) {
//         customConsole.log(
//           'Error: public static void main(String[] args) method not found.',
//         );
//       }
//       break;

//     case 'csharp':
//       // Simple C# simulation
//       const csharpLines = codeToExecute.split('\n');
//       let mainMethodFoundCSharp = false;
//       for (const line of csharpLines) {
//         const trimmedLine = line.trim();
//         if (trimmedLine.includes('static void Main')) {
//           mainMethodFoundCSharp = true;
//         }
//         if (
//           mainMethodFoundCSharp &&
//           trimmedLine.startsWith('Console.WriteLine')
//         ) {
//           const match = trimmedLine.match(/Console\.WriteLine\((.*)\);/);
//           if (match) {
//             const content = match[1].trim();
//             const output =
//               content.startsWith('"') && content.endsWith('"')
//                 ? content.slice(1, -1)
//                 : content;
//             customConsole.log(output);
//           }
//         }
//       }
//       if (!mainMethodFoundCSharp) {
//         customConsole.log(
//           'Error: static void Main(string[] args) method not found.',
//         );
//       }
//       break;

//     case 'php':
//       const phpLines = codeToExecute.split('\n');
//       const phpVariables: { [key: string]: string } = {};

//       for (const line of phpLines) {
//         const trimmedLine = line.trim();

//         // Handle variable assignment
//         const assignmentMatch = trimmedLine.match(/^\$(\w+)\s*=\s*(.+);/);
//         if (assignmentMatch) {
//           const [, varName, varValue] = assignmentMatch;
//           phpVariables[varName] = varValue.replace(/["';]/g, '').trim();
//           continue;
//         }

//         // Handle echo and print
//         if (
//           trimmedLine.startsWith('echo') ||
//           trimmedLine.startsWith('print')
//         ) {
//           const match = trimmedLine.match(/(echo|print)\s+(.+);/);
//           if (match) {
//             let content = match[2].trim();

//             // Handle string interpolation
//             content = content.replace(
//               /"\s*\.\s*\$(\w+)\s*\.\s*"/g,
//               (_, varName) => phpVariables[varName] || '',
//             );
//             content = content.replace(
//               /\$(\w+)/g,
//               (_, varName) => phpVariables[varName] || '',
//             );

//             // Remove quotes if present
//             const output =
//               content.startsWith('"') && content.endsWith('"')
//                 ? content.slice(1, -1)
//                 : content;

//             customConsole.log(output);
//           }
//         }
//       }
//       break;
//     default:
//       throw new Error(`Unsupported language: ${language}`);
//   }

//   setLogs(logMessages);
// } catch (error) {
//   setResult(
//     `Error: ${
//       error instanceof Error ? error.message : 'An unknown error occurred'
//     }`,
//   );
//   console.error(error);
// } finally {
//   setIsExecuting(false);
// }
// };