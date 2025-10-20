import { NextRequest, NextResponse } from 'next/server'
import { storeTransaction, getUserTransactions, updateTransactionStatus } from '@/lib/db/transaction-service'

/**
 * POST /api/transactions
 * Store a new transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      txHash,
      type,
      tokenSymbol,
      amount,
      recipientAddress,
      senderAddress,
      status,
      network,
      metadata,
    } = body

    // Validate required fields
    if (!userId || !txHash || !type || !tokenSymbol || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store the transaction
    const transactionId = await storeTransaction({
      userId,
      txHash,
      type,
      tokenSymbol,
      amount,
      recipientAddress,
      senderAddress,
      status: status || 'pending',
      timestamp: new Date(),
      network: network || 'base',
      metadata,
    })

    return NextResponse.json({
      success: true,
      transactionId,
    })
  } catch (error) {
    console.error('Error storing transaction:', error)
    return NextResponse.json(
      { error: 'Failed to store transaction' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/transactions?userId=...
 * Get transactions for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const transactions = await getUserTransactions(userId)

    return NextResponse.json({
      success: true,
      transactions,
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/transactions
 * Update transaction status
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { txHash, status, updates } = body

    if (!txHash || !status) {
      return NextResponse.json(
        { error: 'txHash and status are required' },
        { status: 400 }
      )
    }

    await updateTransactionStatus(txHash, status, updates)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

