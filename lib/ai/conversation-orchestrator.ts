import Groq from 'groq-sdk'
import { sendTool } from '@/lib/ai/tools/send-tool'
import { swapTool } from '@/lib/ai/tools/swap-tool'
import { getRelevantContext, buildQuestionPrompt } from './context-helper'
import { pineconeKnowledgeService } from '@/lib/vector/pinecone-knowledge'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key-for-build'
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
1. "send" - User wants to send/transfer tokens (must include recipient address or "to")
2. "swap" - User wants to exchange/swap tokens (must include "for", "to", or "with")
3. "balance" - User wants to check balance/portfolio (includes "how much", "balance", "portfolio")
4. "question" - User has a general question (includes "what", "how", "why", "explain", "tell me")
5. "add_token" - User wants to add a custom token to their portfolio

CRITICAL: Questions like "what is base", "how does base work", "explain base" should ALWAYS be classified as "question" intent, NOT "send" intent.

Extract any relevant entities (token symbols, amounts, addresses).

IMPORTANT: For swap intents, extract:
- sellToken: The token to sell (e.g., "ETH", "USDC")
- buyToken: The token to buy (e.g., "USDC", "DAI")
- amount: The amount to sell

Examples:
"what is base" → {"intent":"question","entities":{},"confidence":0.95,"needsClarification":false,"clarificationQuestion":""}
"how does base work" → {"intent":"question","entities":{},"confidence":0.95,"needsClarification":false,"clarificationQuestion":""}
"send 100 USDC to 0x123..." → {"intent":"send","entities":{"token":"USDC","amount":"100","recipient":"0x123..."},"confidence":0.95,"needsClarification":false,"clarificationQuestion":""}
"swap 0.5 ETH for USDC" → {"intent":"swap","entities":{"sellToken":"ETH","buyToken":"USDC","amount":"0.5"},"confidence":0.95,"needsClarification":false,"clarificationQuestion":""}
"how much ETH do I have" → {"intent":"balance","entities":{},"confidence":0.95,"needsClarification":false,"clarificationQuestion":""}

Respond with ONLY valid JSON:
{
  "intent": "send",
  "entities": {"token": "USDC", "amount": "100", "recipient": "0x..."},
  "confidence": 0.95,
  "needsClarification": false,
  "clarificationQuestion": ""
}`

    const intentResponse = await groq.chat.completions.create({
      messages: [{ role: 'user', content: intentPrompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    })
    const intentResult = JSON.parse(intentResponse.choices[0].message.content as string)

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
    // Search for relevant Base knowledge with timeout
    const baseKnowledgePromise = pineconeKnowledgeService.searchSimilar(message, 3)
    const timeoutPromise = new Promise<any[]>((_, reject) => 
      setTimeout(() => reject(new Error('Knowledge search timeout')), 1500)
    )
    
    let baseKnowledge: any[] = []
    try {
      baseKnowledge = await Promise.race([baseKnowledgePromise, timeoutPromise])
    } catch (error) {
      console.log('Knowledge search timed out, using fallback')
      baseKnowledge = []
    }
    
    // Determine what context is relevant
    const relevantContext = getRelevantContext(message, context)
    
    // Build enhanced prompt with Base knowledge
    const prompt = buildEnhancedQuestionPrompt(message, context, relevantContext, baseKnowledge)
    
    // Use Groq with timeout
    const responsePromise = groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    })
    const responseTimeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error('AI response timeout')), 1500)
    )
    
    let response: any
    try {
      response = await Promise.race([responsePromise, responseTimeoutPromise])
    } catch (error) {
      console.log('AI response timed out, using fallback')
      // Fallback response based on common questions
      const fallbackResponse = getFallbackResponse(message)
      return {
        intent: 'question',
        response: fallbackResponse,
        needsAction: false
      }
    }
    
    return {
      intent: 'question',
      response: response.choices[0].message.content as string,
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

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Base blockchain questions
  if (lowerMessage.includes('what is base') || lowerMessage.includes('base blockchain') || lowerMessage.includes('what is base blockchain')) {
    return "Base is a Layer 2 blockchain built on Ethereum that offers low fees (less than $0.01), fast transactions, and high security through Optimistic Rollup technology. It's designed to be the foundation for Coinbase's onchain products and an open ecosystem for anyone to build on. 🚀"
  }
  
  // Benefits and advantages
  if (lowerMessage.includes('benefit') || lowerMessage.includes('advantage') || lowerMessage.includes('why use base') || lowerMessage.includes('base advantages')) {
    return "Base benefits include: Low transaction fees under $0.01, near-instant finality, Ethereum security, developer-friendly tools, Coinbase integration, and regulatory compliance. It's perfect for both users and developers! 💰"
  }
  
  // How it works
  if ((lowerMessage.includes('how') && lowerMessage.includes('work')) || lowerMessage.includes('how base works') || lowerMessage.includes('base technology')) {
    return "Base uses Optimistic Rollup technology to process transactions off-chain and then batch them to Ethereum mainnet for security. This provides fast, cheap, and secure transactions while maintaining Ethereum's security guarantees. ⚡"
  }
  
  // Sending tokens
  if (lowerMessage.includes('send') || lowerMessage.includes('transfer') || lowerMessage.includes('how to send') || lowerMessage.includes('send tokens')) {
    return "To send tokens on Base: 1) Connect your wallet, 2) Select the token to send, 3) Enter recipient address, 4) Enter amount, 5) Confirm transaction. Fees are typically under $0.01! 💸"
  }
  
  // DeFi questions
  if (lowerMessage.includes('defi') || lowerMessage.includes('decentralized') || lowerMessage.includes('yield farming') || lowerMessage.includes('liquidity')) {
    return "Base supports DeFi protocols including DEXs, lending platforms, yield farming, and liquidity pools. Popular protocols include Uniswap, Aave, and Compound. You can access all major DeFi services with low fees! 🏦"
  }
  
  // Fees and costs
  if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('gas') || lowerMessage.includes('expensive')) {
    return "Base transaction fees are incredibly low - typically under $0.01! This is much cheaper than Ethereum mainnet and other Layer 2 solutions. The low fees make Base perfect for frequent transactions and DeFi activities. 💰"
  }
  
  // Security questions
  if (lowerMessage.includes('secure') || lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('audit')) {
    return "Base is highly secure because it inherits Ethereum's security through Optimistic Rollup technology. It has undergone multiple security audits and has a bug bounty program. Your funds are as secure as on Ethereum mainnet! 🔒"
  }
  
  // Speed and performance
  if (lowerMessage.includes('fast') || lowerMessage.includes('speed') || lowerMessage.includes('quick') || lowerMessage.includes('instant')) {
    return "Base offers near-instant transaction finality! Transactions are processed quickly and efficiently, making it perfect for real-time applications and frequent trading. ⚡"
  }
  
  // Developer questions
  if (lowerMessage.includes('develop') || lowerMessage.includes('build') || lowerMessage.includes('dapp') || lowerMessage.includes('smart contract')) {
    return "Base is developer-friendly with full Ethereum compatibility. You can deploy existing Ethereum dApps with minimal changes. It supports all standard Ethereum tools and has comprehensive documentation. 💻"
  }
  
  // General Base questions
  if (lowerMessage.includes('base') && (lowerMessage.includes('?') || lowerMessage.includes('what') || lowerMessage.includes('tell me'))) {
    return "Base is Coinbase's Layer 2 blockchain built on Ethereum. It offers ultra-low fees (under $0.01), fast transactions, and Ethereum-level security. Perfect for DeFi, NFTs, and everyday crypto transactions! 🚀"
  }
  
  return "I'm APEX, your AI guide to Base blockchain! I can help you with questions about Base, sending tokens, DeFi, and more. Base offers low fees (under $0.01), fast transactions, and Ethereum security. What would you like to know? 🤖"
}

function buildEnhancedQuestionPrompt(
  message: string,
  context: ConversationContext,
  relevantContext: any,
  baseKnowledge: any[]
): string {
  // Build Base knowledge context
  const baseKnowledgeContext = baseKnowledge.length > 0 
    ? `\n\nBase Blockchain Knowledge:\n${baseKnowledge.map(k => `- ${k.title}: ${k.content}`).join('\n\n')}`
    : ''

  return `You are APEX, an AI assistant specialized in Base blockchain and crypto. You help users with:

1. **Base Blockchain Questions**: Explain Base features, how it works, benefits, etc.
2. **Crypto Operations**: Send tokens, swap tokens, check balances
3. **Portfolio Management**: Track investments, analyze performance
4. **General Crypto Education**: Explain concepts, provide guidance

User's Question: "${message}"

${baseKnowledgeContext}

User Context:
- Wallet Address: ${context.userAddress}
- Portfolio: ${JSON.stringify(context.portfolio, null, 2)}
- Recent Transactions: ${context.recentTransactions.length} transactions

${relevantContext ? `Additional Context:\n${JSON.stringify(relevantContext, null, 2)}` : ''}

Instructions:
- If the question is about Base blockchain, prioritize the Base knowledge provided above
- Be helpful, accurate, and educational
- Use emojis to make responses engaging
- If you don't know something, say so and suggest where to find more info
- For technical questions, provide clear explanations
- For transaction questions, guide them through the process

Respond in a friendly, helpful tone:`
}

