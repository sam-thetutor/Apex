'use client'

import { useState } from 'react'
import { useWallet, SwapTokenParams } from '@/contexts/WalletContext'
import { BASE_TOKENS } from '@/lib/tokens/base-tokens'

export interface SwapData {
  sellToken: string
  buyToken: string
  amount: string
  sellTokenAddress: string
  buyTokenAddress: string
  sellTokenDecimals: number
  buyTokenDecimals: number
  estimatedOutput: string
  rate: string
  slippage: number
}

interface SwapBubbleProps {
  data: SwapData
  onConfirm: () => void
  onCancel: () => void
  onError: (error: string) => void
}

export function SwapBubble({
  data,
  onConfirm,
  onCancel,
  onError,
}: SwapBubbleProps) {
  const { swapTokens } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sellToken = BASE_TOKENS[data.sellToken] || { icon: '🪙', name: data.sellToken }
  const buyToken = BASE_TOKENS[data.buyToken] || { icon: '🪙', name: data.buyToken }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Prepare swap parameters
      const params: SwapTokenParams = {
        sellTokenAddress: data.sellTokenAddress,
        buyTokenAddress: data.buyTokenAddress,
        sellAmount: data.amount,
        sellTokenDecimals: data.sellTokenDecimals,
        buyTokenDecimals: data.buyTokenDecimals,
        sellTokenSymbol: data.sellToken,
        buyTokenSymbol: data.buyToken,
        slippage: data.slippage * 100, // Convert percentage to basis points
      }

      // Execute the swap
      const result = await swapTokens(params)

      if (result.success) {
        // Call parent's success handler
        onConfirm()
      } else {
        const errorMsg = result.error || 'Swap failed'
        setError(errorMsg)
        onError(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMsg)
      onError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 max-w-md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div className="flex-1">
            <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
              Swap Failed
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-4 max-w-md shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔄</span>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Confirm Swap
        </h3>
      </div>

      {/* Swap Details */}
      <div className="space-y-2 mb-4">
        {/* You're selling */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You're selling</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sellToken.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.sellToken}
              </span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.amount}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center py-1">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* You're buying */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You're buying</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{buyToken.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {data.buyToken}
              </span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              ~{data.estimatedOutput}
            </span>
          </div>
        </div>

        {/* Rate */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Rate</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            1 {data.sellToken} = {data.rate} {data.buyToken}
          </span>
        </div>

        {/* Slippage */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Slippage</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {data.slippage}%
          </span>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mt-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ Swap rates are estimates. Actual amount may vary due to market conditions.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Swapping...
            </span>
          ) : (
            'Confirm Swap'
          )}
        </button>
      </div>
    </div>
  )
}

