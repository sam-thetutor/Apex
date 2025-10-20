'use client'

import { useEffect, useState, useCallback } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useWallet } from '@/contexts/WalletContext'

const CACHE_KEY_PREFIX = 'apex_portfolio_cache_'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function PortfolioOverview() {
  const { address } = useWallet()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [tokens, setTokens] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Check if cached data is still valid
  const isCacheValid = (cacheTimestamp: number): boolean => {
    return Date.now() - cacheTimestamp < CACHE_DURATION
  }

  // Fetch portfolio balances from API
  const fetchBalances = useCallback(async (forceRefresh = false) => {
    if (!address) return

    setIsLoading(true)
    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cacheKey = `${CACHE_KEY_PREFIX}${address}`
        const cachedData = localStorage.getItem(cacheKey)
        
        if (cachedData) {
          try {
            const { portfolio, timestamp } = JSON.parse(cachedData)
            if (isCacheValid(timestamp)) {
              console.log('Using cached portfolio data')
              setTokens(portfolio)
              setLastUpdated(new Date(timestamp))
              setIsLoading(false)
              return
            }
          } catch (error) {
            console.error('Error reading cache:', error)
          }
        }
      }

      // Fetch fresh data
      console.log('Fetching fresh portfolio data...')
      const response = await fetch(`/api/portfolio/balances?address=${address}`)
      const data = await response.json()

      if (data.success && data.portfolio) {
        setTokens(data.portfolio)
        setLastUpdated(new Date(data.timestamp))
        
        // Cache the data
        const cacheKey = `${CACHE_KEY_PREFIX}${address}`
        localStorage.setItem(cacheKey, JSON.stringify({
          portfolio: data.portfolio,
          timestamp: data.timestamp,
        }))
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }, [address])

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

    // Fetch balances when wallet connects
    if (address) {
      fetchBalances()
    }
  }, [address, fetchBalances])

  // Expose refetch function globally for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).refetchPortfolio = () => {
        console.log('Refetching portfolio...')
        fetchBalances(true)
      }
    }
  }, [fetchBalances])

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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-primary-600">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
        {lastUpdated && !isLoading && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Token List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Tokens
          </h2>
          {!isLoading && (
            <button
              onClick={() => fetchBalances(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Refresh
            </button>
          )}
        </div>
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

