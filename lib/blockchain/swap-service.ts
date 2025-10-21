import { ethers } from 'ethers'
import { BASE_CONFIG } from './base-config'
import { BASE_TOKENS, Token } from '@/lib/tokens/base-tokens'
import { getUserTokens, CustomToken } from '@/lib/db/token-service'

const provider = new ethers.JsonRpcProvider(BASE_CONFIG.rpcUrls[0])

// Aerodrome Router V2 (Base mainnet)
const AERODROME_ROUTER_V2 = '0x420DD381b31aEf6683db6B902084cB0FFECe40Da'

// Router ABI (simplified for swap operations)
const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)',
]

export interface SwapQuote {
  sellToken: string
  buyToken: string
  sellAmount: string
  buyAmount: string
  rate: string
  slippage: number
  gasEstimate: string
  route: string[]
}

export interface SwapParams {
  sellTokenAddress: string
  buyTokenAddress: string
  sellAmount: string
  sellTokenDecimals: number
  buyTokenDecimals: number
  sellTokenSymbol: string
  buyTokenSymbol: string
  slippage?: number // Default 0.5% (50 basis points)
  deadline?: number // Default 20 minutes
}

/**
 * Get a swap quote
 * Note: Since we're using Farcaster SDK's swapToken action, we provide a simple quote.
 * The SDK will handle the actual routing and execution.
 */
export async function getSwapQuote(params: SwapParams): Promise<SwapQuote> {
  try {
    // For now, we'll provide a simple estimate based on common rates
    // The Farcaster SDK will handle the actual swap execution with proper routing
    
    const sellAmountFloat = parseFloat(params.sellAmount)
    
    // Simple rate estimates (these are rough approximations)
    // In production, you might want to fetch real-time rates from a price API
    const rateEstimates: Record<string, number> = {
      'ETH-USDC': 2000, // 1 ETH ≈ 2000 USDC
      'ETH-DAI': 2000,
      'USDC-ETH': 0.0005, // 1 USDC ≈ 0.0005 ETH
      'USDC-DAI': 1,
      'DAI-USDC': 1,
      'DAI-ETH': 0.0005,
    }
    
    const pairKey = `${params.sellTokenSymbol}-${params.buyTokenSymbol}`
    const estimatedRate = rateEstimates[pairKey] || 1
    
    // Calculate estimated output
    const buyAmountFloat = sellAmountFloat * estimatedRate
    const buyAmount = buyAmountFloat.toFixed(6)
    
    // Apply slippage (default 0.5%)
    const slippage = params.slippage || 50 // 50 basis points = 0.5%
    
    // Estimate gas (rough estimate)
    const gasEstimate = '150000' // Typical gas for swap
    
    return {
      sellToken: params.sellTokenSymbol,
      buyToken: params.buyTokenSymbol,
      sellAmount: params.sellAmount,
      buyAmount,
      rate: estimatedRate.toFixed(6),
      slippage: slippage / 100, // Convert to percentage
      gasEstimate,
      route: [params.sellTokenAddress, params.buyTokenAddress],
    }
  } catch (error) {
    console.error('Error getting swap quote:', error)
    throw new Error(`Failed to get swap quote: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate swap parameters
 */
export function validateSwap(params: SwapParams): {
  valid: boolean
  error?: string
} {
  // Validate amounts
  const amountNum = parseFloat(params.sellAmount)
  if (isNaN(amountNum) || amountNum <= 0) {
    return {
      valid: false,
      error: 'Invalid swap amount. Must be greater than 0.',
    }
  }
  
  // Validate token addresses (allow 'native' for ETH)
  const isSellTokenValid = params.sellTokenAddress === 'native' || ethers.isAddress(params.sellTokenAddress)
  if (!isSellTokenValid) {
    return {
      valid: false,
      error: 'Invalid sell token address.',
    }
  }
  
  const isBuyTokenValid = params.buyTokenAddress === 'native' || ethers.isAddress(params.buyTokenAddress)
  if (!isBuyTokenValid) {
    return {
      valid: false,
      error: 'Invalid buy token address.',
    }
  }
  
  // Can't swap same token
  if (params.sellTokenAddress.toLowerCase() === params.buyTokenAddress.toLowerCase()) {
    return {
      valid: false,
      error: 'Cannot swap a token for itself.',
    }
  }
  
  // Validate slippage
  const slippage = params.slippage || 50
  if (slippage < 0 || slippage > 1000) {
    return {
      valid: false,
      error: 'Slippage must be between 0% and 10%.',
    }
  }
  
  return { valid: true }
}

/**
 * Check if a token pair is supported for swapping
 */
export async function isTokenPairSupported(
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  walletAddress: string
): Promise<{
  supported: boolean
  sellToken?: any
  buyToken?: any
  error?: string
}> {
  try {
    // Check built-in tokens
    let sellToken: Token | CustomToken | undefined = BASE_TOKENS[sellTokenSymbol.toUpperCase()]
    let buyToken: Token | CustomToken | undefined = BASE_TOKENS[buyTokenSymbol.toUpperCase()]
    
    // If not found, check user's custom tokens
    if (!sellToken || !buyToken) {
      const userTokens = await getUserTokens(walletAddress)
      
      if (!sellToken) {
        sellToken = userTokens.find((t) => t.symbol.toUpperCase() === sellTokenSymbol.toUpperCase())
      }
      
      if (!buyToken) {
        buyToken = userTokens.find((t) => t.symbol.toUpperCase() === buyTokenSymbol.toUpperCase())
      }
    }
    
    if (!sellToken) {
      return {
        supported: false,
        error: `Sell token ${sellTokenSymbol} not found in your portfolio.`,
      }
    }
    
    if (!buyToken) {
      return {
        supported: false,
        error: `Buy token ${buyTokenSymbol} not found in your portfolio.`,
      }
    }
    
    return {
      supported: true,
      sellToken,
      buyToken,
    }
  } catch (error) {
    return {
      supported: false,
      error: 'Failed to check token pair support.',
    }
  }
}

/**
 * Calculate minimum output amount with slippage
 */
export function calculateMinOutput(amountOut: string, slippage: number): string {
  const amount = parseFloat(amountOut)
  const minAmount = amount * (1 - slippage / 100)
  return minAmount.toFixed(6)
}

