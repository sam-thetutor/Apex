'use client'

import { useState, useEffect } from 'react'
import { ConfirmationBubble, ConfirmationData } from './ConfirmationBubble'
import { SwapBubble, SwapData } from './SwapBubble'

interface Message {
  role: 'user' | 'assistant' | 'confirmation' | 'swap'
  content: string
  timestamp: Date
  confirmationData?: ConfirmationData
  swapData?: SwapData
  status?: 'pending' | 'success' | 'error'
  txHash?: string
}

interface MessageBubbleProps {
  message: Message
  onConfirm?: (txHash: string, confirmationData: ConfirmationData) => void
  onCancel?: (confirmationData: ConfirmationData) => void
  onError?: (error: string, confirmationData: ConfirmationData) => void
  onSwapConfirm?: (swapData: SwapData) => void
  onSwapCancel?: (swapData: SwapData) => void
  onSwapError?: (error: string, swapData: SwapData) => void
}

export function MessageBubble({ 
  message, 
  onConfirm, 
  onCancel, 
  onError,
  onSwapConfirm,
  onSwapCancel,
  onSwapError,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [timeString, setTimeString] = useState('')

  useEffect(() => {
    // Format time on client only to avoid hydration mismatch
    const hours = message.timestamp.getHours()
    const minutes = message.timestamp.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    setTimeString(`${displayHours}:${displayMinutes} ${ampm}`)
  }, [message.timestamp])

  // Handle confirmation messages
  if (message.role === 'confirmation' && message.confirmationData) {
    if (message.status === 'success' || message.status === 'error') {
      // Show success/error message
      return (
        <div className="flex justify-start">
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg ${
              message.status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <p className="text-xs mt-2 text-gray-500">{timeString || '...'}</p>
          </div>
        </div>
      )
    }

    // Show confirmation bubble with buttons
    return (
      <div className="flex justify-start">
        <ConfirmationBubble
          data={message.confirmationData}
          onConfirm={(txHash) => onConfirm?.(txHash, message.confirmationData!)}
          onCancel={() => onCancel?.(message.confirmationData!)}
          onError={(error) => onError?.(error, message.confirmationData!)}
        />
      </div>
    )
  }

  // Handle swap messages
  if (message.role === 'swap' && message.swapData) {
    if (message.status === 'success' || message.status === 'error') {
      // Show success/error message
      return (
        <div className="flex justify-start">
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg ${
              message.status === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <p className="text-xs mt-2 text-gray-500">{timeString || '...'}</p>
          </div>
        </div>
      )
    }

    // Show swap bubble with buttons
    return (
      <div className="flex justify-start">
        <SwapBubble
          data={message.swapData}
          onConfirm={() => onSwapConfirm?.(message.swapData!)}
          onCancel={() => onSwapCancel?.(message.swapData!)}
          onError={(error) => onSwapError?.(error, message.swapData!)}
        />
      </div>
    )
  }

  // Regular user or assistant message
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-500 text-white border border-white/20'
            : 'bg-white/70 text-gray-900 border border-white/40'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-teal-100' : 'text-gray-500'
          }`}
        >
          {timeString || '...'}
        </p>
      </div>
    </div>
  )
}

