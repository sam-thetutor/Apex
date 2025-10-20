'use client'

import { useState } from 'react'
import { useWallet, SendTokenParams } from '@/contexts/WalletContext'
import { BASE_TOKENS } from '@/lib/tokens/base-tokens'

export interface SendConfirmationProps {
  tokenSymbol: string
  amount: string
  recipientAddress: string
  tokenAddress: string
  tokenDecimals: number
  onClose: () => void
  onSuccess: (txHash: string) => void
  onError: (error: string) => void
}

export function SendConfirmation({
  tokenSymbol,
  amount,
  recipientAddress,
  tokenAddress,
  tokenDecimals,
  onClose,
  onSuccess,
  onError,
}: SendConfirmationProps) {
  const { sendToken, address } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = BASE_TOKENS[tokenSymbol] || { icon: '💎', name: tokenSymbol }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: SendTokenParams = {
        tokenAddress,
        recipientAddress,
        amount,
        tokenSymbol,
        tokenDecimals,
      }

      const result = await sendToken(params)

      if (result.success && result.txHash) {
        onSuccess(result.txHash)
      } else {
        const errorMsg = result.error || 'Transaction failed'
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

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(38)}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Confirm Transaction
          </h2>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
          {/* Token & Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{token.icon}</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">You're sending</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {amount} {tokenSymbol}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">To</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {formatAddress(recipientAddress)}
            </p>
          </div>

          {/* From */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">From</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {address ? formatAddress(address) : 'Your wallet'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ Please verify the recipient address. Transactions cannot be reversed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Confirm Send'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

