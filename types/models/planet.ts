import { PlanetType } from '@/types/shared/planetTypes';
import { Types } from 'mongoose';

export type ChallengeType = 'variables' | 'function' | 'algorithm';

interface ITestCase {
  input: unknown;
  expectedOutput: unknown;
  description?: string;
}
  
  interface IChallenge {
    instructions: string;
    initialCode: string;
    testCases: ITestCase[];
    type?: ChallengeType; 
  }
  
  interface IStation {
    name: string;
    description: string;
    order: number;
    xpReward: number;
    currencyReward: number;
    challenge: IChallenge;
  }

  interface IMongoStation extends IStation {
    _id: Types.ObjectId;
    stationId: Types.ObjectId;
  }

  // used in api responses 
  export interface IDBStation extends IStation {
    _id: string;
    stationId: string;
  }
  
  export interface IPlanet {
    name: string;
    type: PlanetType;
    description: string;
    requiredXP: number;
    order: number;
    stations: IMongoStation[];
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
  }
  
  // for planet and api responses 
  export interface IDBPlanet extends Omit<IPlanet, 'stations' | '_id'> {
    _id: string;
    stations: IDBStation[];
  }
  
  export interface TestResult {
    passed: boolean;
    actual: unknown;
    expected: unknown;
    input: unknown;
    executionTime?: number;
  }
  
  
  export const isPlanet = (value: unknown): value is IPlanet => {
    return (
      typeof value === 'object' &&
      value !== null &&
      'name' in value &&
      'type' in value &&
      'description' in value &&
      'requiredXP' in value &&
      'order' in value &&
      'stations' in value
    );
  };