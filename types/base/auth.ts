import { IUserDocument } from '@/types/models/user';

export interface AuthUser extends Pick<IUserDocument, 'email' | 'name' | 'image' > {
  id: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user?: AuthUser;
  error?: string;
}