import { IUserProgressDocument } from '@/types/models/userProgress';
import { Schema } from 'mongoose';

const UserProgressSchema = new Schema<IUserProgressDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    planetType: { 
      type: String,
      required: true,
      enum: ['missionControl', 'chromanova', 'syntaxia', 'quantumCore']
    },
    stationOrder: { 
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['LOCKED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'LOCKED'
    },
    currentAttempts: { 
      type: Number,
      default: 0 
    },
    timesCompleted: { 
      type: Number,
      default: 0 
    },
    lastAttemptAt: Date,
    completedAt: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// UserProgressSchema.index({ userId: 1, planetType: 1, stationOrder: 1 }, { unique: true });

export default UserProgressSchema