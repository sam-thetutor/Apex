export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidFID(fid: string | number): boolean {
  const num = typeof fid === 'string' ? parseInt(fid, 10) : fid
  return !isNaN(num) && num > 0
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

export function formatAddress(address: string): string {
  if (!isValidEthereumAddress(address)) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatAmount(amount: string, decimals: number = 6): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  return num.toFixed(decimals)
}

