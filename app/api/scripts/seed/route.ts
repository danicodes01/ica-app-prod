import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/db/mongoose';
import { seedPlanets } from '@/lib/seed/planetSeeder';
import { deleteUsers } from '@/lib/seed/userSeeder';
import { deleteUserProgress } from '@/lib/seed/userProgressSeeder';
import { seedData } from '../data';
import mongoose from 'mongoose';

async function isAuthorizedRequest() {
  const headerList = await headers();
  const seedToken = headerList.get('x-seed-token');
  
  return seedToken === process.env.SEED_TOKEN;
}

interface SeedResult {
  success: boolean;
  error?: string;
}

async function handleSeedOperation<T extends SeedResult>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  const result = await operation();
  if (!result.success) {
    throw new Error(result.error || errorMessage);
  }
  return result;
}

export async function POST() {
  if (!await isAuthorizedRequest()) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Unauthorized' 
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    console.log('Starting seeding process...');

    console.log('Dropping existing collections...');
    await Promise.all([
      mongoose.connection.dropCollection('userProgress'),
      mongoose.connection.dropCollection('users'),
      mongoose.connection.dropCollection('planets'),
    ]).catch(err => {
      console.log(err, 'Some collections may not exist yet, continuing...');
    });

    await handleSeedOperation(
      () => deleteUserProgress(),
      'User progress deletion failed',
    );
    await handleSeedOperation(() => deleteUsers(), 'Users deletion failed');

    const [planetResult] = await Promise.all([
      handleSeedOperation(
        () => seedPlanets(seedData.planets),
        'Planet seeding failed',
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        planets: planetResult.planets?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error in seed route:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during seeding',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!await isAuthorizedRequest()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
      },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const [planetCount] = await Promise.all([
      mongoose.models.Planet.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        planets: planetCount,
      },
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred checking seed status',
      },
      { status: 500 },
    );
  }
}
