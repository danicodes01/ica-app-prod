'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db/mongoose'
import { User } from '@/models'

export async function getUserStats() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  try {
    await connectDB()
    
    const user = await User.findOne({ email: session.user.email }).select('totalXP totalCurrency')
    if (!user) {
      throw new Error("User not found")
    }

    return {
      totalXP: user.totalXP || 0,
      totalCurrency: user.totalCurrency || 0
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw new Error('Failed to fetch user stats')
  }
}