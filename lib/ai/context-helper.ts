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

interface RelevantContext {
  portfolio: boolean
  transactions: boolean
  baseInfo: boolean
  userSpecific: boolean
}

export function getRelevantContext(message: string, context: ConversationContext): RelevantContext {
  const lowerMessage = message.toLowerCase()
  
  const relevantContext: RelevantContext = {
    portfolio: false,
    transactions: false,
    baseInfo: false,
    userSpecific: false
  }
  
  // Portfolio-related keywords
  const portfolioKeywords = [
    'balance', 'portfolio', 'how much', 'my balance', 'my portfolio',
    'what do i have', 'show me my', 'my tokens', 'my crypto'
  ]
  
  // Transaction-related keywords
  const transactionKeywords = [
    'transaction', 'history', 'sent', 'received', 'my transactions',
    'what i sent', 'what i received', 'recent', 'last transaction'
  ]
  
  // User-specific keywords (first person)
  const userSpecificKeywords = [
    'my', 'i have', 'i sent', 'i received', 'my wallet',
    'my account', 'me', 'i want', 'i need'
  ]
  
  // Base/Farcaster/blockchain keywords
  const baseInfoKeywords = [
    'base', 'farcaster', 'blockchain', 'crypto', 'ethereum',
    'layer 2', 'l2', 'coinbase', 'defi', 'web3'
  ]
  
  // Check portfolio context
  if (portfolioKeywords.some(keyword => lowerMessage.includes(keyword))) {
    relevantContext.portfolio = true
    relevantContext.userSpecific = true
  }
  
  // Check transaction context
  if (transactionKeywords.some(keyword => lowerMessage.includes(keyword))) {
    relevantContext.transactions = true
    relevantContext.userSpecific = true
  }
  
  // Check user-specific context
  if (userSpecificKeywords.some(keyword => lowerMessage.includes(keyword))) {
    relevantContext.userSpecific = true
  }
  
  // Check Base/Farcaster context
  if (baseInfoKeywords.some(keyword => lowerMessage.includes(keyword))) {
    relevantContext.baseInfo = true
  }
  
  return relevantContext
}

export function buildQuestionPrompt(
  message: string,
  context: ConversationContext,
  relevantContext: RelevantContext
): string {
  let prompt = `You are a helpful AI assistant for Apex Base, a Farcaster Mini App for Base blockchain. Answer the user's question using your full knowledge.

User's Question: "${message}"

`
  
  // Add conversation history if available
  if (context.conversationHistory.length > 0) {
    prompt += `Recent Conversation:
${context.conversationHistory.slice(-2).map(m => `${m.role}: ${m.content}`).join('\n')}

`
  }
  
  // Add user-specific context if relevant
  if (relevantContext.userSpecific) {
    prompt += `User's Context:
`
    
    if (relevantContext.portfolio && context.portfolio.length > 0) {
      prompt += `- Portfolio: ${JSON.stringify(context.portfolio, null, 2)}
`
    }
    
    if (relevantContext.transactions && context.recentTransactions.length > 0) {
      prompt += `- Recent Transactions: ${context.recentTransactions.length} transactions
`
    }
  }
  
  // Add Base/Farcaster context only if relevant
  if (relevantContext.baseInfo) {
    prompt += `
About Apex Base:
- Apex Base is a Farcaster Mini App for Base blockchain
- Base is a Layer 2 blockchain built on Ethereum by Coinbase
- Perfect for Africans sending money home (saves 99.9% in fees)
- Transactions cost less than $0.01 and are confirmed in 2 seconds
- Works in 10+ African languages

`
  }
  
  prompt += `
Provide a helpful, accurate, and conversational answer. Use your full knowledge to answer the question.

Answer in a friendly, conversational tone. Keep responses concise but informative.`

  return prompt
}

