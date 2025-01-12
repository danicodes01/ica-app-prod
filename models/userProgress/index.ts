import { model, models } from 'mongoose';
import UserProgressSchema from './schema';
import { attachMethods } from './methods';
import { IUserProgressDocument } from '@/types/models/userProgress';

attachMethods(UserProgressSchema);

export const UserProgress = (models?.UserProgress || model<IUserProgressDocument>('UserProgress', UserProgressSchema));