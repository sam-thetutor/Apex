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

    const prompt = ChatPromptTemplate.fromTemplate(`Parse user intent and extract structured information. Return ONLY valid JSON, no other text.

Supported actions: send, swap, balance, help, unknown

User message: {input}

Return ONLY this JSON format (no markdown, no explanation, no other text):
{{
  "action": "send|swap|balance|help|unknown",
  "amount": "numeric value or null",
  "token": "token symbol or null",
  "recipient": "address or null",
  "sellToken": "token symbol or null",
  "buyToken": "token symbol or null",
  "confidence": 0.0-1.0
}}

Examples:
"Send 100 USDC to @alice" → {{"action":"send","amount":"100","token":"USDC","recipient":"@alice","confidence":0.95}}
"Swap 0.5 ETH for USDC" → {{"action":"swap","amount":"0.5","sellToken":"ETH","buyToken":"USDC","confidence":0.95}}
"How much USDC do I have?" → {{"action":"balance","token":"USDC","confidence":0.9}}
"What is my portfolio?" → {{"action":"balance","confidence":0.9}}`)

    const chain = prompt.pipe(model).pipe(new StringOutputParser())
    const result = await chain.invoke({ input: message })

    // Clean up the response (remove markdown code blocks if present)
    let cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Remove any text before the first { and after the last }
    const firstBrace = cleanedResult.indexOf('{')
    const lastBrace = cleanedResult.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedResult = cleanedResult.substring(firstBrace, lastBrace + 1)
    }

    try {
      const parsed = JSON.parse(cleanedResult)
      return NextResponse.json(parsed)
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', cleanedResult)
      console.error('Parse error:', parseError)
      // Return a default response
      return NextResponse.json({
        action: 'unknown',
        confidence: 0,
        error: 'Failed to parse intent'
      })
    }
  } catch (error) {
    console.error('Error parsing intent:', error)
    return NextResponse.json(
      { error: 'Failed to parse intent', action: 'unknown', confidence: 0 },
      { status: 500 }
    )
  }
}

