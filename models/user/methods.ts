
// import { IUserDocument, IUserModel } from '@/types/models/user';
// import { Schema } from 'mongoose';


// const staticMethods = {
//   async findByEmail(this: IUserModel, email: string): Promise<IUserDocument | null> {
//     return this.findOne({ email });
//   },

// };

// export const attachMethods = (schema: Schema<IUserDocument, IUserModel>): void => {
//   schema.statics = { ...schema.statics, ...staticMethods };
// };