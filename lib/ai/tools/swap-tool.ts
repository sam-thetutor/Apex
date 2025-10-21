import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { getSwapQuote, validateSwap, isTokenPairSupported } from '@/lib/blockchain/swap-service'

export interface SwapToolInput {
  sellToken: string
  buyToken: string
  amount: string
  walletAddress: string
}

export interface SwapToolOutput {
  success: boolean
  message: string
  sellToken?: string
  buyToken?: string
  amount?: string
  sellTokenAddress?: string
  buyTokenAddress?: string
  sellTokenDecimals?: number
  buyTokenDecimals?: number
  estimatedOutput?: string
  rate?: string
  slippage?: number
}

/**
 * Swap Token Tool
 * 
 * This tool prepares a token swap transaction for user confirmation.
 * It validates the token pair, gets a swap quote, and returns transaction details
 * that the frontend can use to show a confirmation.
 * 
 * Note: This tool does NOT execute the transaction - it only prepares it.
 * The actual transaction is executed via the WalletContext after user confirmation.
 */
export const swapTool = new DynamicStructuredTool({
  name: 'swap_token',
  description: `Swap tokens on Base blockchain using Aerodrome DEX.
  
Supported tokens: ETH, USDC, DAI, WETH, AERO, and any custom tokens in user's portfolio.

The tool prepares the swap details for user confirmation. The user must confirm before the transaction is executed.

Example usage:
- "Swap 0.5 ETH for USDC"
- "Exchange 100 USDC for DAI"
- "Convert 50 DAI to ETH"`,
  
  schema: z.object({
    sellToken: z.string().describe('The token symbol to sell (e.g., ETH, USDC, DAI)'),
    buyToken: z.string().describe('The token symbol to buy (e.g., ETH, USDC, DAI)'),
    amount: z.string().describe('The amount to sell as a numeric string (e.g., "0.5", "100", "50.25")'),
    walletAddress: z.string().describe('The user wallet address'),
  }),
  
  func: async (input): Promise<string> => {
    const { sellToken, buyToken, amount, walletAddress } = input as SwapToolInput
    
    try {
      console.log(`Preparing swap: ${amount} ${sellToken} → ${buyToken}`)
      
      // Validate amount
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return JSON.stringify({
          success: false,
          message: `Invalid amount: ${amount}. Amount must be a positive number.`,
        } as SwapToolOutput)
      }
      
      // Check if token pair is supported
      const pairCheck = await isTokenPairSupported(sellToken, buyToken, walletAddress)
      
      if (!pairCheck.supported) {
        return JSON.stringify({
          success: false,
          message: pairCheck.error || 'Token pair not supported.',
        } as SwapToolOutput)
      }
      
      const { sellToken: sellTokenInfo, buyToken: buyTokenInfo } = pairCheck
      
      // Prepare swap parameters
      const swapParams = {
        sellTokenAddress: sellTokenInfo!.address,
        buyTokenAddress: buyTokenInfo!.address,
        sellAmount: amount,
        sellTokenDecimals: sellTokenInfo!.decimals,
        buyTokenDecimals: buyTokenInfo!.decimals,
        sellTokenSymbol: sellToken.toUpperCase(),
        buyTokenSymbol: buyToken.toUpperCase(),
        slippage: 50, // 0.5% default
        deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
      }
      
      // Validate swap parameters
      const validation = validateSwap(swapParams)
      if (!validation.valid) {
        return JSON.stringify({
          success: false,
          message: validation.error || 'Invalid swap parameters.',
        } as SwapToolOutput)
      }
      
      // Get swap quote
      const quote = await getSwapQuote(swapParams)
      
      // Return success with swap details for confirmation
      return JSON.stringify({
        success: true,
        message: `Ready to swap ${amount} ${sellToken} for ~${quote.buyAmount} ${buyToken}`,
        sellToken: sellToken.toUpperCase(),
        buyToken: buyToken.toUpperCase(),
        amount: amount,
        sellTokenAddress: swapParams.sellTokenAddress,
        buyTokenAddress: swapParams.buyTokenAddress,
        sellTokenDecimals: swapParams.sellTokenDecimals,
        buyTokenDecimals: swapParams.buyTokenDecimals,
        estimatedOutput: quote.buyAmount,
        rate: quote.rate,
        slippage: quote.slippage,
      } as SwapToolOutput)
      
    } catch (error) {
      console.error('Error in swap tool:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return JSON.stringify({
        success: false,
        message: `Error preparing swap: ${errorMessage}`,
      } as SwapToolOutput)
    }
  },
})

