import mongoose from 'mongoose';
import UserSchema from '@/models/user/schema';
import { IUserDocument, IUserModel } from '@/types/models/user';

const getUserModel = (): IUserModel => {
  try {
    return mongoose.model<IUserDocument, IUserModel>('User');
  } catch {
    return mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
  }
};

export async function deleteUsers(): Promise<{ 
  success: boolean;
  error?: string; 
}> {
  const User = getUserModel();
  try {
    await User.deleteMany({});
    console.log('Successfully deleted all users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}