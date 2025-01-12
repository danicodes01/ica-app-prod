import { seedData } from '@/app/api/scripts/data';
import connectDB from '@/lib/db/mongoose';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';

import { seedPlanets } from './planetSeeder';

export async function seedDatabase(options = { dropCollections: true }) {
  try {
    await connectDB();
    
    if (options.dropCollections) {
      console.log('Dropping existing collections...');
      const collections = ['users', 'planets', 'stations', 'progress', 'attempts'];
      await Promise.all(
        collections.map(async (collectionName) => {
          try {
            await mongoose.connection.db!.dropCollection(collectionName);
          } catch (e) {
            if (e instanceof MongoServerError && e.code !== 26) {
              console.warn(`Failed to drop collection ${collectionName}:`, e);
            }
          }
        })
      );
    }

    console.log('Starting database seed...');

    const planets = await seedPlanets(seedData.planets);
    if (!planets.success) throw new Error('Planet seeding failed: ' + planets.error);

    console.log('Database seeding completed successfully!');

    return {
      success: true,
      data: {
        planets, 
      },
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export {
  seedPlanets,
};