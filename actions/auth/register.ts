
'use server';
import { User } from '@/models/user';
import { RegisterInput, AuthResult } from '@/types/base/auth';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongoose';

export const register = async ({
  email,
  password,
  name,
}: RegisterInput): Promise<AuthResult> => {
  try {
    await connectDB();

    if (!email || !password || !name) {
      return { error: 'All fields are required' };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email is already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      totalXP:0,
      totalCurrency: 0


    });

    const savedUser = await newUser.save();

    
    return { 
      user: {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'An unknown error occurred during registration' };
  }
};
