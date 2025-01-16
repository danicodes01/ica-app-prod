import { IChallenge, ITestCase, TestResult, TypeValidation } from '@/types/base/challenge';

// Helper function to extract function name from challenge instructions
const getFunctionNameFromInstructions = (instructions: string): string => {
  const match = instructions.match(/function named [`'](\w+)[`']/i);
  return match ? match[1] : '';
};

export const runCodeTest = (
  code: string,
  challenge: IChallenge,
  testCase: ITestCase
): TestResult => {
  try {
    if (challenge.type === 'function' || challenge.type === 'algorithm') {
      // Get the function name from instructions
      const functionName = getFunctionNameFromInstructions(challenge.instructions);
      if (!functionName) {
        throw new Error('Could not determine function name from instructions');
      }

      // Create a new function scope and evaluate the code directly
      const wrappedCode = `
        ${code}  // User's function definition
        
        try {
          // Execute the function with test input
          const input = ${JSON.stringify(testCase.input)};
          const result = Array.isArray(input) ? 
            ${functionName}(...input) : 
            ${functionName}(input);
            
          return result;
        } catch (e) {
          throw new Error(e.message);
        }
      `;

      const userCode = new Function(wrappedCode);
      const result = userCode();

      // For array outputs, use deep comparison
      // For strings, compare case-insensitively
      const passed = Array.isArray(testCase.expectedOutput) ?
        JSON.stringify(result) === JSON.stringify(testCase.expectedOutput) :
        typeof result === 'string' && typeof testCase.expectedOutput === 'string' ?
          result.toLowerCase() === testCase.expectedOutput.toLowerCase() :
          result === testCase.expectedOutput;

      return {
        passed,
        actual: result,
        expected: testCase.expectedOutput,
        input: testCase.input
      };
    } else if (challenge.type === 'variables') {
      // Rest of the existing variables validation logic
      const expectedValidation = testCase.expectedOutput as Record<string, TypeValidation>;
      const variableNames = Object.keys(expectedValidation);
      
      const returnStatement = variableNames
        .map(name => `${name}: typeof ${name} !== 'undefined' ? ${name} : undefined`)
        .join(',');

      const wrappedCode = `
        try {
          ${code}
          return {
            ${returnStatement}
          };
        } catch (e) {
          return { error: e.message };
        }
      `;

      const userCode = new Function('console', wrappedCode);
      const result = userCode(console);

      if (result && 'error' in result) {
        return {
          passed: false,
          actual: result.error,
          expected: testCase.expectedOutput,
          input: testCase.input
        };
      }

      const validateType = (value: unknown, validation: TypeValidation): boolean => {
        if (validation.type === 'array') {
          if (!Array.isArray(value)) return false;
          if (validation.length !== undefined && value.length !== validation.length) return false;
          if (validation.elementType) {
            return value.every(element => typeof element === validation.elementType);
          }
          return true;
        }

        if (validation.type === 'object') {
          if (typeof value !== 'object' || value === null) return false;
          if (!validation.properties) return true;

          return Object.entries(validation.properties).every(([prop, propValidation]) => {
            const propValue = (value as Record<string, unknown>)[prop];
            return validateType(propValue, propValidation);
          });
        }

        return typeof value === validation.type;
      };

      // each variable
      let allValid = true;
      for (const [varName, validation] of Object.entries(expectedValidation)) {
        if (!(varName in result)) {
          return {
            passed: false,
            actual: `Variable '${varName}' is not defined`,
            expected: testCase.expectedOutput,
            input: testCase.input
          };
        }

        const isValid = validateType(result[varName], validation);
        allValid = allValid && isValid;
      }

      return {
        passed: allValid,
        actual: result,
        expected: testCase.expectedOutput,
        input: testCase.input
      };
    }

    throw new Error(`Unsupported challenge type: ${challenge.type}`);

  } catch (error) {
    return {
      passed: false,
      actual: error instanceof Error ? error.message : 'Unknown error',
      expected: testCase.expectedOutput,
      input: testCase.input
    };
  }
};