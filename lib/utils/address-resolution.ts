/**
 * Address Resolution Utilities
 * 
 * Functions to resolve and validate Ethereum addresses and Farcaster FIDs
 */

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  // Basic validation: must start with 0x and be 42 characters long
  if (!address.startsWith('0x') || address.length !== 42) {
    return false
  }
  
  // Check if all characters after 0x are valid hex
  const hexPattern = /^0x[a-fA-F0-9]{40}$/
  return hexPattern.test(address)
}

/**
 * Convert an address to checksum format
 * Uses EIP-55 checksumming
 */
export function toChecksumAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error('Invalid Ethereum address')
  }
  
  const addressLower = address.toLowerCase()
  const hash = require('crypto').createHash('sha3-256').update(addressLower).digest('hex')
  
  let checksum = '0x'
  for (let i = 0; i < 40; i++) {
    checksum += parseInt(hash[i], 16) >= 8 
      ? addressLower[i + 2].toUpperCase() 
      : addressLower[i + 2]
  }
  
  return checksum
}

/**
 * Format address for display (first 6 and last 4 characters)
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!isValidAddress(address)) {
    return address
  }
  
  return `${address.substring(0, startChars + 2)}...${address.substring(42 - endChars)}`
}

/**
 * Extract Ethereum address from a string
 * Handles various formats like:
 * - Plain address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
 * - With text: Send to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
 * - ENS names: vitalik.eth (future support)
 */
export function extractAddress(text: string): string | null {
  // Look for Ethereum address pattern
  const addressPattern = /0x[a-fA-F0-9]{40}/gi
  const match = text.match(addressPattern)
  
  if (match && match.length > 0) {
    return match[0]
  }
  
  return null
}

/**
 * Resolve Farcaster username (@username) to FID
 * Note: This is a placeholder. In production, you would call the Farcaster API
 */
export async function resolveFarcasterUsername(username: string): Promise<string | null> {
  // Remove @ if present
  const cleanUsername = username.replace('@', '')
  
  // TODO: Implement Farcaster API call to resolve username to FID
  // For now, return null to indicate it needs implementation
  console.warn('Farcaster username resolution not yet implemented:', cleanUsername)
  
  return null
}

/**
 * Resolve Farcaster FID to wallet address
 * Note: This is a placeholder. In production, you would call the Farcaster API
 */
export async function resolveFidToAddress(fid: number): Promise<string | null> {
  // TODO: Implement Farcaster API call to resolve FID to address
  // For now, return null to indicate it needs implementation
  console.warn('Farcaster FID to address resolution not yet implemented:', fid)
  
  return null
}

/**
 * Parse and validate a recipient identifier
 * Can be:
 * - Ethereum address (0x...)
 * - Farcaster username (@username)
 * - Farcaster FID (numeric)
 * 
 * Returns the resolved Ethereum address or null if invalid
 */
export async function parseRecipient(recipient: string): Promise<{
  address: string | null
  type: 'address' | 'username' | 'fid'
}> {
  // Check if it's an Ethereum address
  if (isValidAddress(recipient)) {
    return {
      address: recipient,
      type: 'address',
    }
  }
  
  // Check if it's a Farcaster username
  if (recipient.startsWith('@')) {
    const fid = await resolveFarcasterUsername(recipient)
    if (fid) {
      const address = await resolveFidToAddress(parseInt(fid))
      return {
        address,
        type: 'username',
      }
    }
  }
  
  // Check if it's a numeric FID
  const fidMatch = recipient.match(/^\d+$/)
  if (fidMatch) {
    const address = await resolveFidToAddress(parseInt(recipient))
    return {
      address,
      type: 'fid',
    }
  }
  
  return {
    address: null,
    type: 'address',
  }
}

