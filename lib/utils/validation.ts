/**
 * Validation Utilities
 * 
 * Functions to validate user inputs for transactions
 */

import { isValidAddress } from './address-resolution'

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): {
  valid: boolean
  error?: string
} {
  if (!address) {
    return {
      valid: false,
      error: 'Address is required',
    }
  }

  if (!isValidAddress(address)) {
    return {
      valid: false,
      error: 'Invalid Ethereum address format. Must start with 0x and be 42 characters long.',
    }
  }

  return { valid: true }
}

/**
 * Validate amount
 */
export function validateAmount(amount: string): {
  valid: boolean
  error?: string
  numericValue?: number
} {
  if (!amount) {
    return {
      valid: false,
      error: 'Amount is required',
    }
  }

  const numericValue = parseFloat(amount)

  if (isNaN(numericValue)) {
    return {
      valid: false,
      error: 'Amount must be a valid number',
    }
  }

  if (numericValue <= 0) {
    return {
      valid: false,
      error: 'Amount must be greater than 0',
    }
  }

  if (numericValue > Number.MAX_SAFE_INTEGER) {
    return {
      valid: false,
      error: 'Amount is too large',
    }
  }

  return {
    valid: true,
    numericValue,
  }
}

/**
 * Validate token symbol
 */
export function validateTokenSymbol(symbol: string, supportedTokens: string[]): {
  valid: boolean
  error?: string
} {
  if (!symbol) {
    return {
      valid: false,
      error: 'Token symbol is required',
    }
  }

  const upperSymbol = symbol.toUpperCase()

  if (!supportedTokens.includes(upperSymbol)) {
    return {
      valid: false,
      error: `Token ${symbol} is not supported. Supported tokens: ${supportedTokens.join(', ')}`,
    }
  }

  return { valid: true }
}

/**
 * Validate send transaction parameters
 */
export interface SendTransactionParams {
  tokenSymbol: string
  amount: string
  recipientAddress: string
  supportedTokens: string[]
}

export function validateSendTransaction(params: SendTransactionParams): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate token symbol
  const tokenValidation = validateTokenSymbol(params.tokenSymbol, params.supportedTokens)
  if (!tokenValidation.valid && tokenValidation.error) {
    errors.push(tokenValidation.error)
  }

  // Validate amount
  const amountValidation = validateAmount(params.amount)
  if (!amountValidation.valid && amountValidation.error) {
    errors.push(amountValidation.error)
  }

  // Validate recipient address
  const addressValidation = validateAddress(params.recipientAddress)
  if (!addressValidation.valid && addressValidation.error) {
    errors.push(addressValidation.error)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  // Remove leading/trailing whitespace
  let sanitized = input.trim()

  // Remove any null bytes
  sanitized = sanitized.replace(/\0/g, '')

  // Limit length (prevent extremely long inputs)
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000)
  }

  return sanitized
}

/**
 * Validate numeric string for blockchain amounts
 */
export function validateNumericString(value: string, maxDecimals?: number): {
  valid: boolean
  error?: string
} {
  // Check if it's a valid number
  if (isNaN(parseFloat(value))) {
    return {
      valid: false,
      error: 'Must be a valid number',
    }
  }

  // Check for negative values
  if (parseFloat(value) < 0) {
    return {
      valid: false,
      error: 'Cannot be negative',
    }
  }

  // Check decimal places if specified
  if (maxDecimals !== undefined) {
    const decimalParts = value.split('.')
    if (decimalParts.length > 1 && decimalParts[1].length > maxDecimals) {
      return {
        valid: false,
        error: `Cannot have more than ${maxDecimals} decimal places`,
      }
    }
  }

  return { valid: true }
}

/**
 * Validate transaction hash
 */
export function validateTxHash(hash: string): {
  valid: boolean
  error?: string
} {
  if (!hash) {
    return {
      valid: false,
      error: 'Transaction hash is required',
    }
  }

  if (!hash.startsWith('0x')) {
    return {
      valid: false,
      error: 'Transaction hash must start with 0x',
    }
  }

  if (hash.length !== 66) {
    return {
      valid: false,
      error: 'Transaction hash must be 66 characters long (0x + 64 hex characters)',
    }
  }

  const hexPattern = /^0x[a-fA-F0-9]{64}$/
  if (!hexPattern.test(hash)) {
    return {
      valid: false,
      error: 'Transaction hash contains invalid characters',
    }
  }

  return { valid: true }
}

/**
 * Check if amount exceeds balance
 */
export function validateBalance(
  amount: string,
  balance: string,
  tokenSymbol: string
): {
  valid: boolean
  error?: string
} {
  const amountNum = parseFloat(amount)
  const balanceNum = parseFloat(balance)

  if (amountNum > balanceNum) {
    return {
      valid: false,
      error: `Insufficient ${tokenSymbol} balance. You have ${balance} ${tokenSymbol}, trying to send ${amount} ${tokenSymbol}`,
    }
  }

  return { valid: true }
}
