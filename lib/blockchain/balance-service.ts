import { ethers } from 'ethers'
import { BASE_CONFIG } from './base-config'
import { BASE_TOKENS, Token } from '@/lib/tokens/base-tokens'
import { getUserTokens, CustomToken } from '@/lib/db/token-service'

// ERC-20 ABI for balanceOf
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]

// Create a provider for Base network
const provider = new ethers.JsonRpcProvider(BASE_CONFIG.rpcUrls[0])

/**
 * Fetch ETH balance for a given address
 */
export async function fetchETHBalance(address: string): Promise<{
  balance: string
  usdValue: string
}> {
  try {
    const balance = await provider.getBalance(address)
    const balanceInEth = ethers.formatEther(balance)
    
    // For now, we'll use a mock price. In production, fetch from a price API
    const ethPrice = 2000 // Mock price in USD
    const usdValue = (parseFloat(balanceInEth) * ethPrice).toFixed(2)
    
    // Format balance to preserve small values
    const formattedBalance = parseFloat(balanceInEth).toFixed(6)
    
    return {
      balance: formattedBalance,
      usdValue: parseFloat(usdValue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }
  } catch (error) {
    console.error('Error fetching ETH balance:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to fetch ETH balance: ${errorMessage}`)
  }
}

/**
 * Fetch ERC-20 token balance for a given address
 */
export async function fetchTokenBalance(
  tokenAddress: string,
  userAddress: string
): Promise<{
  balance: string
  usdValue: string
  symbol: string
}> {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    )
    
    const [balance, decimals, symbol] = await Promise.all([
      tokenContract.balanceOf(userAddress),
      tokenContract.decimals(),
      tokenContract.symbol(),
    ])
    
    const formattedBalance = ethers.formatUnits(balance, decimals)
    
    // Mock USD values for now
    const mockPrices: Record<string, number> = {
      USDC: 1.0,
      DAI: 1.0,
      USDT: 1.0,
    }
    
    const price = mockPrices[symbol] || 0
    const usdValue = (parseFloat(formattedBalance) * price).toFixed(2)
    
    // Format balance to preserve small values
    const balanceStr = parseFloat(formattedBalance).toFixed(6)
    
    return {
      balance: balanceStr,
      usdValue: parseFloat(usdValue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      symbol,
    }
  } catch (error) {
    console.error('Error fetching token balance:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to fetch token balance: ${errorMessage}`)
  }
}

/**
 * Fetch balance for a specific token (ETH or ERC-20)
 * Supports both built-in tokens and custom tokens from database
 */
export async function fetchBalanceForToken(
  tokenSymbol: string,
  userAddress: string
): Promise<{
  balance: string
  usdValue: string
}> {
  // First check built-in tokens
  let token: Token | CustomToken | undefined = BASE_TOKENS[tokenSymbol.toUpperCase()]
  
  // If not found in built-in tokens, check user's custom tokens
  if (!token) {
    const userTokens = await getUserTokens(userAddress)
    token = userTokens.find((t) => t.symbol.toUpperCase() === tokenSymbol.toUpperCase())
    
    if (!token) {
      throw new Error(`Token ${tokenSymbol} not found in your portfolio`)
    }
  }
  
  // Handle native ETH
  if (token.address === 'native') {
    return await fetchETHBalance(userAddress)
  }
  
  // Handle ERC-20 tokens
  const result = await fetchTokenBalance(token.address, userAddress)
  return {
    balance: result.balance,
    usdValue: result.usdValue,
  }
}

/**
 * Fetch complete portfolio for a user
 * Fetches balances for all tokens in user's portfolio (default + custom)
 */
export async function fetchPortfolio(userAddress: string): Promise<
  {
    symbol: string
    balance: string
    usdValue: string
  }[]
> {
  try {
    // Get user's tokens from database (includes default + custom tokens)
    const userTokens = await getUserTokens(userAddress)
    const portfolio = []
    
    for (const token of userTokens) {
      try {
        let balanceData
        
        // Handle native ETH
        if (token.address === 'native') {
          balanceData = await fetchETHBalance(userAddress)
        } else {
          // Handle ERC-20 tokens
          const result = await fetchTokenBalance(token.address, userAddress)
          balanceData = {
            balance: result.balance,
            usdValue: result.usdValue,
          }
        }
        
        // Include all tokens (even with 0 balance)
        portfolio.push({
          symbol: token.symbol,
          ...balanceData,
        })
      } catch (error) {
        console.error(`Error fetching ${token.symbol} balance:`, error)
        
        // For tokens that fail to fetch, show them with 0 balance
        // This handles tokens with non-standard ERC-20 functions or RPC issues
        portfolio.push({
          symbol: token.symbol,
          balance: '0.000000',
          usdValue: '0.00',
        })
      }
    }
    
    return portfolio
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to fetch portfolio: ${errorMessage}`)
  }
}

