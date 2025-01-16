import UserProgressSchema from '@/models/userProgress/schema';
import { 
  IUserProgressDocument, 
  IUserProgressModel 
} from '@/types/models/userProgress';
import mongoose from 'mongoose';

const getUserProgressModel = (): IUserProgressModel => {
  try {
    return mongoose.model<IUserProgressDocument, IUserProgressModel>('UserProgress');
  } catch {
    return mongoose.model<IUserProgressDocument, IUserProgressModel>('UserProgress', UserProgressSchema);
  }
};

export async function deleteUserProgress(): Promise<{ 
  success: boolean;
  error?: string; 
}> {
  const UserProgress = getUserProgressModel();
  try {
    await UserProgress.deleteMany({});
    console.log('Successfully deleted all user progress');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}