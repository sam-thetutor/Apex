import { NextRequest, NextResponse } from 'next/server'
import { getUserTokens, addCustomToken, removeCustomToken } from '@/lib/db/token-service'

/**
 * GET /api/tokens
 * Get user's custom tokens
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userAddress = searchParams.get('address')

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 })
    }

    const tokens = await getUserTokens(userAddress)
    return NextResponse.json({ tokens })
  } catch (error) {
    console.error('Error getting tokens:', error)
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 500 })
  }
}

/**
 * POST /api/tokens
 * Add a custom token to user's portfolio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userAddress, token } = body

    if (!userAddress || !token) {
      return NextResponse.json({ error: 'User address and token are required' }, { status: 400 })
    }

    // Validate token data
    if (!token.address || !token.symbol || !token.name || !token.decimals) {
      return NextResponse.json({ error: 'Invalid token data' }, { status: 400 })
    }

    const updatedTokens = await addCustomToken(userAddress, token)
    return NextResponse.json({
      success: true,
      message: `Token ${token.symbol} added successfully`,
      tokens: updatedTokens,
    })
  } catch (error) {
    console.error('Error adding token:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to add token'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

/**
 * DELETE /api/tokens
 * Remove a token from user's portfolio
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userAddress = searchParams.get('address')
    const tokenAddress = searchParams.get('tokenAddress')

    if (!userAddress || !tokenAddress) {
      return NextResponse.json(
        { error: 'User address and token address are required' },
        { status: 400 }
      )
    }

    const updatedTokens = await removeCustomToken(userAddress, tokenAddress)
    return NextResponse.json({
      success: true,
      message: 'Token removed successfully',
      tokens: updatedTokens,
    })
  } catch (error) {
    console.error('Error removing token:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to remove token'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

