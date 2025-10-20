'use client'

import { useState, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { useWallet } from '@/contexts/WalletContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const { address, isConnected } = useWallet()
  const [messages, setMessages] = useState<Message[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize with welcome message on client only
  useEffect(() => {
    if (!isInitialized) {
      setMessages([
        {
          role: 'assistant',
          content: '👋 Welcome to Apex Base! I can help you:\n\n• Send, swap, and check token balances\n• Add custom tokens to your portfolio\n\nTry saying:\n• "How much ETH do I have?"\n• "What\'s my portfolio?"\n• "Add token 0x..." (to add a custom token)',
          timestamp: new Date(),
        },
      ])
      setIsInitialized(true)
    }
  }, [isInitialized])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsLoading(true)

    try {
      // Check if user wants to add a token
      // Flexible pattern to catch variations like:
      // "add token 0x...", "add this token to my list 0x...", "add token to portfolio 0x..."
      const addTokenPattern = /add\s+(?:this\s+)?(?:token\s+)?(?:to\s+(?:my\s+)?(?:list|portfolio)\s+)?(?:with\s+)?(?:address\s+)?(0x[a-fA-F0-9]{40})/i
      const addTokenMatch = userInput.match(addTokenPattern)
      
      if (addTokenMatch && address) {
        const tokenAddress = addTokenMatch[1]
        
        // Validate contract address
        if (!tokenAddress) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: `❌ Please provide the token contract address:\n\nExample: "Add token 0x1234..." or "Add token with address 0x1234..."\n\nI'll automatically fetch the token name, symbol, and decimals from the blockchain.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
          return
        }
        
        // Show loading message
        const loadingMessage: Message = {
          role: 'assistant',
          content: `🔍 Adding token...\n\nFetching token details from blockchain...`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, loadingMessage])
        
        const addTokenResponse = await fetch('/api/ai/add-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress: address,
            tokenAddress: tokenAddress,
          }),
        })

        const addTokenResult = await addTokenResponse.json()
        
        // Refetch portfolio if token was added successfully
        if (addTokenResult.success && typeof window !== 'undefined') {
          const refetchPortfolio = (window as any).refetchPortfolio
          if (refetchPortfolio) {
            setTimeout(() => refetchPortfolio(), 1000) // Refetch after 1 second
          }
        }
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: addTokenResult.success 
            ? `✅ Token Added Successfully!\n\n📝 **${addTokenResult.token.symbol}** (${addTokenResult.token.name})\n\n📍 Address: \`${tokenAddress}\`\n\nYou can now:\n• Check your balance: "How much ${addTokenResult.token.symbol} do I have?"\n• Send tokens: "Send 100 ${addTokenResult.token.symbol} to @user"\n• Swap tokens: "Swap 50 ${addTokenResult.token.symbol} for USDC"\n• View in portfolio: Visit the Portfolio page\n\n💡 Your portfolio will update automatically!`
            : `❌ Failed to Add Token\n\n${addTokenResult.error}\n\nPlease make sure:\n• The contract address is valid on Base\n• The address is for an ERC-20 token\n• The token contract is deployed`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
        return
      }

      // First, parse the intent
      const intentResponse = await fetch('/api/ai/parse-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      })

      const intent = await intentResponse.json()
      
      // Route based on intent
      if (intent.action === 'balance' || userInput.toLowerCase().includes('portfolio')) {
        // Use agent for balance/portfolio queries (no signing required)
        const walletAddress = address || '0x0000000000000000000000000000000000000000'
        
        const agentResponse = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userInput,
            walletAddress: walletAddress
          }),
        })

        const agentResult = await agentResponse.json()
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: agentResult.response || '💰 ' + agentResult.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else if (intent.action === 'send' || intent.action === 'swap') {
        // Show transaction preview for signing actions
        const aiResponse = generateResponse(intent, userInput)
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Handle help and other actions
        const aiResponse = generateResponse(intent, userInput)
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error processing command:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your command. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = (intent: any, userInput: string): string => {
    switch (intent.action) {
      case 'send':
        return `📤 I'll send ${intent.amount || 'the specified amount'} ${intent.token || 'tokens'} to ${intent.recipient || 'the recipient'}. 

To complete this transaction, I'll need to open the send interface. Would you like to proceed?`
      
      case 'swap':
        return `🔄 I'll swap ${intent.amount || 'the specified amount'} ${intent.sellToken || 'tokens'} for ${intent.buyToken || 'the target token'}. 

To complete this swap, I'll need to open the swap interface. Would you like to proceed?`
      
      case 'balance':
        return `💰 Let me check your ${intent.token || 'token'} balance on Base...

[Fetching balance...]`
      
      case 'help':
        return `💡 Here are some commands you can try:

• "How much ETH do I have?" - Check your balance
• "What's my portfolio?" - View all your tokens
• "Add token 0x..." - Add a custom token to your portfolio
• "Send 100 USDC to @alice" - Send tokens to a Farcaster user
• "Swap 0.5 ETH for USDC" - Exchange tokens

Need more help? Visit the Help page!`
      
      default:
        return `🤔 I'm not sure what you'd like to do. Try saying:

• "How much ETH do I have?"
• "What's my portfolio?"
• "Add token 0x..." (to add a custom token)
• "Send 100 USDC to @alice"
• "Swap 0.5 ETH for USDC"

Or type "help" for more examples!`
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl px-4 py-2 max-w-xs border border-white/20 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/20 bg-white/60 backdrop-blur-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your command... (e.g. Send 100 USDC to @alice)"
            className="flex-1 px-4 text-black py-3 backdrop-blur-sm border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl shadow-teal-500/50 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

