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
 * Get a swap quote from Aerodrome
 */
export async function getSwapQuote(params: SwapParams): Promise<SwapQuote> {
  try {
    const router = new ethers.Contract(AERODROME_ROUTER_V2, ROUTER_ABI, provider)
    
    // Convert amount to wei/smallest unit
    const amountIn = ethers.parseUnits(params.sellAmount, params.sellTokenDecimals)
    
    // Build swap path (use WETH address for native ETH)
    const wethAddress = BASE_TOKENS.WETH.address
    const sellAddress = params.sellTokenAddress === 'native' ? wethAddress : params.sellTokenAddress
    const buyAddress = params.buyTokenAddress === 'native' ? wethAddress : params.buyTokenAddress
    const path = [sellAddress, buyAddress]
    
    // Get expected output amount
    const amounts = await router.getAmountsOut(amountIn, path)
    const amountOut = amounts[1] // Second element is output amount
    
    // Calculate rate
    const sellAmountFloat = parseFloat(params.sellAmount)
    const buyAmountFloat = parseFloat(ethers.formatUnits(amountOut, params.buyTokenDecimals))
    const rate = (buyAmountFloat / sellAmountFloat).toFixed(6)
    
    // Apply slippage (default 0.5%)
    const slippage = params.slippage || 50 // 50 basis points = 0.5%
    const amountOutMin = (amountOut * BigInt(10000 - slippage)) / BigInt(10000)
    
    // Estimate gas (rough estimate)
    const gasEstimate = '150000' // Typical gas for swap
    
    return {
      sellToken: params.sellTokenSymbol,
      buyToken: params.buyTokenSymbol,
      sellAmount: params.sellAmount,
      buyAmount: ethers.formatUnits(amountOut, params.buyTokenDecimals),
      rate,
      slippage: slippage / 100, // Convert to percentage
      gasEstimate,
      route: path,
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

