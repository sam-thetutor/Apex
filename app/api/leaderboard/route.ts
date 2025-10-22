import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'

const DATABASE_NAME = 'apex'
const USER_PROGRESS_COLLECTION = 'user_progress'

export interface LeaderboardEntry {
  userAddress: string
  totalPoints: number
  achievementsUnlocked: number
  tutorialsCompleted: number
  rank: number
}

/**
 * GET /api/leaderboard
 * Fetch top users for the leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const userAddress = searchParams.get('userAddress') // Optional: to highlight current user

    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection(USER_PROGRESS_COLLECTION)

    // Get top users by total points
    const topUsers = await collection
      .find({})
      .sort({ totalPoints: -1 })
      .limit(limit)
      .toArray()

    // Format leaderboard entries
    const leaderboard: LeaderboardEntry[] = topUsers.map((user, index) => ({
      userAddress: user.userAddress,
      totalPoints: user.totalPoints || 0,
      achievementsUnlocked: user.achievementsUnlocked?.length || 0,
      tutorialsCompleted: user.tutorialsCompleted?.length || 0,
      rank: index + 1,
    }))

    // If userAddress provided, find their rank
    let userRank: LeaderboardEntry | null = null
    if (userAddress) {
      const userCount = await collection.countDocuments({
        totalPoints: { $gt: 0 }
      })
      
      const userData = await collection.findOne({ userAddress })
      if (userData) {
        const usersAboveUser = await collection.countDocuments({
          totalPoints: { $gt: userData.totalPoints || 0 }
        })
        
        userRank = {
          userAddress: userData.userAddress,
          totalPoints: userData.totalPoints || 0,
          achievementsUnlocked: userData.achievementsUnlocked?.length || 0,
          tutorialsCompleted: userData.tutorialsCompleted?.length || 0,
          rank: usersAboveUser + 1,
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
        userRank,
        totalUsers: await collection.countDocuments({ totalPoints: { $gt: 0 } })
      }
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
