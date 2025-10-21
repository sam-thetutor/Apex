import { NextRequest, NextResponse } from 'next/server'
import { getSwapQuote, validateSwap, isTokenPairSupported } from '@/lib/blockchain/swap-service'

/**
 * POST /api/swap/quote
 * Get a swap quote for a token pair
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      sellToken,
      buyToken,
      amount,
      walletAddress,
      slippage,
    } = body

    // Validate required fields
    if (!sellToken || !buyToken || !amount || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if token pair is supported
    const pairCheck = await isTokenPairSupported(sellToken, buyToken, walletAddress)
    
    if (!pairCheck.supported) {
      return NextResponse.json(
        { error: pairCheck.error || 'Token pair not supported' },
        { status: 400 }
      )
    }

    const { sellToken: sellTokenInfo, buyToken: buyTokenInfo } = pairCheck

    // Prepare swap parameters
    const swapParams = {
      sellTokenAddress: sellTokenInfo!.address,
      buyTokenAddress: buyTokenInfo!.address,
      sellAmount: amount,
      sellTokenDecimals: sellTokenInfo!.decimals,
      buyTokenDecimals: buyTokenInfo!.decimals,
      sellTokenSymbol: sellToken,
      buyTokenSymbol: buyToken,
      slippage: slippage || 50, // Default 0.5%
      deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
    }

    // Validate swap parameters
    const validation = validateSwap(swapParams)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid swap parameters' },
        { status: 400 }
      )
    }

    // Get swap quote
    const quote = await getSwapQuote(swapParams)

    return NextResponse.json({
      success: true,
      quote,
    })
  } catch (error) {
    console.error('Error getting swap quote:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to get swap quote'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

