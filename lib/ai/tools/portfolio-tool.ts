import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { fetchPortfolio } from '@/lib/blockchain/balance-service'

export const portfolioTool = new DynamicStructuredTool({
  name: 'get_portfolio',
  description: 'Get the complete portfolio including all token balances (ETH, USDC, DAI) and total USD value for a given wallet address on Base blockchain',
  schema: z.object({
    walletAddress: z.string().describe('The wallet address to get portfolio for'),
  }),
  func: async (input) => {
    const { walletAddress } = input as { walletAddress: string }
    try {
      console.log(`Fetching portfolio for address ${walletAddress} from Base network...`)
      const portfolio = await fetchPortfolio(walletAddress)
      
      if (portfolio.length === 0) {
        return `📊 Your Portfolio on Base:\n\nNo tokens found. Your wallet appears to be empty.`
      }

      const totalValue = portfolio.reduce(
        (sum, token) => sum + parseFloat(token.usdValue.replace(/,/g, '')),
        0
      )

      let result = `📊 Your Portfolio on Base:\n\n`
      portfolio.forEach((token) => {
        result += `${token.symbol}: ${token.balance} ($${token.usdValue})\n`
      })
      result += `\nTotal Value: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`

      return result
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return `Error fetching portfolio: ${errorMessage}`
    }
  },
})

