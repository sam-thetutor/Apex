import { NextRequest, NextResponse } from 'next/server'
import { addCustomToken } from '@/lib/db/token-service'
import { ethers } from 'ethers'
import { BASE_CONFIG } from '@/lib/blockchain/base-config'

// ERC-20 ABI for token info
const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
]

const provider = new ethers.JsonRpcProvider(BASE_CONFIG.rpcUrls[0])

/**
 * POST /api/ai/add-token
 * Add a custom token to user's portfolio
 */
export async function POST(request: NextRequest) {
  try {
    const { userAddress, tokenAddress } = await request.json()

    if (!userAddress || !tokenAddress) {
      return NextResponse.json(
        { error: 'User address and token address are required' },
        { status: 400 }
      )
    }

    // Validate token address
    if (!ethers.isAddress(tokenAddress)) {
      return NextResponse.json({ error: 'Invalid token address' }, { status: 400 })
    }

    // Fetch token info from blockchain
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      const [decimals, symbol, name] = await Promise.all([
        tokenContract.decimals(),
        tokenContract.symbol(),
        tokenContract.name(),
      ])

      // Add token to user's portfolio
      const token = {
        address: tokenAddress,
        symbol: symbol,
        name: name,
        decimals: Number(decimals),
        icon: '🪙', // Default icon
      }

      await addCustomToken(userAddress, token)

      return NextResponse.json({
        success: true,
        message: `Token ${symbol} (${name}) added successfully to your portfolio`,
        token,
      })
    } catch (error) {
      console.error('Error fetching token info:', error)
      return NextResponse.json(
        { error: 'Failed to fetch token information. Please verify the token address is valid on Base.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error adding token:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add token'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

