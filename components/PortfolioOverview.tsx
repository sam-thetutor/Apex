'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useWallet } from '@/contexts/WalletContext'

export function PortfolioOverview() {
  const { address } = useWallet()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [tokens, setTokens] = useState<any[]>([])

  useEffect(() => {
    // Get user profile from Farcaster SDK
    const fetchProfile = async () => {
      try {
        const context = await sdk.context
        setUserProfile(context.user)
      } catch (error) {
        console.error('Error fetching Farcaster profile:', error)
      }
    }

    fetchProfile()

    // Fetch user tokens and balances
    const fetchBalances = async () => {
      if (address) {
        try {
          // First, get user's tokens from database
          const tokensResponse = await fetch(`/api/tokens?address=${address}`)
          const tokensData = await tokensResponse.json()
          
          if (tokensData.tokens && tokensData.tokens.length > 0) {
            // Fetch balances for each token
            const tokensWithBalances = await Promise.all(
              tokensData.tokens.map(async (token: any) => {
                try {
                  // Call balance service for each token
                  const response = await fetch('/api/ai/agent', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      message: `What is my ${token.symbol} balance?`,
                      walletAddress: address,
                    }),
                  })
                  const data = await response.json()
                  
                  // Parse the balance from the response
                  const balanceMatch = data.response?.match(/Balance:\s*([\d.]+)/)
                  const usdMatch = data.response?.match(/\$([\d,]+\.?\d*)/)
                  
                  return {
                    symbol: token.symbol,
                    name: token.name,
                    balance: balanceMatch ? balanceMatch[1] : '0.00',
                    usdValue: usdMatch ? usdMatch[1].replace(/,/g, '') : '0.00',
                    icon: token.icon || '🪙',
                  }
                } catch (error) {
                  console.error(`Error fetching ${token.symbol} balance:`, error)
                  return {
                    symbol: token.symbol,
                    name: token.name,
                    balance: '0.00',
                    usdValue: '0.00',
                    icon: token.icon || '🪙',
                  }
                }
              })
            )
            
            // Filter out tokens with zero balance
            const nonZeroTokens = tokensWithBalances.filter(
              (token) => parseFloat(token.balance) > 0
            )
            
            setTokens(nonZeroTokens)
          }
        } catch (error) {
          console.error('Error fetching portfolio:', error)
        }
      }
    }

    fetchBalances()
  }, [address])

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Mock tokens for now - will be replaced with real data
  const mockTokens: any[] = []

  const displayTokens = tokens.length > 0 ? tokens : mockTokens
  const totalValue = displayTokens.reduce(
    (sum, token) => sum + parseFloat(token.usdValue.replace(/,/g, '')),
    0
  )

  return (
    <div className="p-4 space-y-4">
      {/* User Profile Section */}
      {userProfile && (
        <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl border border-white/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {userProfile.pfpUrl && (
              <img
                src={userProfile.pfpUrl}
                alt={userProfile.displayName || userProfile.username}
                className="w-16 h-16 rounded-full border-2 border-white/30"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {userProfile.displayName || userProfile.username || 'User'}
              </h2>
              {userProfile.username && (
                <p className="text-sm opacity-90">@{userProfile.username}</p>
              )}
              {address && (
                <div className="mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-xs font-mono">{formatAddress(address)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Total Value */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-6 shadow-lg">
        <p className="text-sm text-gray-600">Total Portfolio Value</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 px-1">
          Your Tokens
        </h2>
        {displayTokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-4 hover:border-primary-300 hover:bg-white/90 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="text-teal-600">{token.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{token.symbol}</p>
                  <p className="text-sm text-gray-600">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{token.balance}</p>
                <p className="text-sm text-gray-600">${token.usdValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

