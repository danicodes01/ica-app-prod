import { model, models } from 'mongoose';
import UserSchema from './schema';
import { IUserDocument } from '@/types/models/user';


export const User = models?.User || model<IUserDocument>('User', UserSchema);