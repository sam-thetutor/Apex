import { ChatOpenAI } from '@langchain/openai'
import { sendTool } from '@/lib/ai/tools/send-tool'
import { swapTool } from '@/lib/ai/tools/swap-tool'
import { getRelevantContext, buildQuestionPrompt } from './context-helper'

const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.3,
})

const questionLlm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7, // Higher temperature for more creative/helpful answers
})

interface ConversationContext {
  userAddress: string
  portfolio: Array<{
    symbol: string
    balance: string
    usdValue: string
  }>
  recentTransactions: Array<any>
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export async function processMessage(
  message: string,
  context: ConversationContext
): Promise<{
  intent: string
  response: string
  actionData?: any
  needsAction: boolean
}> {
  try {
    // First, determine intent and extract entities
    const intentPrompt = `You are a helpful AI assistant for Base blockchain. Analyze the user's message and determine their intent.

User's Current Message: "${message}"

Recent Conversation History:
${context.conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

User's Portfolio: ${JSON.stringify(context.portfolio, null, 2)}
Recent Transactions: ${context.recentTransactions.length} transactions

Determine the intent from these options:
1. "send" - User wants to send/transfer tokens
2. "swap" - User wants to exchange/swap tokens
3. "balance" - User wants to check balance/portfolio
4. "question" - User has a general question
5. "add_token" - User wants to add a custom token to their portfolio

Extract any relevant entities (token symbols, amounts, addresses).

IMPORTANT: For swap intents, extract:
- sellToken: The token to sell (e.g., "ETH", "USDC")
- buyToken: The token to buy (e.g., "USDC", "DAI")
- amount: The amount to sell

Examples:
"swap 0.5 ETH for USDC" → {"intent":"swap","entities":{"sellToken":"ETH","buyToken":"USDC","amount":"0.5"}}
"swap eth to usdc" → {"intent":"swap","entities":{"sellToken":"ETH","buyToken":"USDC","amount":""}}
"swap 100 USDC for DAI" → {"intent":"swap","entities":{"sellToken":"USDC","buyToken":"DAI","amount":"100"}}

Respond with ONLY valid JSON:
{
  "intent": "send",
  "entities": {"token": "USDC", "amount": "100", "recipient": "0x..."},
  "confidence": 0.95,
  "needsClarification": false,
  "clarificationQuestion": ""
}`

    const intentResponse = await llm.invoke(intentPrompt)
    const intentResult = JSON.parse(intentResponse.content as string)

    // Handle based on intent
    if (intentResult.intent === 'send') {
      return await handleSendIntent(intentResult.entities, context)
    } else if (intentResult.intent === 'swap') {
      return await handleSwapIntent(intentResult.entities, context)
    } else if (intentResult.intent === 'balance') {
      return await handleBalanceIntent(context, message)
    } else if (intentResult.intent === 'add_token') {
      return await handleAddTokenIntent(intentResult.entities, context)
    } else if (intentResult.intent === 'question') {
      return await handleQuestionIntent(message, context)
    } else if (intentResult.needsClarification) {
      return {
        intent: 'clarification',
        response: intentResult.clarificationQuestion,
        needsAction: false
      }
    } else {
      return {
        intent: 'unknown',
        response: 'I apologize, but I didn\'t understand that. Could you please rephrase?',
        needsAction: false
      }
    }
  } catch (error) {
    console.error('Error processing message:', error)
    return {
      intent: 'error',
      response: 'I encountered an error. Please try again.',
      needsAction: false
    }
  }
}

async function handleSendIntent(
  entities: Record<string, any>,
  context: ConversationContext
) {
  const { token, amount, recipient } = entities

  if (!token || !amount || !recipient) {
    return {
      intent: 'send',
      response: "I need more information to send tokens. Please provide:\n- Which token to send (e.g., USDC, ETH)\n- How much to send\n- The recipient's wallet address or @username",
      needsAction: false
    }
  }

  try {
    const result = await sendTool.func({
      tokenSymbol: token,
      recipientAddress: recipient,
      amount: amount.toString(),
      walletAddress: context.userAddress
    })

    const parsedResult = JSON.parse(result)

    if (!parsedResult.success) {
      return {
        intent: 'send',
        response: `❌ ${parsedResult.message}`,
        needsAction: false
      }
    }

    return {
      intent: 'send',
      response: `Ready to send ${parsedResult.amount} ${parsedResult.tokenSymbol} to ${parsedResult.recipientAddress}. Please confirm.`,
      actionData: {
        type: 'send',
        tokenSymbol: parsedResult.tokenSymbol,
        tokenAddress: parsedResult.tokenAddress,
        tokenDecimals: parsedResult.tokenDecimals,
        recipientAddress: parsedResult.recipientAddress,
        amount: parsedResult.amount,
      },
      needsAction: true
    }
  } catch (error) {
    return {
      intent: 'send',
      response: 'Failed to prepare send transaction. Please try again.',
      needsAction: false
    }
  }
}

async function handleSwapIntent(
  entities: Record<string, any>,
  context: ConversationContext
) {
  const { sellToken, buyToken, amount } = entities

  if (!sellToken || !buyToken || !amount) {
    return {
      intent: 'swap',
      response: "I need more information to swap tokens. Please provide:\n- Which token to sell (e.g., ETH, USDC)\n- Which token to buy (e.g., USDC, DAI)\n- How much to sell",
      needsAction: false
    }
  }

  try {
    const result = await swapTool.func({
      sellToken,
      buyToken,
      amount: amount.toString(),
      walletAddress: context.userAddress
    })

    const parsedResult = JSON.parse(result)

    if (!parsedResult.success) {
      return {
        intent: 'swap',
        response: `❌ ${parsedResult.message}`,
        needsAction: false
      }
    }

    return {
      intent: 'swap',
      response: `Ready to swap ${parsedResult.amount} ${parsedResult.sellToken} for approximately ${parsedResult.estimatedOutput} ${parsedResult.buyToken}. Please confirm.`,
      actionData: {
        type: 'swap',
        sellToken: parsedResult.sellToken,
        buyToken: parsedResult.buyToken,
        amount: parsedResult.amount,
        estimatedOutput: parsedResult.estimatedOutput,
        rate: parsedResult.rate,
        slippage: parsedResult.slippage,
        sellTokenAddress: parsedResult.sellTokenAddress,
        buyTokenAddress: parsedResult.buyTokenAddress,
        sellTokenDecimals: parsedResult.sellTokenDecimals,
        buyTokenDecimals: parsedResult.buyTokenDecimals,
      },
      needsAction: true
    }
  } catch (error) {
    return {
      intent: 'swap',
      response: 'Failed to prepare swap transaction. Please try again.',
      needsAction: false
    }
  }
}

async function handleBalanceIntent(context: ConversationContext, message: string) {
  const portfolio = context.portfolio
  const lowerMessage = message.toLowerCase()
  
  // Check if user is asking for a specific token (like ETH)
  const ethKeywords = ['eth', 'ethereum', 'ether']
  const isAskingForETH = ethKeywords.some(keyword => lowerMessage.includes(keyword))
  
  if (isAskingForETH) {
    // Find ETH in portfolio
    const ethToken = portfolio.find(token => token.symbol.toLowerCase() === 'eth')
    if (ethToken) {
      return {
        intent: 'balance',
        response: `Your ETH balance: ${ethToken.balance} ETH ($${ethToken.usdValue})`,
        needsAction: false
      }
    } else {
      return {
        intent: 'balance',
        response: `Your ETH balance: 0.000000 ETH ($0.00)\n\nYour wallet appears to be empty. Would you like to add some tokens?`,
        needsAction: false
      }
    }
  }
  
  // Handle general portfolio request
  const totalValue = portfolio.reduce((sum, token) => {
    return sum + parseFloat(token.usdValue)
  }, 0)

  let response = `Your portfolio balance:\n\n`

  if (portfolio.length === 0) {
    response = "Your portfolio is empty. Would you like to add some tokens?"
  } else {
    portfolio.forEach(token => {
      response += `• ${token.symbol}: ${token.balance} ($${token.usdValue})\n`
    })
    response += `\n💰 Total Value: $${totalValue.toFixed(2)}`
  }

  return {
    intent: 'balance',
    response,
    needsAction: false
  }
}

async function handleAddTokenIntent(
  entities: Record<string, any>,
  context: ConversationContext
) {
  const { tokenAddress } = entities

  if (!tokenAddress) {
    return {
      intent: 'add_token',
      response: "I need the token contract address to add it to your portfolio.\n\nPlease provide:\n- The token contract address (e.g., 0x1234...)\n\nExample: \"Add token 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\"",
      needsAction: false
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/ai/add-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress: context.userAddress,
        tokenAddress: tokenAddress
      })
    })

    const result = await response.json()

    if (!result.success) {
      return {
        intent: 'add_token',
        response: `❌ Failed to Add Token\n\n${result.error}\n\nPlease make sure:\n• The contract address is valid on Base\n• The address is for an ERC-20 token\n• The token contract is deployed`,
        needsAction: false
      }
    }

    return {
      intent: 'add_token',
      response: `✅ Token Added Successfully!\n\n📝 **${result.token.symbol}** (${result.token.name})\n\n📍 Address: \`${tokenAddress}\`\n\nYou can now:\n• Check your balance: "How much ${result.token.symbol} do I have?"\n• Send tokens: "Send 100 ${result.token.symbol} to @user"\n• Swap tokens: "Swap 50 ${result.token.symbol} for USDC"\n• View in portfolio: Visit the Portfolio page\n\n💡 Your portfolio will update automatically!`,
      needsAction: false
    }
  } catch (error) {
    return {
      intent: 'add_token',
      response: 'Failed to add token. Please try again.',
      needsAction: false
    }
  }
}

async function handleQuestionIntent(
  message: string,
  context: ConversationContext
) {
  try {
    // Determine what context is relevant
    const relevantContext = getRelevantContext(message, context)
    
    // Build dynamic prompt with only relevant context
    const prompt = buildQuestionPrompt(message, context, relevantContext)
    
    // Use questionLlm (higher temperature) for more helpful answers
    const response = await questionLlm.invoke(prompt)
    
    return {
      intent: 'question',
      response: response.content as string,
      needsAction: false
    }
  } catch (error) {
    console.error('Error in question handler:', error)
    return {
      intent: 'question',
      response: 'I apologize, but I encountered an error while processing your question. Please try again.',
      needsAction: false
    }
  }
}

