'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import { User, UserProgress, Planet } from '@/models'
import { PlanetType } from '@/types/shared/planetTypes'
import { revalidatePath } from 'next/cache'
import { ISerializedUserProgress, IUserProgressDocument } from '@/types/models/userProgress'
import { IDBPlanet, IDBStation } from '@/types/models/planet'


function serializeProgress(progress: IUserProgressDocument): ISerializedUserProgress {
  return {
    ...progress.toObject(),
    _id: progress._id.toString(),
    userId: progress.userId.toString(),
    lastAttemptAt: progress.lastAttemptAt?.toISOString(),
    completedAt: progress.completedAt?.toISOString(),
    createdAt: progress.createdAt?.toISOString(),
    updatedAt: progress.updatedAt?.toISOString()
  };
}

interface StationAttemptResult {
  progress: ISerializedUserProgress;
  xpAwarded: number;
  currencyAwarded: number;
  stationsLocked: boolean;
  resetToStation?: number;
}


export async function getStationProgress(planetType: PlanetType) {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new Error("Unauthorized")
    }
  
    try {
      await connectDB()
      
      const user = await User.findOne({ email: session.user.email })
      if (!user) {
        throw new Error("User not found")
      }
  
      const progress = await UserProgress.find({ 
        userId: user._id,
        planetType 
      }).sort('stationOrder').lean<IUserProgressDocument[]>()
  
      return progress.map(prog => ({
        ...prog,
        _id: prog._id.toString(),
        userId: prog.userId.toString(),
        lastAttemptAt: prog.lastAttemptAt?.toISOString(),
        completedAt: prog.completedAt?.toISOString(),
        createdAt: prog.createdAt?.toISOString(),
        updatedAt: prog.updatedAt?.toISOString()
      }))
  
    } catch (error) {
      console.error('Error fetching station progress:', error)
      throw new Error('Failed to fetch station progress')
    }
  }


  export async function updateStationAttempt(
    planetType: PlanetType,
    stationOrder: number,
    succeeded: boolean
  ): Promise<StationAttemptResult> {
    console.log('[Server] updateStationAttempt called:', {
      planetType,
      stationOrder,
      succeeded
    });
    const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    console.log('[Server] No session found');
    throw new Error("Unauthorized");
  }
  
    try {
      await connectDB();
      
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        console.log('[Server] User not found:', session.user.email);
        throw new Error("User not found");
      }

      console.log('[Server] Found user:', user._id);
  
      const planet = await Planet.findOne({ type: planetType }).lean<IDBPlanet>();
      if (!planet) {
        console.log('[Server] Planet not found:', planetType);
        throw new Error("Planet not found");
      }
  
      const station = planet.stations.find((s: IDBStation) => s.order === stationOrder);
      if (!station) {
        throw new Error("Station not found");
      }
  
      // Get current progress
      let progress = await UserProgress.findOne({
        userId: user._id,
        planetType,
        stationOrder
      });

      console.log('[Server] Current progress:', progress);
  
      const initialStatus = progress?.status;
      const wasAlreadyCompleted = initialStatus === 'COMPLETED';
  
      // If station has never been attempted before, create initial progress
      if (!progress) {
        progress = await UserProgress.create({
          userId: user._id,
          planetType,
          stationOrder,
          status: 'IN_PROGRESS',
          currentAttempts: 0,
          timesCompleted: 0,
          lastAttemptAt: new Date()
        });
      }
  
      // sad path
      if (!succeeded) {
        console.log('[Server] Handling failure case');
        if (stationOrder === 1) {
          progress = await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder },
            {
              status: 'IN_PROGRESS',
              $inc: { currentAttempts: 1 },
              lastAttemptAt: new Date()
            },
            { new: true }
          );
  
          return {
            progress: serializeProgress(progress),
            xpAwarded: 0,
            currencyAwarded: 0,
            stationsLocked: false
          };
        }
  
        if (progress.currentAttempts >= 2) {
          console.log('[Server] Max attempts reached, locking station');
          // Lock current station and reset attempts
          progress = await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder },
            {
              status: 'LOCKED',
              currentAttempts: 0,
              lastAttemptAt: new Date()
            },
            { new: true }
          );
  
          // Reset previous station to IN_PROGRESS
          await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder: stationOrder - 1 },
            {
              status: 'IN_PROGRESS',
              currentAttempts: 0,
              lastAttemptAt: new Date()
            }
          );

          console.log('[Server] Station locked, reset to previous station');

  
          return {
            progress: serializeProgress(progress),
            xpAwarded: 0,
            currencyAwarded: 0,
            stationsLocked: true,
            resetToStation: stationOrder - 1
          };
        } else {
          // Increment attempts for non-first stations
          progress = await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder },
            {
              status: 'IN_PROGRESS',
              $inc: { currentAttempts: 1 },
              lastAttemptAt: new Date()
            },
            { new: true }
          );
        }
      } else {
        // Handle success case
        const previousProgress = await UserProgress.findOne({
          userId: user._id,
          planetType,
          stationOrder
        });

        const hasCompletedBefore = previousProgress?.timesCompleted > 0;

        progress = await UserProgress.findOneAndUpdate(
          { userId: user._id, planetType, stationOrder },
          {
            status: 'COMPLETED',
            currentAttempts: 0,
            $inc: { timesCompleted: 1 },
            ...(wasAlreadyCompleted ? {} : { completedAt: new Date() }),
            lastAttemptAt: new Date()
          },
          { new: true }
        );

        if (!hasCompletedBefore) {
          await User.findByIdAndUpdate(user._id, {
            $inc: { 
              totalXP: station.xpReward,
              totalCurrency: station.currencyReward
            }
          });
        }
  
          // Unlock next station
          const nextStation = planet.stations.find((s: IDBStation) => s.order === stationOrder + 1);
          if (nextStation) {
            await UserProgress.findOneAndUpdate(
              { 
                userId: user._id, 
                planetType, 
                stationOrder: stationOrder + 1 
              },
              {
                status: 'IN_PROGRESS',
                currentAttempts: 0,
                lastAttemptAt: new Date()
              },
              { upsert: true }
            );
          }

  
          return {
            progress: serializeProgress(progress),
            xpAwarded: !hasCompletedBefore ? station.xpReward : 0,
            currencyAwarded: !hasCompletedBefore ? station.currencyReward : 0,
            stationsLocked: false
          };
        }
        return {
          progress: serializeProgress(progress),
          xpAwarded: 0,
          currencyAwarded: 0,
          stationsLocked: false
        };
    
      } catch (error) {
        console.error('Error updating station attempt:', error);
        throw error;
      }
    }

export async function unlockNextStation(
  planetType: PlanetType,
  currentStationOrder: number
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  try {
    await connectDB()
    
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      throw new Error("User not found")
    }

    // Find the next station
    const nextStationOrder = currentStationOrder + 1
    
    // Check if next station progress already exists
    const existingProgress = await UserProgress.findOne({
      userId: user._id,
      planetType,
      stationOrder: nextStationOrder
    })

    // If no progress exists and current station is completed, create unlocked progress
    if (!existingProgress) {
        const currentProgress = await UserProgress.findOne({
          userId: user._id,
          planetType,
          stationOrder: currentStationOrder,
          status: 'COMPLETED'
        })
    
        if (currentProgress) {
          const newProgress = await UserProgress.create({
            userId: user._id,
            planetType,
            stationOrder: nextStationOrder,
            status: 'IN_PROGRESS',
            currentAttempts: 0,
            lastAttemptAt: new Date()
          })
    
          return {
            ...newProgress.toObject(),
            _id: newProgress._id.toString(),
            userId: newProgress.userId.toString(),
            lastAttemptAt: newProgress.lastAttemptAt?.toISOString(),
            createdAt: newProgress.createdAt?.toISOString(),
            updatedAt: newProgress.updatedAt?.toISOString()
          }
        }
      }
    
      revalidatePath('/game')
  } catch (error) {
    console.error('Error unlocking next station:', error)
    throw new Error('Failed to unlock next station')
  }
}