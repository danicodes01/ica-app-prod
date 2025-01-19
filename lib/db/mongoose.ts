import mongoose from 'mongoose';
import databaseConfig from '@/config/database';

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnectionCache: {
    [key: string]: ConnectionCache;
  } | undefined;
}

const getMongoURI = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }
  return uri;
};

const cached = global.mongooseConnectionCache || {};

if (!global.mongooseConnectionCache) {
  global.mongooseConnectionCache = cached;
}

export default async function connectDB() {
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = databaseConfig[env]; 
  
  if (!cached[dbConfig.name]) {
    cached[dbConfig.name] = { conn: null, promise: null };
  }

  if (cached[dbConfig.name].conn) {
    return cached[dbConfig.name].conn;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (!cached[dbConfig.name].promise) {
    const opts = {
      bufferCommands: false,
      dbName: dbConfig.name,
      ...dbConfig.options  
    };

    const mongoURI = getMongoURI();

    cached[dbConfig.name].promise = mongoose
      .connect(mongoURI, opts)
      .then((mongoose) => {
        console.log(`Connected to ${dbConfig.name} database`);
        return mongoose;
      });
  }

  try {
    cached[dbConfig.name].conn = await cached[dbConfig.name].promise;

    const models = mongoose.models;
    for (const modelName in models) {
      await models[modelName].createIndexes();
      console.log(`${modelName} indexes ensured in ${dbConfig.name} database`);
    }

    return cached[dbConfig.name].conn;
  } catch (err) {
    cached[dbConfig.name].promise = null;
    console.error(`Error connecting to ${dbConfig.name} database:`, err);
    throw err;
  }
}

export async function disconnectDB() {
  const env = process.env.NODE_ENV || 'development';
  const dbConfig = databaseConfig[env];
  
  if (cached[dbConfig.name]?.conn) {
    await mongoose.disconnect();
    cached[dbConfig.name].conn = null;
    cached[dbConfig.name].promise = null;
  }
}

