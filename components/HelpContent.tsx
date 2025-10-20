'use client'

export function HelpContent() {
  const examples = [
    {
      category: 'Send Tokens',
      commands: [
        'Send 100 USDC to @alice',
        'Transfer 0.5 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'Send 50 DAI to FID 1234',
      ],
    },
    {
      category: 'Swap Tokens',
      commands: [
        'Swap 0.1 ETH for USDC',
        'Exchange 1000 USDC for DAI',
        'Convert 50 DAI to ETH',
      ],
    },
    {
      category: 'Check Balances',
      commands: [
        'How much USDC do I have?',
        'Show my ETH balance',
        'What is my total portfolio value?',
      ],
    },
  ]

  const faqs = [
    {
      question: 'What tokens are supported?',
      answer:
        'Currently supporting ETH, USDC, and DAI on Base. More tokens coming soon!',
    },
    {
      question: 'How do I send tokens?',
      answer:
        'Just type a natural language command like "Send 100 USDC to @username" or use the recipient\'s FID or wallet address.',
    },
    {
      question: 'Are there fees?',
      answer:
        'You only pay Base network gas fees. Apex Base doesn\'t charge any additional fees.',
    },
    {
      question: 'How secure is this?',
      answer:
        'All transactions are executed through your Farcaster wallet. We never have access to your private keys.',
    },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Getting Started */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Getting Started
        </h2>
        <p className="text-gray-700">
          Apex Base uses AI to understand natural language commands. Just type
          what you want to do in plain English!
        </p>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Example Commands
        </h2>
        {examples.map((example) => (
          <div key={example.category} className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              {example.category}
            </h3>
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-3 space-y-2 border border-white/40 shadow-lg">
              {example.commands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-700 font-mono bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/40"
                >
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-md rounded-xl border border-white/40 p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-1">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-4 shadow-xl border border-white/20 backdrop-blur-md">
        <h2 className="font-semibold text-white mb-2">Need Help?</h2>
        <p className="text-sm text-teal-100">
          Reach out on Farcaster{' '}
          <a
            href="https://warpcast.com/~/channel/apex"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-teal-100 underline"
          >
            #apex
          </a>
        </p>
      </section>
    </div>
  )
}

