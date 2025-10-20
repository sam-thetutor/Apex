'use client'

export function PortfolioOverview() {
  // TODO: Fetch real balances from Farcaster SDK
  const tokens = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '1.234',
      usdValue: '2,468.00',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '5,000.00',
      usdValue: '5,000.00',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      balance: '1,250.50',
      usdValue: '1,250.50',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  const totalValue = tokens.reduce(
    (sum, token) => sum + parseFloat(token.usdValue.replace(/,/g, '')),
    0
  )

  return (
    <div className="p-4 space-y-4">
      {/* Total Value */}
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-emerald-600 rounded-2xl p-6 text-white shadow-xl border border-white/20 backdrop-blur-md">
        <p className="text-sm opacity-90">Total Portfolio Value</p>
        <p className="text-3xl font-bold mt-1">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 px-1">
          Your Tokens
        </h2>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-4 hover:border-primary-300 hover:bg-white/90 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="text-teal-600">{token.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{token.symbol}</p>
                  <p className="text-sm text-gray-600">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{token.balance}</p>
                <p className="text-sm text-gray-600">${token.usdValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

