// // models/planet/methods.ts
// import { IPlanetDocument, IPlanetModel } from '@/types/models/planet';
// import { Schema } from 'mongoose';

// const staticMethods = {
//   async getPlanetsForCanvas(this: IPlanetModel) {
//     return this.find({})
//       .select('name type description requiredXP order')
//       .sort('order')
//       .lean();
//   },

//   async getPlanetWithStations(this: IPlanetModel, type: string) {
//     return this.findOne({ type })
//       .select('name type description requiredXP order stations')
//       .lean();
//   }
// };

// export const attachMethods = (schema: Schema<IPlanetDocument, IPlanetModel>): void => {
//   schema.statics = { ...schema.statics, ...staticMethods };
// };