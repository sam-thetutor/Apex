import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { balanceTool } from '@/lib/ai/tools/balance-tool'
import { portfolioTool } from '@/lib/ai/tools/portfolio-tool'
import { sendTool } from '@/lib/ai/tools/send-tool'

export async function POST(request: NextRequest) {
  try {
    const { message, walletAddress } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simple tool routing based on message content
    const lowerMessage = message.toLowerCase()
    
    // Check if asking to send tokens (handle typos like "sendf", "send ", etc.)
    if (lowerMessage.includes('send') || lowerMessage.includes('transfer') || lowerMessage.includes('pay')) {
      // Extract parameters for send tool - more flexible pattern
      const sendPattern = /(?:send\w*|transfer|pay)\s+([\d.]+)\s+(\w+)\s+to\s+(0x[a-fA-F0-9]{40}|@\w+|\d+)/i
      const sendMatch = message.match(sendPattern)
      
      if (sendMatch) {
        const [, amount, tokenSymbol, recipient] = sendMatch
        const result = await sendTool.func({
          tokenSymbol,
          recipientAddress: recipient,
          amount,
          walletAddress: walletAddress || '0x0000000000000000000000000000000000000000',
        })
        return NextResponse.json({ response: result })
      }
    }
    
    // Check if asking for portfolio
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('all tokens') || lowerMessage.includes('total value')) {
      const result = await portfolioTool.func({
        walletAddress: walletAddress || '0x0000000000000000000000000000000000000000',
      })
      return NextResponse.json({ response: result })
    }
    
    // Check if asking for specific token balance
    const tokens = ['eth', 'usdc', 'dai', 'weth', 'aero', 'brett', 'toshi', 'axl', 'virtual', 'prime']
    for (const token of tokens) {
      if (lowerMessage.includes(token)) {
        const tokenSymbol = token.toUpperCase()
        const result = await balanceTool.func({
          tokenSymbol: tokenSymbol as 'ETH' | 'USDC' | 'DAI' | 'WETH' | 'AERO' | 'BRETT' | 'TOSHI' | 'AXL' | 'VIRTUAL' | 'PRIME',
          walletAddress: walletAddress || '0x0000000000000000000000000000000000000000',
        })
        return NextResponse.json({ response: result })
      }
    }

    // If no specific tool matches, use AI to respond
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = ChatPromptTemplate.fromTemplate(`You are a helpful AI assistant for a Base blockchain token management app.

Available tools:
- get_token_balance: Get balance of a specific token (ETH, USDC, or DAI)
- get_portfolio: Get complete portfolio with all token balances

User message: {input}

If the user is asking about balances or portfolio, suggest they ask more specifically like "How much USDC do I have?" or "What's my portfolio value?"`)

    const chain = prompt.pipe(model)
    const result = await chain.invoke({
      input: message,
    })

    return NextResponse.json({
      response: result.content as string,
    })
  } catch (error) {
    console.error('Error in agent:', error)
    return NextResponse.json(
      { error: 'Failed to process request', response: 'I encountered an error. Please try again.' },
      { status: 500 }
    )
  }
}

