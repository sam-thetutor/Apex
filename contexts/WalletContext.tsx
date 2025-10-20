'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface WalletContextType {
  isConnected: boolean
  address: string
  isInMiniApp: boolean | null
  connectWallet: () => Promise<void>
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

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        isInMiniApp,
        connectWallet,
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

