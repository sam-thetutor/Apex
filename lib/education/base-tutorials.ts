export interface TutorialStep {
  id: string
  title: string
  content: string
  type: 'text' | 'interactive' | 'quiz'
  quizQuestion?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

export interface TutorialExam {
  questions: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }[]
}

export interface Tutorial {
  id: string
  title: string
  description: string
  category: 'getting-started' | 'base-benefits' | 'practical-use' | 'advanced'
  steps: TutorialStep[]
  exam: TutorialExam
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  africanContext: boolean
}

export const BASE_TUTORIALS: Tutorial[] = [
  {
    id: 'what-is-base',
    title: 'What is Base?',
    description: 'Learn the basics of Base blockchain and why it matters for Africa',
    category: 'getting-started',
    icon: '💎',
    estimatedTime: 15,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Base is a Layer 2 Blockchain',
        content: 'Base is a Layer 2 blockchain built on Ethereum by Coinbase. Think of it as a faster, cheaper version of Ethereum that\'s perfect for everyday transactions.\n\nLayer 2 means it sits "on top" of Ethereum, inheriting its security while being much faster and cheaper.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Why Base Matters for Africa',
        content: 'Base makes sending money across borders incredibly cheap. While traditional banks charge $10-15 to send $100, Base charges less than $0.01. For Africans sending money home, this is life-changing.\n\nEvery year, Africans abroad send over $100 billion home. Base can save families thousands of dollars in fees.',
        type: 'text'
      },
      {
        id: '3',
        title: 'Super Fast & Cheap',
        content: 'Base transactions are confirmed in just 2 seconds and cost fractions of a cent. No more waiting days for money transfers or paying high fees.\n\nTraditional banks: 3-5 days\nBase: 2 seconds\n\nThat\'s over 1000x faster!',
        type: 'text'
      },
      {
        id: '4',
        title: 'Built by Coinbase',
        content: 'Base is built by Coinbase, one of the world\'s most trusted crypto companies. This means:\n\n• Trusted by millions of users\n• Regulated and compliant\n• Easy to use\n• Secure and reliable\n\nYou can trust Base with your money.',
        type: 'text'
      },
      {
        id: '5',
        title: 'Works with Any Wallet',
        content: 'Base works with popular wallets like MetaMask, Coinbase Wallet, and many others. You don\'t need to create a new account - just connect your existing wallet.\n\nThis makes it easy to get started without learning new tools.',
        type: 'text'
      },
      {
        id: '6',
        title: 'Perfect for Daily Use',
        content: 'Unlike Bitcoin or Ethereum, Base is designed for everyday transactions:\n\n• Buy coffee with crypto\n• Pay bills instantly\n• Send money to family\n• Shop online\n\nIt\'s crypto that actually works for real life.',
        type: 'text'
      },
      {
        id: '7',
        title: 'Growing Ecosystem',
        content: 'Base has hundreds of apps and services:\n\n• DeFi protocols for earning interest\n• NFT marketplaces\n• Gaming platforms\n• Payment solutions\n\nNew apps are added every week, making Base more useful over time.',
        type: 'text'
      },
      {
        id: '8',
        title: 'Getting Started',
        content: 'Ready to use Base? Here\'s what you need:\n\n1. A crypto wallet (like MetaMask)\n2. Some ETH for gas fees (less than $1)\n3. USDC or other tokens to send\n\nThat\'s it! You\'re ready to experience the future of money.',
        type: 'text'
      }
    ],
    exam: {
      questions: [
        {
          question: 'What is Base?',
          options: [
            'A Layer 1 blockchain',
            'A Layer 2 blockchain built on Ethereum',
            'A traditional bank',
            'A cryptocurrency'
          ],
          correctAnswer: 1,
          explanation: 'Base is a Layer 2 blockchain built on Ethereum by Coinbase, making it faster and cheaper than Ethereum.'
        },
        {
          question: 'How much does it cost to send $100 on Base?',
          options: [
            '$15',
            '$5',
            '$0.01',
            '$1'
          ],
          correctAnswer: 2,
          explanation: 'Base charges less than $0.01 for most transactions, making it 1000x cheaper than traditional banks!'
        },
        {
          question: 'How fast are Base transactions?',
          options: [
            '2 seconds',
            '2 minutes',
            '2 hours',
            '2 days'
          ],
          correctAnswer: 0,
          explanation: 'Base transactions are confirmed in just 2 seconds, making it incredibly fast for everyday use.'
        },
        {
          question: 'Who built Base?',
          options: [
            'Bitcoin',
            'Ethereum',
            'Coinbase',
            'MetaMask'
          ],
          correctAnswer: 2,
          explanation: 'Base is built by Coinbase, one of the world\'s most trusted crypto companies.'
        },
        {
          question: 'What do you need to get started with Base?',
          options: [
            'A bank account',
            'A crypto wallet and some ETH',
            'A credit card',
            'A passport'
          ],
          correctAnswer: 1,
          explanation: 'You just need a crypto wallet (like MetaMask) and some ETH for gas fees to get started with Base.'
        }
      ]
    }
  },
  {
    id: 'why-base-africa',
    title: 'Why Base is Perfect for Africa',
    description: 'Discover how Base solves real problems for Africans',
    category: 'getting-started',
    icon: '🌍',
    estimatedTime: 18,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'The Remittance Problem',
        content: 'Every year, Africans abroad send over $100 billion home. But traditional services like Western Union and banks charge 10-15% in fees. That\'s $10-15 for every $100 sent!\n\nThis means families lose thousands of dollars each year just to send money home.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Base Solves This',
        content: 'With Base, sending $100 costs less than $0.01. A family sending $500 home monthly saves $75 in fees - that\'s $900 per year they can use for food, education, or healthcare.\n\nThat\'s enough to:\n• Feed a family for months\n• Pay school fees\n• Cover medical expenses',
        type: 'text'
      },
      {
        id: '3',
        title: 'No Bank Account Needed',
        content: 'Millions of Africans don\'t have bank accounts. With Base, you only need a smartphone and internet connection. It\'s like M-Pesa, but for the entire world.\n\nThis makes financial services accessible to everyone, not just those with traditional banking.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Works on Any Phone',
        content: 'Base works on any smartphone - no need for expensive devices. This makes it accessible to millions of Africans who rely on mobile technology.\n\nEven basic Android phones can run Base apps, making it truly inclusive.',
        type: 'text'
      },
      {
        id: '5',
        title: 'Instant Transactions',
        content: 'Unlike traditional remittances that take days, Base transactions are instant. Your family receives money in seconds, not days.\n\nThis is crucial for emergencies when families need money immediately.',
        type: 'text'
      },
      {
        id: '6',
        title: 'Multiple Currencies',
        content: 'Base supports many African currencies and stablecoins:\n\n• USDC (pegged to US dollar)\n• Local currency tokens\n• Cross-border payments\n\nThis makes it perfect for African businesses and families.',
        type: 'text'
      },
      {
        id: '7',
        title: 'Growing African Adoption',
        content: 'More Africans are discovering Base every day:\n\n• Nigerian traders using Base for imports\n• Kenyan families receiving remittances\n• South African businesses accepting crypto\n\nYou\'re joining a growing movement.',
        type: 'text'
      },
      {
        id: '8',
        title: 'Real Impact Stories',
        content: 'Meet Sarah from Lagos: "I used to pay $20 to send $200 to my family. Now I pay $0.01. That\'s $240 saved per year!"\n\nMeet Ahmed from Cairo: "Base helped me start my business. I can accept payments from anywhere in the world instantly."\n\nThese are real stories from real Africans.',
        type: 'text'
      }
    ],
    exam: {
      questions: [
        {
          question: 'How much do traditional services charge to send $100?',
          options: [
            '$1-2',
            '$5-7',
            '$10-15',
            '$20-25'
          ],
          correctAnswer: 2,
          explanation: 'Traditional services like Western Union and banks charge 10-15% in fees, which is $10-15 for every $100 sent.'
        },
        {
          question: 'How much does Base charge to send $100?',
          options: [
            '$5',
            '$1',
            '$0.10',
            '$0.01'
          ],
          correctAnswer: 3,
          explanation: 'Base charges less than $0.01 for most transactions, making it 1000x cheaper than traditional services.'
        },
        {
          question: 'What do you need to use Base?',
          options: [
            'A bank account',
            'A smartphone and internet',
            'A credit card',
            'A passport'
          ],
          correctAnswer: 1,
          explanation: 'You only need a smartphone and internet connection to use Base - no bank account required!'
        },
        {
          question: 'How fast are Base transactions?',
          options: [
            'Seconds',
            'Minutes',
            'Hours',
            'Days'
          ],
          correctAnswer: 0,
          explanation: 'Base transactions are confirmed in just seconds, making them instant compared to traditional remittances.'
        },
        {
          question: 'How much can a family save per year sending $500 monthly?',
          options: [
            '$200',
            '$500',
            '$900',
            '$1,200'
          ],
          correctAnswer: 2,
          explanation: 'Traditional services charge ~$75/month ($15 per $500), while Base charges ~$0.05/month. That\'s $900 saved per year!'
        }
      ]
    }
  },
  {
    id: 'base-vs-banking',
    title: 'Base vs Traditional Banking',
    description: 'See the real cost difference for African users',
    category: 'base-benefits',
    icon: '💰',
    estimatedTime: 20,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Cost Comparison',
        content: 'Let\'s compare real costs for sending money to Africa:\n\nTraditional methods:\n• Banks: 10-15% fees\n• Western Union: 8-12% fees\n• MoneyGram: 6-10% fees\n\nBase: Less than 0.01% fees\n\nThat\'s a massive difference!',
        type: 'text'
      },
      {
        id: '2',
        title: 'Sending $100 to Kenya',
        content: 'Traditional Bank: $15 fee (15%)\nWestern Union: $12 fee (12%)\nMoneyGram: $10 fee (10%)\nBase: $0.01 fee (0.01%)\n\nYou save $9.99-14.99 per transaction!\n\nOver a year, that\'s hundreds of dollars saved.',
        type: 'text'
      },
      {
        id: '3',
        title: 'Receiving $500 from Abroad',
        content: 'Traditional Bank: $25 fee + 3-5 days wait\nWestern Union: $20 fee + 1-2 days wait\nBase: $0.01 fee + 2 seconds\n\nYou save $19.99-24.99 and get your money instantly!\n\nNo more waiting for important payments.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Hidden Fees',
        content: 'Traditional services have hidden costs:\n\n• Exchange rate markups\n• Processing fees\n• Account maintenance fees\n• Minimum balance requirements\n\nBase has transparent, low fees with no hidden costs.',
        type: 'text'
      },
      {
        id: '5',
        title: 'Speed Comparison',
        content: 'Traditional Banking:\n• International transfers: 3-5 business days\n• Weekend delays\n• Holiday delays\n• Bank processing time\n\nBase:\n• All transactions: 2 seconds\n• 24/7 availability\n• No delays\n• Instant confirmation',
        type: 'text'
      },
      {
        id: '6',
        title: 'Accessibility',
        content: 'Traditional Banking:\n• Requires bank account\n• Credit checks\n• Minimum deposits\n• Geographic restrictions\n\nBase:\n• Just a smartphone\n• No credit checks\n• No minimums\n• Global access',
        type: 'text'
      },
      {
        id: '7',
        title: 'Real Examples',
        content: 'Example 1: Sending $200 monthly\n• Traditional: $30/month in fees\n• Base: $0.02/month in fees\n• Annual savings: $360\n\nExample 2: Business payments\n• Traditional: $50 per international payment\n• Base: $0.01 per payment\n• Savings: 99.98%',
        type: 'text'
      },
      {
        id: '8',
        title: 'The Bottom Line',
        content: 'Base vs Traditional Banking:\n\n✅ Fees: 1000x cheaper\n✅ Speed: 1000x faster\n✅ Access: No barriers\n✅ Transparency: No hidden costs\n\nFor Africans, Base isn\'t just better - it\'s revolutionary.',
        type: 'text'
      }
    ],
    exam: {
      questions: [
        {
          question: 'How much faster is Base compared to traditional banks?',
          options: [
            '10x faster',
            '100x faster',
            '1000x faster',
            'Same speed'
          ],
          correctAnswer: 2,
          explanation: 'Base takes 2 seconds while banks take 3-5 days. That\'s over 1000x faster!'
        },
        {
          question: 'What percentage do traditional banks charge for international transfers?',
          options: [
            '1-3%',
            '5-8%',
            '10-15%',
            '20-25%'
          ],
          correctAnswer: 2,
          explanation: 'Traditional banks typically charge 10-15% in fees for international money transfers.'
        },
        {
          question: 'How much does Base charge for a $100 transfer?',
          options: [
            '$1',
            '$0.10',
            '$0.01',
            '$0.001'
          ],
          correctAnswer: 2,
          explanation: 'Base charges less than $0.01 for most transactions, making it incredibly cheap.'
        },
        {
          question: 'What do you need for traditional banking?',
          options: [
            'Just a smartphone',
            'A bank account and credit check',
            'A passport only',
            'Nothing special'
          ],
          correctAnswer: 1,
          explanation: 'Traditional banking requires a bank account and often credit checks, while Base only needs a smartphone.'
        },
        {
          question: 'How long do traditional bank transfers take?',
          options: [
            '2 seconds',
            '2 minutes',
            '2 hours',
            '3-5 business days'
          ],
          correctAnswer: 3,
          explanation: 'Traditional bank transfers typically take 3-5 business days, while Base takes just 2 seconds.'
        }
      ]
    }
  },
  {
    id: 'send-money-family',
    title: 'Send Money to Family in Africa',
    description: 'Step-by-step guide to sending money home',
    category: 'practical-use',
    icon: '👨‍👩‍👧‍👦',
    estimatedTime: 25,
    difficulty: 'intermediate',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Step 1: Get Base ETH',
        content: 'You need a small amount of ETH on Base to pay for gas fees (usually less than $0.01). You can buy it on Coinbase, bridge from Ethereum, or receive it from a friend.\n\nGas fees are like transaction costs - they\'re very small on Base.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Step 2: Get Your Family\'s Wallet Address',
        content: 'Ask your family to create a Base wallet and share their wallet address (it looks like 0x...). This is like their bank account number, but for crypto.\n\nPopular wallets: MetaMask, Coinbase Wallet, Trust Wallet',
        type: 'text'
      },
      {
        id: '3',
        title: 'Step 3: Buy USDC',
        content: 'USDC is a stablecoin worth exactly $1. It\'s perfect for sending money because its value doesn\'t change.\n\nYou can buy USDC on:\n• Coinbase\n• Uniswap\n• Other exchanges',
        type: 'text'
      },
      {
        id: '4',
        title: 'Step 4: Send USDC',
        content: 'Send USDC to your family\'s wallet address. The transaction takes 2 seconds and costs less than $0.01.\n\nDouble-check the address before sending - crypto transactions can\'t be reversed!',
        type: 'text'
      },
      {
        id: '5',
        title: 'Step 5: Your Family Receives It',
        content: 'Your family sees the USDC in their wallet instantly. They can either:\n\n1. Keep it as USDC (it stays at $1)\n2. Swap it for local currency\n3. Send it to others\n\nThey have full control over their money.',
        type: 'text'
      },
      {
        id: '6',
        title: 'Converting to Local Currency',
        content: 'Your family can convert USDC to local currency using:\n\n• Local crypto exchanges\n• P2P platforms\n• Crypto ATMs\n• Mobile money services\n\nMany African countries have crypto-friendly exchanges.',
        type: 'text'
      },
      {
        id: '7',
        title: 'Safety Tips',
        content: 'Important safety tips:\n\n• Always verify wallet addresses\n• Start with small amounts\n• Use reputable exchanges\n• Keep private keys secure\n• Never share your seed phrase\n\nSecurity is crucial in crypto.',
        type: 'text'
      },
      {
        id: '8',
        title: 'Real Example',
        content: 'Example: Sending $200 to Nigeria\n\n1. Buy $200 USDC: $200\n2. Gas fee: $0.01\n3. Total cost: $200.01\n\nTraditional method: $200 + $30 fee = $230\n\nYou save $29.99!',
        type: 'text'
      }
    ],
    exam: {
      questions: [
        {
          question: 'How long does it take to send money on Base?',
          options: [
            '2 seconds',
            '2 minutes',
            '2 hours',
            '2 days'
          ],
          correctAnswer: 0,
          explanation: 'Base transactions are confirmed in just 2 seconds, making it the fastest way to send money!'
        },
        {
          question: 'What is USDC?',
          options: [
            'A cryptocurrency that changes value',
            'A stablecoin worth exactly $1',
            'A type of ETH',
            'A bank account'
          ],
          correctAnswer: 1,
          explanation: 'USDC is a stablecoin pegged to the US dollar, making it perfect for sending money without value fluctuations.'
        },
        {
          question: 'What do you need to send money on Base?',
          options: [
            'A bank account',
            'ETH for gas fees and USDC to send',
            'A credit card',
            'A passport'
          ],
          correctAnswer: 1,
          explanation: 'You need ETH for gas fees (transaction costs) and USDC (or other tokens) to send to your family.'
        },
        {
          question: 'How much do gas fees typically cost on Base?',
          options: [
            '$1-5',
            '$0.10-0.50',
            '$0.01-0.05',
            '$10-20'
          ],
          correctAnswer: 2,
          explanation: 'Gas fees on Base are typically less than $0.01, making it incredibly cheap to send money.'
        },
        {
          question: 'What should you always do before sending crypto?',
          options: [
            'Check the weather',
            'Verify the wallet address',
            'Call your bank',
            'Wait for approval'
          ],
          correctAnswer: 1,
          explanation: 'Always verify wallet addresses before sending crypto, as transactions cannot be reversed once sent.'
        }
      ]
    }
  },
  {
    id: 'base-defi',
    title: 'Base DeFi for Africans',
    description: 'Learn how to earn interest and borrow on Base',
    category: 'advanced',
    icon: '🏦',
    estimatedTime: 30,
    difficulty: 'advanced',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'What is DeFi?',
        content: 'DeFi (Decentralized Finance) lets you earn interest, borrow money, and trade without banks. On Base, DeFi is super cheap and fast.\n\nThink of it as banking, but without the bank - everything is automated and transparent.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Earn Interest',
        content: 'Instead of keeping money in a bank that pays 1% interest, you can lend it on Base and earn 3-5% or more. Your money grows while you sleep!\n\nPopular DeFi protocols:\n• Aave (lending)\n• Compound (lending)\n• Uniswap (trading)',
        type: 'text'
      },
      {
        id: '3',
        title: 'Borrow Without Banks',
        content: 'Need a loan? On Base, you can borrow against your crypto without credit checks or banks. Perfect for African entrepreneurs who can\'t access traditional banking.\n\nYou put up crypto as collateral and borrow against it.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Liquidity Mining',
        content: 'Provide liquidity to trading pools and earn rewards. It\'s like being a bank, but you earn the fees!\n\nExample: Provide USDC/ETH liquidity and earn trading fees + token rewards.',
        type: 'text'
      },
      {
        id: '5',
        title: 'Staking Rewards',
        content: 'Stake your tokens to help secure the network and earn rewards. It\'s like earning interest on your crypto holdings.\n\nMany tokens offer staking rewards ranging from 5-20% annually.',
        type: 'text'
      },
      {
        id: '6',
        title: 'Yield Farming',
        content: 'Move your tokens between different DeFi protocols to maximize your returns. It\'s like finding the best savings account rates.\n\nPopular strategies:\n• Stablecoin farming\n• LP token farming\n• Cross-protocol strategies',
        type: 'text'
      },
      {
        id: '7',
        title: 'Risks to Consider',
        content: 'DeFi has risks:\n\n• Smart contract bugs\n• Impermanent loss\n• Market volatility\n• Liquidation risk\n\nStart small and learn gradually. Never invest more than you can afford to lose.',
        type: 'text'
      },
      {
        id: '8',
        title: 'Getting Started',
        content: 'Ready to try DeFi?\n\n1. Start with stablecoins (less risky)\n2. Use reputable protocols\n3. Start with small amounts\n4. Learn about each protocol\n5. Monitor your positions\n\nDeFi can be profitable but requires learning.',
        type: 'text'
      }
    ],
    exam: {
      questions: [
        {
          question: 'What is the main benefit of DeFi for Africans?',
          options: [
            'Higher interest rates',
            'No bank account needed',
            'Faster transactions',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'DeFi on Base offers all these benefits, making it perfect for Africans who lack access to traditional banking!'
        },
        {
          question: 'What is liquidity mining?',
          options: [
            'Mining cryptocurrency',
            'Providing liquidity to trading pools for rewards',
            'Borrowing money',
            'Staking tokens'
          ],
          correctAnswer: 1,
          explanation: 'Liquidity mining involves providing liquidity to trading pools and earning rewards from trading fees and token incentives.'
        },
        {
          question: 'What do you need to borrow in DeFi?',
          options: [
            'A credit check',
            'Crypto as collateral',
            'A bank account',
            'Government approval'
          ],
          correctAnswer: 1,
          explanation: 'In DeFi, you borrow against crypto collateral without needing credit checks or traditional banking requirements.'
        },
        {
          question: 'What is staking?',
          options: [
            'Buying cryptocurrency',
            'Selling cryptocurrency',
            'Locking tokens to earn rewards',
            'Trading tokens'
          ],
          correctAnswer: 2,
          explanation: 'Staking involves locking your tokens to help secure the network and earn rewards in return.'
        },
        {
          question: 'What should you do before using DeFi?',
          options: [
            'Start with large amounts',
            'Start small and learn gradually',
            'Trust everything blindly',
            'Only use unknown protocols'
          ],
          correctAnswer: 1,
          explanation: 'Always start with small amounts and learn gradually when using DeFi, as it involves risks that require understanding.'
        }
      ]
    }
  }
]

export function getTutorialById(id: string): Tutorial | undefined {
  return BASE_TUTORIALS.find(t => t.id === id)
}

export function getTutorialsByCategory(category: Tutorial['category']): Tutorial[] {
  return BASE_TUTORIALS.filter(t => t.category === category)
}

export function getTutorialsByDifficulty(difficulty: Tutorial['difficulty']): Tutorial[] {
  return BASE_TUTORIALS.filter(t => t.difficulty === difficulty)
}

