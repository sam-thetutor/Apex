import { NextRequest, NextResponse } from 'next/server'
import { processMessage } from '@/lib/ai/conversation-orchestrator'
import { fetchPortfolio } from '@/lib/blockchain/balance-service'

// In-memory conversation storage (in production, use Redis or database)
const conversations = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId } = await request.json()
    
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      )
    }
    
    // Get or create conversation
    const convId = conversationId || `conv_${userId}_${Date.now()}`
    let conversation = conversations.get(convId) || { messages: [] }
    
    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    })
    
    // Fetch portfolio data asynchronously (non-blocking)
    let portfolio: Array<{
      symbol: string
      balance: string
      usdValue: string
    }> = []
    let recentTransactions: Array<any> = []
    
    // Start portfolio fetch but don't wait for it
    const portfolioPromise = fetchPortfolio(userId).catch(error => {
      console.error('Error fetching portfolio:', error)
      return []
    })
    
    // For balance-related questions, wait for portfolio
    const isBalanceQuestion = message.toLowerCase().includes('balance') || 
                             message.toLowerCase().includes('portfolio') ||
                             message.toLowerCase().includes('eth') ||
                             message.toLowerCase().includes('token')
    
    if (isBalanceQuestion) {
      try {
        portfolio = await portfolioPromise
        console.log('Fetched portfolio for balance question:', portfolio)
      } catch (error) {
        console.error('Error fetching portfolio for balance question:', error)
        portfolio = []
      }
    }
    
    // Prepare context
    const context = {
      userAddress: userId,
      portfolio: portfolio,
      recentTransactions: recentTransactions,
      conversationHistory: conversation.messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    }
    
    // Process message with orchestrator
    const result = await processMessage(message, context)
    
    // Add assistant response
    const assistantMessage = {
      role: 'assistant' as const,
      content: result.response,
      timestamp: new Date()
    }
    
    conversation.messages.push(assistantMessage)
    
    // Save conversation
    conversations.set(convId, conversation)
    
    // Format response
    return NextResponse.json({
      success: true,
      response: result.response,
      intent: result.intent,
      actionData: result.actionData,
      needsAction: result.needsAction,
      conversationId: convId
    })
    
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }
    
    const conversation = conversations.get(conversationId)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      messages: conversation.messages
    })
    
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
}
