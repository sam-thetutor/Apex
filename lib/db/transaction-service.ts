import clientPromise from './mongodb'

export interface Transaction {
  _id?: string
  userId: string // Wallet address
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

const COLLECTION_NAME = 'transactions'
const DATABASE_NAME = 'apex'

async function getDatabase() {
  const client = await clientPromise
  return client.db(DATABASE_NAME)
}

/**
 * Store a new transaction in the database
 */
export async function storeTransaction(transaction: Omit<Transaction, '_id'>): Promise<string> {
  try {
    const db = await getDatabase()
    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...transaction,
      timestamp: new Date(),
    })
    
    return result.insertedId.toString()
  } catch (error) {
    console.error('Error storing transaction:', error)
    throw error
  }
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  try {
    const db = await getDatabase()
    const transactions = await db
      .collection(COLLECTION_NAME)
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray()
    
    return transactions.map((tx) => ({
      _id: tx._id.toString(),
      userId: tx.userId,
      txHash: tx.txHash,
      type: tx.type,
      tokenSymbol: tx.tokenSymbol,
      amount: tx.amount,
      recipientAddress: tx.recipientAddress,
      senderAddress: tx.senderAddress,
      status: tx.status,
      timestamp: tx.timestamp,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
      network: tx.network,
      metadata: tx.metadata,
    }))
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    throw error
  }
}

/**
 * Get a specific transaction by hash
 */
export async function getTransactionByHash(txHash: string): Promise<Transaction | null> {
  try {
    const db = await getDatabase()
    const transaction = await db.collection(COLLECTION_NAME).findOne({ txHash })
    
    if (!transaction) {
      return null
    }
    
    return {
      _id: transaction._id.toString(),
      userId: transaction.userId,
      txHash: transaction.txHash,
      type: transaction.type,
      tokenSymbol: transaction.tokenSymbol,
      amount: transaction.amount,
      recipientAddress: transaction.recipientAddress,
      senderAddress: transaction.senderAddress,
      status: transaction.status,
      timestamp: transaction.timestamp,
      gasUsed: transaction.gasUsed,
      gasPrice: transaction.gasPrice,
      blockNumber: transaction.blockNumber,
      network: transaction.network,
      metadata: transaction.metadata,
    }
  } catch (error) {
    console.error('Error fetching transaction by hash:', error)
    throw error
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  txHash: string,
  status: 'pending' | 'completed' | 'failed',
  updates?: Partial<Pick<Transaction, 'gasUsed' | 'gasPrice' | 'blockNumber'>>
): Promise<void> {
  try {
    const db = await getDatabase()
    const updateData: any = { status }
    
    if (updates) {
      if (updates.gasUsed) updateData.gasUsed = updates.gasUsed
      if (updates.gasPrice) updateData.gasPrice = updates.gasPrice
      if (updates.blockNumber) updateData.blockNumber = updates.blockNumber
    }
    
    await db.collection(COLLECTION_NAME).updateOne(
      { txHash },
      { $set: updateData }
    )
  } catch (error) {
    console.error('Error updating transaction status:', error)
    throw error
  }
}

/**
 * Get recent transactions (last N transactions)
 */
export async function getRecentTransactions(
  userId: string,
  limit: number = 10
): Promise<Transaction[]> {
  try {
    const db = await getDatabase()
    const transactions = await db
      .collection(COLLECTION_NAME)
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()
    
    return transactions.map((tx) => ({
      _id: tx._id.toString(),
      userId: tx.userId,
      txHash: tx.txHash,
      type: tx.type,
      tokenSymbol: tx.tokenSymbol,
      amount: tx.amount,
      recipientAddress: tx.recipientAddress,
      senderAddress: tx.senderAddress,
      status: tx.status,
      timestamp: tx.timestamp,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
      network: tx.network,
      metadata: tx.metadata,
    }))
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    throw error
  }
}

/**
 * Get transactions by type
 */
export async function getTransactionsByType(
  userId: string,
  type: 'send' | 'swap' | 'receive'
): Promise<Transaction[]> {
  try {
    const db = await getDatabase()
    const transactions = await db
      .collection(COLLECTION_NAME)
      .find({ userId, type })
      .sort({ timestamp: -1 })
      .toArray()
    
    return transactions.map((tx) => ({
      _id: tx._id.toString(),
      userId: tx.userId,
      txHash: tx.txHash,
      type: tx.type,
      tokenSymbol: tx.tokenSymbol,
      amount: tx.amount,
      recipientAddress: tx.recipientAddress,
      senderAddress: tx.senderAddress,
      status: tx.status,
      timestamp: tx.timestamp,
      gasUsed: tx.gasUsed,
      gasPrice: tx.gasPrice,
      blockNumber: tx.blockNumber,
      network: tx.network,
      metadata: tx.metadata,
    }))
  } catch (error) {
    console.error('Error fetching transactions by type:', error)
    throw error
  }
}

/**
 * Delete a transaction (for cleanup/testing)
 */
export async function deleteTransaction(txHash: string): Promise<void> {
  try {
    const db = await getDatabase()
    await db.collection(COLLECTION_NAME).deleteOne({ txHash })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}

