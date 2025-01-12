import { Document, Model, Types } from 'mongoose';

type PlanetType = 'missionControl' | 'chromanova' | 'syntaxia' | 'quantumCore';
type ProgressStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface IUserProgress {
  userId: Types.ObjectId;
  planetType: PlanetType;
  stationOrder: number;
  status: ProgressStatus;
  currentAttempts: number;
  timesCompleted: number;
  lastAttemptAt?: Date;
  completedAt?: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface IUserProgressDocument extends IUserProgress, Document {
  _id: Types.ObjectId;
}

export interface IUserProgressModel extends Model<IUserProgressDocument> {
  getStationProgress(
    userId: string,
    planetType: string
  ): Promise<IUserProgressDocument[]>;
  
  updateStationAttempt(
    userId: string,
    planetType: string,
    stationOrder: number,
    succeeded: boolean
  ): Promise<IUserProgressDocument>;
}

export const isUserProgress = (value: unknown): value is IUserProgress => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userId' in value &&
    'planetType' in value &&
    'stationOrder' in value &&
    'status' in value &&
    'currentAttempts' in value &&
    'timesCompleted' in value
  );
};