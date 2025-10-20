import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { fetchBalanceForToken } from '@/lib/blockchain/balance-service'

export const balanceTool = new DynamicStructuredTool({
  name: 'get_token_balance',
  description: 'Get the balance of a specific token (ETH, USDC, or DAI) for a given wallet address on Base blockchain',
  schema: z.object({
    tokenSymbol: z.enum(['ETH', 'USDC', 'DAI']).describe('The token symbol to check balance for'),
    walletAddress: z.string().describe('The wallet address to check balance for'),
  }),
  func: async (input) => {
    const { tokenSymbol, walletAddress } = input as { tokenSymbol: 'ETH' | 'USDC' | 'DAI'; walletAddress: string }
    try {
      console.log(`Fetching ${tokenSymbol} balance for address ${walletAddress} from Base network...`)
      const result = await fetchBalanceForToken(tokenSymbol, walletAddress)
      return `Balance: ${result.balance} ${tokenSymbol} ($${result.usdValue} USD)`
    } catch (error) {
      console.error('Error fetching balance:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return `Error fetching ${tokenSymbol} balance: ${errorMessage}`
    }
  },
})

