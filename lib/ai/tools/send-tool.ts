import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { BASE_TOKENS, Token } from '@/lib/tokens/base-tokens'
import { getUserTokens, CustomToken } from '@/lib/db/token-service'

export interface SendToolInput {
  tokenSymbol: string
  recipientAddress: string
  amount: string
  walletAddress: string
}

export interface SendToolOutput {
  success: boolean
  message: string
  tokenSymbol?: string
  amount?: string
  recipientAddress?: string
  tokenAddress?: string
  tokenDecimals?: number
}

/**
 * Send Token Tool
 * 
 * This tool prepares a token send transaction for user confirmation.
 * It validates the token, amount, and recipient, then returns transaction details
 * that the frontend can use to show a confirmation modal.
 * 
 * Note: This tool does NOT execute the transaction - it only prepares it.
 * The actual transaction is executed via the WalletContext after user confirmation.
 */
export const sendTool = new DynamicStructuredTool({
  name: 'send_token',
  description: `Send tokens to another address on Base blockchain. 
  
Supported tokens: ETH, USDC, DAI, WETH, AERO, and any custom tokens in user's portfolio.

The tool prepares the transaction details for user confirmation. The user must confirm before the transaction is executed.

Example usage:
- "Send 0.5 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
- "Transfer 100 USDC to 0x1234567890123456789012345678901234567890"
- "Send 50 DAI to 0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"`,
  
  schema: z.object({
    tokenSymbol: z.string().describe('The token symbol to send (e.g., ETH, USDC, DAI)'),
    recipientAddress: z.string().describe('The recipient Ethereum address (must be a valid 0x address)'),
    amount: z.string().describe('The amount to send as a numeric string (e.g., "0.5", "100", "50.25")'),
    walletAddress: z.string().describe('The sender wallet address'),
  }),
  
  func: async (input): Promise<string> => {
    const { tokenSymbol, recipientAddress, amount, walletAddress } = input as SendToolInput
    
    try {
      console.log(`Preparing send transaction: ${amount} ${tokenSymbol} to ${recipientAddress}`)
      
      // Validate token symbol
      const upperSymbol = tokenSymbol.toUpperCase()
      
      // Check if token exists in built-in tokens or user's custom tokens
      let token: Token | CustomToken | undefined = BASE_TOKENS[upperSymbol]
      
      if (!token) {
        // Check user's custom tokens
        const userTokens = await getUserTokens(walletAddress)
        token = userTokens.find((t) => t.symbol.toUpperCase() === upperSymbol)
        
        if (!token) {
          return JSON.stringify({
            success: false,
            message: `Token ${tokenSymbol} not found. Supported tokens: ETH, USDC, DAI, WETH, AERO, and your custom tokens.`,
          } as SendToolOutput)
        }
      }
      
      // Validate amount
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum <= 0) {
        return JSON.stringify({
          success: false,
          message: `Invalid amount: ${amount}. Amount must be a positive number.`,
        } as SendToolOutput)
      }
      
      // Validate recipient address format
      if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
        return JSON.stringify({
          success: false,
          message: `Invalid recipient address: ${recipientAddress}. Must be a valid Ethereum address (0x followed by 40 hex characters).`,
        } as SendToolOutput)
      }
      
      // Return success with transaction details for confirmation
      return JSON.stringify({
        success: true,
        message: `Ready to send ${amount} ${tokenSymbol} to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(38)}`,
        tokenSymbol: upperSymbol,
        amount: amount,
        recipientAddress: recipientAddress,
        tokenAddress: token.address,
        tokenDecimals: token.decimals,
      } as SendToolOutput)
      
    } catch (error) {
      console.error('Error in send tool:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return JSON.stringify({
        success: false,
        message: `Error preparing transaction: ${errorMessage}`,
      } as SendToolOutput)
    }
  },
})

