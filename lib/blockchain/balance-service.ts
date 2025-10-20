import { ethers } from 'ethers'
import { BASE_CONFIG } from './base-config'
import { BASE_TOKENS } from '@/lib/tokens/base-tokens'

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
 */
export async function fetchBalanceForToken(
  tokenSymbol: string,
  userAddress: string
): Promise<{
  balance: string
  usdValue: string
}> {
  const token = BASE_TOKENS[tokenSymbol.toUpperCase()]
  
  if (!token) {
    throw new Error(`Token ${tokenSymbol} not supported`)
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
 */
export async function fetchPortfolio(userAddress: string): Promise<
  {
    symbol: string
    balance: string
    usdValue: string
  }[]
> {
  try {
    const tokens = Object.keys(BASE_TOKENS)
    const portfolio = []
    
    for (const tokenSymbol of tokens) {
      try {
        const balanceData = await fetchBalanceForToken(tokenSymbol, userAddress)
        
        // Only include tokens with non-zero balance
        const balanceNum = parseFloat(balanceData.balance)
        if (balanceNum > 0) {
          portfolio.push({
            symbol: tokenSymbol,
            ...balanceData,
          })
        }
      } catch (error) {
        console.error(`Error fetching ${tokenSymbol} balance:`, error)
        // Continue with other tokens
      }
    }
    
    return portfolio
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to fetch portfolio: ${errorMessage}`)
  }
}

