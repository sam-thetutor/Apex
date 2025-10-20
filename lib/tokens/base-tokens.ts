export interface Token {
  symbol: string
  name: string
  decimals: number
  caip19: string
  address: string
  icon?: string
}

export const BASE_TOKENS: Record<string, Token> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    caip19: 'eip155:8453/native',
    address: 'native',
    icon: '💎',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    caip19: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    icon: '💵',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    caip19: 'eip155:8453/erc20:0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    icon: '🪙',
  },
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  return BASE_TOKENS[symbol.toUpperCase()]
}

export function getTokenByAddress(address: string): Token | undefined {
  return Object.values(BASE_TOKENS).find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  )
}

