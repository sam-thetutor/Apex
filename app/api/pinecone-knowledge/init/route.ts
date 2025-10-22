import { NextRequest, NextResponse } from 'next/server'
import { addInitialBaseKnowledgeToPinecone } from '@/lib/ai/pinecone-initial-knowledge'

export async function POST(request: NextRequest) {
  try {
    await addInitialBaseKnowledgeToPinecone()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Initial Base knowledge added to Pinecone successfully' 
    })
  } catch (error) {
    console.error('Error adding initial Base knowledge to Pinecone:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add initial knowledge'
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}
