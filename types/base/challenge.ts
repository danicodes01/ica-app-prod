export type ChallengeType = 'variables' | 'function' | 'algorithm';

export interface TypeValidation {
    type: string;
    length?: number;
    elementType?: string;
    properties?: Record<string, TypeValidation>;
    value?: unknown; 
  }

  export interface ITestCase {
    input: unknown;
    expectedOutput: unknown | Record<string, TypeValidation>;
    description?: string;
  }
  
  export interface IChallenge {
    instructions: string;
    initialCode: string;
    testCases: ITestCase[];
    type?: ChallengeType;  
  }

export interface TestResult {
    passed: boolean;
    actual: unknown;
    expected: unknown;
    input: unknown;
    executionTime?: number;
  }