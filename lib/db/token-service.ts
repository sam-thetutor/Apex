import clientPromise from './mongodb'

export interface CustomToken {
  address: string
  symbol: string
  name: string
  decimals: number
  icon?: string
}

export interface UserTokens {
  userAddress: string
  tokens: CustomToken[]
  createdAt: Date
  updatedAt: Date
}

const DATABASE_NAME = 'apex'
const COLLECTION_NAME = 'user_tokens'

// Default tokens that every user starts with
export const DEFAULT_TOKENS: CustomToken[] = [
  {
    address: 'native',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    icon: '💎',
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    icon: '💵',
  },
  {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    icon: '🪙',
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    icon: '💎',
  },
  {
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    symbol: 'AERO',
    name: 'Aerodrome Finance',
    decimals: 18,
    icon: '✈️',
  },
]

/**
 * Get user's tokens, initialize with defaults if first time
 */
export async function getUserTokens(userAddress: string): Promise<CustomToken[]> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserTokens>(COLLECTION_NAME)

    // Check if user exists
    const userData = await collection.findOne({ userAddress })

    if (!userData) {
      // First time user - initialize with default tokens
      const newUserData: UserTokens = {
        userAddress,
        tokens: DEFAULT_TOKENS,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await collection.insertOne(newUserData)
      return DEFAULT_TOKENS
    }

    return userData.tokens
  } catch (error) {
    console.error('Error getting user tokens:', error)
    // Fallback to default tokens on error
    return DEFAULT_TOKENS
  }
}

/**
 * Add a custom token to user's portfolio
 */
export async function addCustomToken(
  userAddress: string,
  token: CustomToken
): Promise<CustomToken[]> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserTokens>(COLLECTION_NAME)

    // Check if user exists
    const userData = await collection.findOne({ userAddress })

    if (!userData) {
      // Initialize user with default tokens first
      await getUserTokens(userAddress)
    }

    // Check if token already exists
    const userTokens = await getUserTokens(userAddress)
    const tokenExists = userTokens.some(
      (t) => t.address.toLowerCase() === token.address.toLowerCase()
    )

    if (tokenExists) {
      throw new Error('Token already exists in your portfolio')
    }

    // Add token
    const updatedTokens = [...userTokens, token]
    await collection.updateOne(
      { userAddress },
      {
        $set: {
          tokens: updatedTokens,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return updatedTokens
  } catch (error) {
    console.error('Error adding custom token:', error)
    throw error
  }
}

/**
 * Remove a token from user's portfolio
 */
export async function removeCustomToken(
  userAddress: string,
  tokenAddress: string
): Promise<CustomToken[]> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserTokens>(COLLECTION_NAME)

    const userTokens = await getUserTokens(userAddress)
    const updatedTokens = userTokens.filter(
      (t) => t.address.toLowerCase() !== tokenAddress.toLowerCase()
    )

    // Don't allow removing all tokens
    if (updatedTokens.length === 0) {
      throw new Error('Cannot remove all tokens from portfolio')
    }

    await collection.updateOne(
      { userAddress },
      {
        $set: {
          tokens: updatedTokens,
          updatedAt: new Date(),
        },
      }
    )

    return updatedTokens
  } catch (error) {
    console.error('Error removing custom token:', error)
    throw error
  }
}

/**
 * Get a specific token by address
 */
export async function getTokenByAddress(
  userAddress: string,
  tokenAddress: string
): Promise<CustomToken | null> {
  try {
    const userTokens = await getUserTokens(userAddress)
    return (
      userTokens.find((t) => t.address.toLowerCase() === tokenAddress.toLowerCase()) || null
    )
  } catch (error) {
    console.error('Error getting token by address:', error)
    return null
  }
}

