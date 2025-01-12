import { Document, Model, Types } from 'mongoose';

export interface IUserAuth {
  readonly password: string;
  readonly emailVerified?: Date;
}


export interface IUser extends IUserAuth {
  readonly email: string;
  readonly name: string;
  readonly image?: string;
  totalXP: number;
  totalCurrency: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
_id: Types.ObjectId,

}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

export const isUser = (value: unknown): value is IUser => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'name' in value &&
    'totalXP' in value &&
    'totalCurrency' in value 
  );
};