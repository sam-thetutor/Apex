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
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    caip19: 'eip155:8453/erc20:0x4200000000000000000000000000000000000006',
    address: '0x4200000000000000000000000000000000000006',
    icon: '💎',
  },
  AERO: {
    symbol: 'AERO',
    name: 'Aerodrome Finance',
    decimals: 18,
    caip19: 'eip155:8453/erc20:0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
    icon: '✈️',
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

