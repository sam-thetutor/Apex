import { NextRequest, NextResponse } from 'next/server'
import { addInitialBaseKnowledge } from '@/lib/ai/initial-base-knowledge'

export async function POST(request: NextRequest) {
  try {
    await addInitialBaseKnowledge()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Initial Base knowledge added successfully' 
    })
  } catch (error) {
    console.error('Error adding initial Base knowledge:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add initial knowledge'
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}
