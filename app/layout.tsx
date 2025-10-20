import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FarcasterProvider } from '@/components/FarcasterProvider'
import { WalletProvider } from '@/contexts/WalletContext'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://apex-alpha-livid.vercel.app'),
  title: 'Apex - AI Token Assistant',
  description: 'AI-powered token management. Send, receive, and swap tokens through natural language.',
  openGraph: {
    title: 'Apex',
    description: 'AI-powered token management',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FarcasterProvider>
          <WalletProvider>
            <Navbar />
            {children}
          </WalletProvider>
        </FarcasterProvider>
      </body>
    </html>
  )
}

