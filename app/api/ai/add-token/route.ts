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
      // First, check if the address has code (is a contract)
      const code = await provider.getCode(tokenAddress)
      if (code === '0x') {
        return NextResponse.json(
          { error: 'No contract found at this address. Please verify the address is correct.' },
          { status: 400 }
        )
      }

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)
      
      // Try to fetch token info with timeout
      const [decimals, symbol, name] = await Promise.race([
        Promise.all([
          tokenContract.decimals(),
          tokenContract.symbol(),
          tokenContract.name(),
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ]) as [bigint, string, string]

      // Validate the fetched data
      if (!symbol || !name) {
        return NextResponse.json(
          { error: 'This address does not appear to be a valid ERC-20 token.' },
          { status: 400 }
        )
      }

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. The token contract may not be responding. Please try again.' },
          { status: 400 }
        )
      }
      
      if (errorMessage.includes('revert') || errorMessage.includes('execution reverted')) {
        return NextResponse.json(
          { error: 'This contract does not have standard ERC-20 functions. Please verify it is an ERC-20 token.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to fetch token information: ${errorMessage}` },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error adding token:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add token'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

