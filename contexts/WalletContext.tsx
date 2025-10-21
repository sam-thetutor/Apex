'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { ethers } from 'ethers'
import { BASE_TOKENS } from '@/lib/tokens/base-tokens'

export interface SendTokenParams {
  tokenAddress: string  // Contract address or 'native' for ETH
  recipientAddress: string
  amount: string  // Human-readable amount
  tokenSymbol: string
  tokenDecimals: number
}

export interface SendTokenResult {
  success: boolean
  txHash?: string
  error?: string
}

export interface SwapTokenParams {
  sellTokenAddress: string
  buyTokenAddress: string
  sellAmount: string
  sellTokenDecimals: number
  buyTokenDecimals: number
  sellTokenSymbol: string
  buyTokenSymbol: string
  slippage?: number
}

export interface SwapTokenResult {
  success: boolean
  txHash?: string
  error?: string
}

interface WalletContextType {
  isConnected: boolean
  address: string
  isInMiniApp: boolean | null
  connectWallet: () => Promise<void>
  sendToken: (params: SendTokenParams) => Promise<SendTokenResult>
  swapTokens: (params: SwapTokenParams) => Promise<SwapTokenResult>
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if running in Farcaster Mini App
    const checkEnvironment = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp()
        setIsInMiniApp(inMiniApp)
        
        if (inMiniApp) {
          // In Farcaster - wallet is automatically connected
          setIsConnected(true)
          // Try to get the wallet address
          try {
            const accounts = await sdk.wallet.ethProvider.request({
              method: 'eth_accounts',
            })
            if (accounts && accounts.length > 0) {
              setAddress(accounts[0])
            }
          } catch (error) {
            console.log('No wallet connected yet')
          }
        }
      } catch (error) {
        setIsInMiniApp(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkEnvironment()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      if (isInMiniApp) {
        // In Farcaster - wallet should already be connected
        const accounts = await sdk.wallet.ethProvider.request({
          method: 'eth_accounts',
        })
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      } else {
        // Standalone web app - connect MetaMask
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const provider = (window as any).ethereum
          const accounts = await provider.request({ method: 'eth_requestAccounts' })
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
          }
        } else {
          alert('MetaMask not detected. Please install MetaMask.')
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const sendToken = async (params: SendTokenParams): Promise<SendTokenResult> => {
    try {
      console.log('Sending token:', params)

      if (isInMiniApp) {
        // Use Farcaster SDK for sending tokens
        try {
          // Convert amount to wei/smallest unit
          const amountInWei = ethers.parseUnits(params.amount, params.tokenDecimals)
          
          // Build CAIP-19 asset ID for the token
          // Format: eip155:8453/erc20:0x... or eip155:8453/native for ETH
          const tokenId = params.tokenAddress === 'native' 
            ? 'eip155:8453/native'
            : `eip155:8453/erc20:${params.tokenAddress}`
          
          // Use Farcaster SDK's sendToken action
          const result = await sdk.actions.sendToken({
            token: tokenId,
            amount: amountInWei.toString(),
            recipientAddress: params.recipientAddress,
          })

          console.log('Transaction sent via Farcaster SDK:', result)
          
          // Extract transaction hash from the result
          const txHash = result.success && result.send ? result.send.transaction : undefined
          
          if (!result.success) {
            return {
              success: false,
              error: result.reason === 'rejected_by_user' 
                ? 'Transaction rejected by user'
                : result.error?.message || 'Transaction failed',
            }
          }
          
          return {
            success: true,
            txHash,
          }
        } catch (error) {
          console.error('Farcaster SDK send error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return {
            success: false,
            error: `Failed to send token: ${errorMessage}`,
          }
        }
      } else {
        // MetaMask fallback
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const provider = new ethers.BrowserProvider((window as any).ethereum)
          const signer = await provider.getSigner()

          if (params.tokenAddress === 'native') {
            // Send native ETH
            const tx = await signer.sendTransaction({
              to: params.recipientAddress,
              value: ethers.parseEther(params.amount),
            })
            
            return {
              success: true,
              txHash: tx.hash,
            }
          } else {
            // Send ERC-20 token
            const tokenContract = new ethers.Contract(
              params.tokenAddress,
              [
                'function transfer(address to, uint256 amount) returns (bool)',
              ],
              signer
            )

            const amountInWei = ethers.parseUnits(params.amount, params.tokenDecimals)
            const tx = await tokenContract.transfer(params.recipientAddress, amountInWei)
            
            return {
              success: true,
              txHash: tx.hash,
            }
          }
        } else {
          return {
            success: false,
            error: 'MetaMask not detected',
          }
        }
      }
    } catch (error) {
      console.error('Error sending token:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Transaction failed: ${errorMessage}`,
      }
    }
  }

  const swapTokens = async (params: SwapTokenParams): Promise<SwapTokenResult> => {
    try {
      console.log('Swapping tokens:', params)

      if (isInMiniApp) {
        // Use Farcaster SDK for swapping tokens
        try {
          // Convert amount to wei/smallest unit
          const amountInWei = ethers.parseUnits(params.sellAmount, params.sellTokenDecimals)
          
          // Build CAIP-19 asset IDs
          const sellTokenId = params.sellTokenAddress === 'native' 
            ? 'eip155:8453/native'
            : `eip155:8453/erc20:${params.sellTokenAddress}`
          
          const buyTokenId = params.buyTokenAddress === 'native' 
            ? 'eip155:8453/native'
            : `eip155:8453/erc20:${params.buyTokenAddress}`
          
          // Use Farcaster SDK's swapToken action
          const result = await sdk.actions.swapToken({
            sellToken: sellTokenId,
            buyToken: buyTokenId,
            sellAmount: amountInWei.toString(),
          })

          console.log('Swap transaction sent via Farcaster SDK:', result)
          
          // Extract transaction hash from the result (use first transaction)
          const txHash = result.success && result.swap && result.swap.transactions.length > 0 
            ? result.swap.transactions[0] 
            : undefined
          
          if (!result.success) {
            return {
              success: false,
              error: result.reason === 'rejected_by_user' 
                ? 'Swap rejected by user'
                : result.error?.message || 'Swap failed',
            }
          }
          
          return {
            success: true,
            txHash,
          }
        } catch (error) {
          console.error('Farcaster SDK swap error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return {
            success: false,
            error: `Failed to swap tokens: ${errorMessage}`,
          }
        }
      } else {
        // MetaMask fallback - would need to implement direct DEX interaction
        return {
          success: false,
          error: 'Swap functionality requires Farcaster wallet',
        }
      }
    } catch (error) {
      console.error('Error swapping tokens:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Swap failed: ${errorMessage}`,
      }
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        isInMiniApp,
        connectWallet,
        sendToken,
        swapTokens,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

