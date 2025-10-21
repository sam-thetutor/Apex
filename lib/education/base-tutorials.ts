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

export interface Tutorial {
  id: string
  title: string
  description: string
  category: 'getting-started' | 'base-benefits' | 'practical-use' | 'advanced'
  steps: TutorialStep[]
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
    estimatedTime: 5,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Base is a Layer 2 Blockchain',
        content: 'Base is a Layer 2 blockchain built on Ethereum by Coinbase. Think of it as a faster, cheaper version of Ethereum that\'s perfect for everyday transactions.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Why Base Matters for Africa',
        content: 'Base makes sending money across borders incredibly cheap. While traditional banks charge $10-15 to send $100, Base charges less than $0.01. For Africans sending money home, this is life-changing.',
        type: 'text'
      },
      {
        id: '3',
        title: 'Super Fast & Cheap',
        content: 'Base transactions are confirmed in just 2 seconds and cost fractions of a cent. No more waiting days for money transfers or paying high fees.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Quick Quiz',
        content: 'Test your knowledge',
        type: 'quiz',
        quizQuestion: {
          question: 'How much does it cost to send $100 on Base?',
          options: ['$15', '$5', '$0.01', '$1'],
          correctAnswer: 2,
          explanation: 'Base charges less than $0.01 for most transactions, making it 1000x cheaper than traditional banks!'
        }
      }
    ]
  },
  {
    id: 'why-base-africa',
    title: 'Why Base is Perfect for Africa',
    description: 'Discover how Base solves real problems for Africans',
    category: 'getting-started',
    icon: '🌍',
    estimatedTime: 7,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'The Remittance Problem',
        content: 'Every year, Africans abroad send over $100 billion home. But traditional services like Western Union and banks charge 10-15% in fees. That\'s $10-15 for every $100 sent!',
        type: 'text'
      },
      {
        id: '2',
        title: 'Base Solves This',
        content: 'With Base, sending $100 costs less than $0.01. A family sending $500 home monthly saves $75 in fees - that\'s $900 per year they can use for food, education, or healthcare.',
        type: 'text'
      },
      {
        id: '3',
        title: 'No Bank Account Needed',
        content: 'Millions of Africans don\'t have bank accounts. With Base, you only need a smartphone and internet connection. It\'s like M-Pesa, but for the entire world.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Works on Any Phone',
        content: 'Base works on any smartphone - no need for expensive devices. This makes it accessible to millions of Africans who rely on mobile technology.',
        type: 'text'
      },
      {
        id: '5',
        title: 'Quick Quiz',
        content: 'Test your knowledge',
        type: 'quiz',
        quizQuestion: {
          question: 'How much does a family save per year if they send $500 monthly on Base vs traditional services?',
          options: ['$50', '$900', '$200', '$1,200'],
          correctAnswer: 1,
          explanation: 'Traditional services charge ~$75/month ($15 per $500), while Base charges ~$0.05/month. That\'s $900 saved per year!'
        }
      }
    ]
  },
  {
    id: 'base-vs-banking',
    title: 'Base vs Traditional Banking',
    description: 'See the real cost difference for African users',
    category: 'base-benefits',
    icon: '💰',
    estimatedTime: 6,
    difficulty: 'beginner',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Cost Comparison',
        content: 'Let\'s compare real costs for sending money to Africa:',
        type: 'text'
      },
      {
        id: '2',
        title: 'Sending $100 to Kenya',
        content: 'Traditional Bank: $15 fee (15%)\nWestern Union: $12 fee (12%)\nMoneyGram: $10 fee (10%)\nBase: $0.01 fee (0.01%)\n\nYou save $9.99-14.99 per transaction!',
        type: 'text'
      },
      {
        id: '3',
        title: 'Receiving $500 from Abroad',
        content: 'Traditional Bank: $25 fee + 3-5 days wait\nWestern Union: $20 fee + 1-2 days wait\nBase: $0.01 fee + 2 seconds\n\nYou save $19.99-24.99 and get your money instantly!',
        type: 'text'
      },
      {
        id: '4',
        title: 'Quick Quiz',
        content: 'Test your knowledge',
        type: 'quiz',
        quizQuestion: {
          question: 'How much faster is Base compared to traditional banks for money transfers?',
          options: ['10x faster', '100x faster', '1000x faster', 'Same speed'],
          correctAnswer: 2,
          explanation: 'Base takes 2 seconds while banks take 3-5 days. That\'s over 1000x faster!'
        }
      }
    ]
  },
  {
    id: 'send-money-family',
    title: 'Send Money to Family in Africa',
    description: 'Step-by-step guide to sending money home',
    category: 'practical-use',
    icon: '👨‍👩‍👧‍👦',
    estimatedTime: 8,
    difficulty: 'intermediate',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'Step 1: Get Base ETH',
        content: 'You need a small amount of ETH on Base to pay for gas fees (usually less than $0.01). You can buy it on Coinbase, bridge from Ethereum, or receive it from a friend.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Step 2: Get Your Family\'s Wallet Address',
        content: 'Ask your family to create a Base wallet and share their wallet address (it looks like 0x...). This is like their bank account number, but for crypto.',
        type: 'text'
      },
      {
        id: '3',
        title: 'Step 3: Send USDC',
        content: 'Buy USDC on Base (it\'s a stablecoin worth exactly $1). Then send it to your family\'s wallet address. The transaction takes 2 seconds and costs less than $0.01.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Step 4: Your Family Receives It',
        content: 'Your family sees the USDC in their wallet instantly. They can either:\n1. Keep it as USDC (it stays at $1)\n2. Swap it for local currency\n3. Send it to others',
        type: 'text'
      },
      {
        id: '5',
        title: 'Quick Quiz',
        content: 'Test your knowledge',
        type: 'quiz',
        quizQuestion: {
          question: 'How long does it take to send money on Base?',
          options: ['2 seconds', '2 minutes', '2 hours', '2 days'],
          correctAnswer: 0,
          explanation: 'Base transactions are confirmed in just 2 seconds, making it the fastest way to send money!'
        }
      }
    ]
  },
  {
    id: 'base-defi',
    title: 'Base DeFi for Africans',
    description: 'Learn how to earn interest and borrow on Base',
    category: 'advanced',
    icon: '🏦',
    estimatedTime: 10,
    difficulty: 'advanced',
    africanContext: true,
    steps: [
      {
        id: '1',
        title: 'What is DeFi?',
        content: 'DeFi (Decentralized Finance) lets you earn interest, borrow money, and trade without banks. On Base, DeFi is super cheap and fast.',
        type: 'text'
      },
      {
        id: '2',
        title: 'Earn Interest',
        content: 'Instead of keeping money in a bank that pays 1% interest, you can lend it on Base and earn 3-5% or more. Your money grows while you sleep!',
        type: 'text'
      },
      {
        id: '3',
        title: 'Borrow Without Banks',
        content: 'Need a loan? On Base, you can borrow against your crypto without credit checks or banks. Perfect for African entrepreneurs who can\'t access traditional banking.',
        type: 'text'
      },
      {
        id: '4',
        title: 'Quick Quiz',
        content: 'Test your knowledge',
        type: 'quiz',
        quizQuestion: {
          question: 'What is the main benefit of DeFi for Africans?',
          options: ['Higher interest rates', 'No bank account needed', 'Faster transactions', 'All of the above'],
          correctAnswer: 3,
          explanation: 'DeFi on Base offers all these benefits, making it perfect for Africans who lack access to traditional banking!'
        }
      }
    ]
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

