import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    
    const Planet = mongoose.models.Planet;
    if (Planet) {
      await Planet.createIndexes();
      console.log('Planet indexes ensured');
    }

    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;



// // lib/db/mongoose.ts
// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env');
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export default async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   // Clear existing connection
//   if (mongoose.connection.readyState !== 0) {
//     await mongoose.connection.close();
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//     return cached.conn;
//   } catch (err) {
//     cached.promise = null;
//     throw err;
//   }
// }