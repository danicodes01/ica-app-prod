'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import { User, UserProgress, Planet } from '@/models'
import { PlanetType } from '@/types/shared/planetTypes'
import { revalidatePath } from 'next/cache'
import { IUserProgressDocument } from '@/types/models/userProgress'

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
  
      // Serialize the MongoDB objects
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
  
      // Get planet and station info for XP/currency rewards
      const planet = await Planet.findOne({ type: planetType })
      if (!planet) {
        throw new Error("Planet not found")
      }
  
      const station = planet.stations.find((s: { order: number }) => s.order === stationOrder)
      if (!station) {
        throw new Error("Station not found")
      }
  
      let progress = await UserProgress.findOne({
        userId: user._id,
        planetType,
        stationOrder
      })
  
      // Store the initial completion status
      const initialStatus = progress ? progress.status : null;
  
      if (!progress) {
        // Create new progress record
        progress = await UserProgress.create({
          userId: user._id,
          planetType,
          stationOrder,
          status: succeeded ? 'COMPLETED' : 'IN_PROGRESS',
          currentAttempts: succeeded ? 0 : 1,
          timesCompleted: succeeded ? 1 : 0,
          completedAt: succeeded ? new Date() : undefined,
          lastAttemptAt: new Date()
        })
  
        // If succeeded on first attempt, award XP and currency
        if (succeeded) {
          await User.findByIdAndUpdate(user._id, {
            $inc: { 
              totalXP: station.xpReward,
              totalCurrency: station.currencyReward
            }
          })
        }
      } else {
        // Update existing progress
        if (succeeded) {
          progress = await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder },
            {
              status: 'COMPLETED',
              currentAttempts: 0,
              $inc: { timesCompleted: 1 },
              completedAt: new Date(),
              lastAttemptAt: new Date()
            },
            { new: true }
          )
  
          // Only award XP and currency if this is the first time completing
          if (initialStatus !== 'COMPLETED') {
            await User.findByIdAndUpdate(user._id, {
              $inc: { 
                totalXP: station.xpReward,
                totalCurrency: station.currencyReward
              }
            })
          }
        } else {
          progress = await UserProgress.findOneAndUpdate(
            { userId: user._id, planetType, stationOrder },
            {
              status: 'IN_PROGRESS',
              $inc: { currentAttempts: 1 },
              lastAttemptAt: new Date()
            },
            { new: true }
          )
        }
      }
  
      // Serialize the progress before returning
      const serializedProgress = {
        ...progress.toObject(),
        _id: progress._id.toString(),
        userId: progress.userId.toString(),
        lastAttemptAt: progress.lastAttemptAt?.toISOString(),
        completedAt: progress.completedAt?.toISOString(),
        createdAt: progress.createdAt?.toISOString(),
        updatedAt: progress.updatedAt?.toISOString()
      }
  
      return {
        progress: serializedProgress,
        xpAwarded: succeeded && initialStatus !== 'COMPLETED' ? station.xpReward : 0,
        currencyAwarded: succeeded && initialStatus !== 'COMPLETED' ? station.currencyReward : 0
      }
    } catch (error) {
      console.error('Error updating station attempt:', error)
      throw new Error('Failed to update station attempt')
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
    
          // Serialize if we want to return it
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