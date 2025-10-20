import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = ChatPromptTemplate.fromTemplate(`You are a crypto transaction assistant for Base blockchain. Parse user intent and extract structured information.

Supported actions:
- send: Transfer tokens to another address or FID
- swap: Exchange one token for another
- balance: Check token balance or portfolio value
- help: Provide assistance or examples

Supported tokens: ETH, USDC, DAI

User message: {input}

Respond with ONLY valid JSON in this format:
{{
  "action": "send|swap|balance|help|unknown",
  "amount": "numeric value as string",
  "token": "ETH|USDC|DAI",
  "recipient": "address or @username or FID",
  "sellToken": "token to sell",
  "buyToken": "token to buy",
  "confidence": 0.0-1.0
}}

Examples:
Input: "Send 100 USDC to @alice"
Output: {{"action":"send","amount":"100","token":"USDC","recipient":"@alice","confidence":0.95}}

Input: "Swap 0.5 ETH for USDC"
Output: {{"action":"swap","amount":"0.5","sellToken":"ETH","buyToken":"USDC","confidence":0.95}}

Input: "How much USDC do I have?"
Output: {{"action":"balance","token":"USDC","confidence":0.9}}`)

    const chain = prompt.pipe(model).pipe(new StringOutputParser())
    const result = await chain.invoke({ input: message })

    // Clean up the response (remove markdown code blocks if present)
    const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsed = JSON.parse(cleanedResult)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Error parsing intent:', error)
    return NextResponse.json(
      { error: 'Failed to parse intent', action: 'unknown', confidence: 0 },
      { status: 500 }
    )
  }
}

