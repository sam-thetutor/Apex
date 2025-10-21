'use client'

import { useState, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { useWallet, SwapTokenParams } from '@/contexts/WalletContext'
import { getBaseExplorerUrl } from '@/lib/blockchain/base-config'
import { ConfirmationData } from './ConfirmationBubble'
import { SwapData } from './SwapBubble'

interface Message {
  role: 'user' | 'assistant' | 'confirmation' | 'swap'
  content: string
  timestamp: Date
  confirmationData?: ConfirmationData
  swapData?: SwapData
  status?: 'pending' | 'success' | 'error'
  txHash?: string
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

  const [conversationId, setConversationId] = useState<string | null>(null)

  const handleSend = async () => {
    if (!input.trim() || isLoading || !address) return

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
      // Call LangGraph API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          userId: address,
          conversationId: conversationId
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to get response')
      }

      // Store conversation ID
      if (result.conversationId) {
        setConversationId(result.conversationId)
      }

      // Handle different response types
      if (result.needsAction && result.actionData?.type === 'send') {
        // Show send confirmation
        const confirmationMessage: Message = {
          role: 'confirmation',
          content: result.response,
          timestamp: new Date(),
          confirmationData: {
            tokenSymbol: result.actionData.tokenSymbol,
            tokenAddress: result.actionData.tokenAddress,
            tokenDecimals: result.actionData.tokenDecimals,
            recipientAddress: result.actionData.recipientAddress,
            amount: result.actionData.amount,
          }
        }
        setMessages((prev) => [...prev, confirmationMessage])
      } else if (result.needsAction && result.actionData?.type === 'swap') {
        // Show swap confirmation
        const swapMessage: Message = {
          role: 'swap',
          content: result.response,
          timestamp: new Date(),
          swapData: {
            sellToken: result.actionData.sellToken,
            buyToken: result.actionData.buyToken,
            amount: result.actionData.amount,
            sellTokenAddress: result.actionData.sellTokenAddress,
            buyTokenAddress: result.actionData.buyTokenAddress,
            sellTokenDecimals: result.actionData.sellTokenDecimals,
            buyTokenDecimals: result.actionData.buyTokenDecimals,
            estimatedOutput: result.actionData.estimatedOutput,
            rate: result.actionData.rate,
            slippage: result.actionData.slippage,
          }
        }
        setMessages((prev) => [...prev, swapMessage])
      } else {
        // Regular text response
        const assistantMessage: Message = {
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const handleSendSuccess = async (txHash: string, confirmationData: ConfirmationData) => {
    if (!address) return

    // Store transaction in database via API
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: address,
          txHash,
          type: 'send',
          tokenSymbol: confirmationData.tokenSymbol,
          amount: confirmationData.amount,
          recipientAddress: confirmationData.recipientAddress,
          status: 'pending',
          network: 'base',
          metadata: {
            tokenAddress: confirmationData.tokenAddress,
            tokenDecimals: confirmationData.tokenDecimals,
          },
        }),
      })
    } catch (error) {
      console.error('Error storing transaction:', error)
    }

    // Update the confirmation message to show success
    setMessages((prev) => prev.map((msg) => {
      if (msg.role === 'confirmation' && msg.confirmationData === confirmationData) {
        return {
          ...msg,
          status: 'success' as const,
          txHash,
          content: `✨ Sent ${confirmationData.amount} ${confirmationData.tokenSymbol} successfully!`,
        }
      }
      return msg
    }))
  }

  const handleSendError = (error: string, confirmationData: ConfirmationData) => {
    // Update the confirmation message to show error
    setMessages((prev) => prev.map((msg) => {
      if (msg.role === 'confirmation' && msg.confirmationData === confirmationData) {
        return {
          ...msg,
          status: 'error' as const,
          content: `❌ Transaction failed. Please try again.`,
        }
      }
      return msg
    }))
  }

  const handleSwapSuccess = async (swapData: SwapData) => {
    if (!address) return

    // Store swap transaction in database via API
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: address,
          txHash: `swap_${Date.now()}`, // Temporary hash, will be updated
          type: 'swap',
          tokenSymbol: swapData.sellToken,
          amount: swapData.amount,
          status: 'pending',
          network: 'base',
          metadata: {
            buyToken: swapData.buyToken,
            estimatedOutput: swapData.estimatedOutput,
            rate: swapData.rate,
          },
        }),
      })
    } catch (error) {
      console.error('Error storing swap transaction:', error)
    }

    // Update the swap message to show success
    setMessages((prev) => prev.map((msg) => {
      if (msg.role === 'swap' && msg.swapData === swapData) {
        return {
          ...msg,
          status: 'success' as const,
          content: `✨ Swapped ${swapData.amount} ${swapData.sellToken} for ${swapData.estimatedOutput} ${swapData.buyToken} successfully!`,
        }
      }
      return msg
    }))
  }

  const handleSwapError = (error: string, swapData: SwapData) => {
    // Update the swap message to show error
    setMessages((prev) => prev.map((msg) => {
      if (msg.role === 'swap' && msg.swapData === swapData) {
        return {
          ...msg,
          status: 'error' as const,
          content: `❌ Swap failed. Please try again.`,
        }
      }
      return msg
    }))
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message}
            onConfirm={handleSendSuccess}
            onCancel={() => {}}
            onError={handleSendError}
            onSwapConfirm={handleSwapSuccess}
            onSwapCancel={() => {}}
            onSwapError={handleSwapError}
          />
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

