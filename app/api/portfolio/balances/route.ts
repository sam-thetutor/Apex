import { NextRequest, NextResponse } from 'next/server'
import { getUserTokens } from '@/lib/db/token-service'
import { fetchPortfolio } from '@/lib/blockchain/balance-service'

/**
 * GET /api/portfolio/balances
 * Fetch all token balances for a user's portfolio
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userAddress = searchParams.get('address')

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 })
    }

    // Get user's tokens from database
    const userTokens = await getUserTokens(userAddress)
    
    // Fetch balances for all tokens
    const portfolio = await fetchPortfolio(userAddress)
    
    // Add token metadata to portfolio items
    const portfolioWithMetadata = portfolio.map((item) => {
      const tokenInfo = userTokens.find((t) => t.symbol === item.symbol)
      return {
        ...item,
        name: tokenInfo?.name || item.symbol,
        icon: tokenInfo?.icon || '🪙',
        address: tokenInfo?.address || '',
      }
    })

    return NextResponse.json({
      success: true,
      portfolio: portfolioWithMetadata,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching portfolio balances:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balances'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

