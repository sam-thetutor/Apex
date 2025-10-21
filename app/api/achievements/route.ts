import { NextRequest, NextResponse } from 'next/server'
import { getUserProgress, completeTutorial, getUserAchievements } from '@/lib/db/user-service'

/**
 * GET /api/achievements?userAddress=0x...
 * Fetch user's achievements and progress
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      )
    }

    const achievements = await getUserAchievements(userAddress)
    const userProgress = await getUserProgress(userAddress)

    return NextResponse.json({
      success: true,
      data: {
        achievements,
        progress: userProgress,
      }
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/achievements
 * Complete a tutorial and award points
 * Body: { userAddress, tutorialId, quizScore }
 */
export async function POST(request: NextRequest) {
  try {
    const { userAddress, tutorialId, quizScore } = await request.json()

    if (!userAddress || !tutorialId) {
      return NextResponse.json(
        { error: 'User address and tutorial ID are required' },
        { status: 400 }
      )
    }

    const result = await completeTutorial(userAddress, tutorialId, quizScore || 100)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Tutorial already completed or failed to complete' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned: result.pointsEarned,
        achievementsUnlocked: result.achievementsUnlocked,
        message: `Tutorial completed! Earned ${result.pointsEarned} points.`
      }
    })

  } catch (error) {
    console.error('Error completing tutorial:', error)
    return NextResponse.json(
      { error: 'Failed to complete tutorial' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/achievements
 * Update user progress (for future use)
 * Body: { userAddress, progressData }
 */
export async function PUT(request: NextRequest) {
  try {
    const { userAddress, progressData } = await request.json()

    if (!userAddress || !progressData) {
      return NextResponse.json(
        { error: 'User address and progress data are required' },
        { status: 400 }
      )
    }

    // This endpoint can be used for updating other progress metrics
    // like transaction counts, fees saved, etc.
    
    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully'
    })

  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
