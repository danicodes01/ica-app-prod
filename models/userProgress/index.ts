import { model, models } from 'mongoose';
import UserProgressSchema from './schema';
import { IUserProgressDocument } from '@/types/models/userProgress';


export const UserProgress = (models?.UserProgress || model<IUserProgressDocument>('UserProgress', UserProgressSchema));