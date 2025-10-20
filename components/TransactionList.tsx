'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { getBaseExplorerUrl } from '@/lib/blockchain/base-config'

interface Transaction {
  _id?: string
  userId: string
  txHash: string
  type: 'send' | 'swap' | 'receive'
  tokenSymbol: string
  amount: string
  recipientAddress?: string
  senderAddress?: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  gasUsed?: string
  gasPrice?: string
  blockNumber?: number
  network: string
  metadata?: {
    tokenAddress?: string
    tokenDecimals?: number
    notes?: string
  }
}

export function TransactionList() {
  const { address } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/transactions?userId=${address}`)
        const result = await response.json()
        
        if (result.success) {
          setTransactions(result.transactions)
          setError(null)
        } else {
          setError(result.error || 'Failed to load transactions')
        }
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError('Failed to load transactions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [address])

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(38)}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        <p className="text-gray-500 mt-2">Loading transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by sending or swapping tokens
          </p>
        </div>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx._id}
            className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-4 hover:border-primary-300 hover:bg-white/90 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                {tx.type === 'send' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📤</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Sent {tx.amount} {tx.tokenSymbol}
                      </p>
                      {tx.recipientAddress && (
                        <p className="text-sm text-gray-600">
                          To {formatAddress(tx.recipientAddress)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : tx.type === 'swap' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Swapped {tx.amount} {tx.tokenSymbol}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📥</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Received {tx.amount} {tx.tokenSymbol}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}
              >
                {tx.status}
              </span>
            </div>
            <a
              href={getBaseExplorerUrl(tx.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              View on BaseScan →
            </a>
          </div>
        ))
      )}
    </div>
  )
}

