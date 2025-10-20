// Base Network Configuration
export const BASE_CONFIG = {
  chainId: 8453,
  chainName: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
}

// Base Testnet (for testing)
export const BASE_TESTNET_CONFIG = {
  chainId: 84532,
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia-explorer.base.org'],
}

export function getBaseExplorerUrl(txHash: string): string {
  return `https://basescan.org/tx/${txHash}`
}

export function getBaseExplorerAddress(address: string): string {
  return `https://basescan.org/address/${address}`
}

