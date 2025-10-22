import { NextRequest, NextResponse } from 'next/server'
import { addSampleUsers } from '@/lib/db/sample-users'

/**
 * POST /api/leaderboard/sample
 * Add sample users to the leaderboard for testing
 */
export async function POST(request: NextRequest) {
  try {
    const result = await addSampleUsers()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Added ${result.count} sample users to the leaderboard`,
        count: result.count
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error adding sample users:', error)
    return NextResponse.json(
      { error: 'Failed to add sample users' },
      { status: 500 }
    )
  }
}
