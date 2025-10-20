'use client'

import { useState, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MessageBubble({ message }: { message: Message }) {
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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-500 text-white border border-white/20'
            : 'bg-white/70 text-gray-900 border border-white/40'
        }`}
      >
        <p className="text-sm">{message.content}</p>
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

