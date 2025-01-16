// import { IUserProgressDocument, IUserProgressModel } from '@/types/models/userProgress';
// import { Schema } from 'mongoose';

// const staticMethods = {
//   async getStationProgress(
//     this: IUserProgressModel,
//     userId: string,
//     planetType: string
//   ) {
//     return this.find({ userId, planetType })
//       .sort('stationOrder')
//       .lean();
//   },

//   async updateStationAttempt(
//     this: IUserProgressModel,
//     userId: string,
//     planetType: string,
//     stationOrder: number,
//     succeeded: boolean
//   ) {
//     const progress = await this.findOne({
//       userId,
//       planetType,
//       stationOrder
//     });

//     if (!progress) {
//       return this.create({
//         userId,
//         planetType,
//         stationOrder,
//         status: succeeded ? 'COMPLETED' : 'IN_PROGRESS',
//         currentAttempts: succeeded ? 0 : 1,
//         timesCompleted: succeeded ? 1 : 0,
//         completedAt: succeeded ? new Date() : undefined,
//         lastAttemptAt: new Date()
//       });
//     }

//     if (succeeded) {
//       return this.findOneAndUpdate(
//         { userId, planetType, stationOrder },
//         {
//           status: 'COMPLETED',
//           currentAttempts: 0,
//           $inc: { timesCompleted: 1 },
//           completedAt: new Date(),
//           lastAttemptAt: new Date()
//         },
//         { new: true }
//       );
//     }

//     return this.findOneAndUpdate(
//       { userId, planetType, stationOrder },
//       {
//         status: 'IN_PROGRESS',
//         $inc: { currentAttempts: 1 },
//         lastAttemptAt: new Date()
//       },
//       { new: true }
//     );
//   }
// };

// export const attachMethods = (schema: Schema<IUserProgressDocument, IUserProgressModel>): void => {
//   schema.statics = { ...schema.statics, ...staticMethods };
// };