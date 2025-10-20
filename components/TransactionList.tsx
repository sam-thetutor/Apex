'use client'

export function TransactionList() {
  // TODO: Fetch real transactions from Farcaster SDK
  const transactions = [
    {
      id: 1,
      type: 'send',
      token: 'USDC',
      amount: '100',
      recipient: '@alice',
      hash: '0x123...abc',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'completed',
    },
    {
      id: 2,
      type: 'swap',
      tokenFrom: 'ETH',
      tokenTo: 'USDC',
      amount: '0.5',
      hash: '0x456...def',
      timestamp: new Date('2024-01-14T15:20:00'),
      status: 'completed',
    },
  ]

  return (
    <div className="p-4 space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by sending or swapping tokens
          </p>
        </div>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-4 hover:border-primary-300 hover:bg-white/90 transition-all shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                {tx.type === 'send' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📤</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Sent {tx.amount} {tx.token}
                      </p>
                      <p className="text-sm text-gray-600">To {tx.recipient}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Swapped {tx.amount} {tx.tokenFrom} → {tx.tokenTo}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {tx.timestamp.toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {tx.status}
              </span>
            </div>
            <a
              href={`https://basescan.org/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
            >
              View on BaseScan →
            </a>
          </div>
        ))
      )}
    </div>
  )
}

