import { Schema } from 'mongoose';
import { IPlanet } from '@/types/models/planet';

const PlanetSchema = new Schema<IPlanet>(
  {
    name: { type: String, required: true, unique: true },
    type: { 
      type: String, 
      required: true,
      enum: ['missionControl', 'chromanova', 'syntaxia', 'quantumCore'] 
    },
    description: { type: String, required: true },
    requiredXP: { type: Number, required: true, default: 0 },
    order: { type: Number, required: true, unique: true }, 
    stations: [{
      stationId: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
      order: { type: Number, required: true },
      xpReward: { type: Number, required: true },
      currencyReward: { type: Number, required: true },
      challenge: {
        instructions: { type: String, required: true },
        initialCode: { type: String, required: true },
        testCases: [{
          input: { type: Schema.Types.Mixed, required: true },
          expectedOutput: { type: Schema.Types.Mixed, required: true }
        }]
      }
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PlanetSchema.index({ type: 1 });

export default PlanetSchema;