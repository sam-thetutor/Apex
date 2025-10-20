'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide the splash screen when the app is ready
    sdk.actions.ready()
  }, [])

  return <>{children}</>
}

