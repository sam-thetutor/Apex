export interface AchievementRequirement {
  type: 'count' | 'amount' | 'streak' | 'custom'
  target: number
  metric: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'base-onboarding' | 'africa-focused' | 'transactions' | 'learning'
  requirement: AchievementRequirement
  africanTheme: boolean
  points: number
}

export const BASE_ACHIEVEMENTS: Achievement[] = [
  // Base Onboarding
  {
    id: 'base-pioneer',
    name: 'Base Pioneer',
    description: 'Create your first Base wallet',
    icon: '🎉',
    category: 'base-onboarding',
    requirement: { type: 'custom', target: 1, metric: 'wallet_created' },
    africanTheme: true,
    points: 100
  },
  {
    id: 'base-native',
    name: 'Base Native',
    description: 'Send your first transaction on Base',
    icon: '💎',
    category: 'base-onboarding',
    requirement: { type: 'count', target: 1, metric: 'transactions' },
    africanTheme: true,
    points: 150
  },
  {
    id: 'african-trailblazer',
    name: 'African Trailblazer',
    description: 'Complete your first Base tutorial',
    icon: '🌍',
    category: 'base-onboarding',
    requirement: { type: 'count', target: 1, metric: 'tutorials_completed' },
    africanTheme: true,
    points: 100
  },
  {
    id: 'base-scholar',
    name: 'Base Scholar',
    description: 'Complete all Base tutorials',
    icon: '📚',
    category: 'base-onboarding',
    requirement: { type: 'count', target: 5, metric: 'tutorials_completed' },
    africanTheme: true,
    points: 500
  },
  {
    id: 'base-expert',
    name: 'Base Expert',
    description: 'Score 100% on all quizzes',
    icon: '🔥',
    category: 'base-onboarding',
    requirement: { type: 'custom', target: 5, metric: 'perfect_quizzes' },
    africanTheme: true,
    points: 300
  },

  // Africa-Focused
  {
    id: 'cross-border-champion',
    name: 'Cross-Border Champion',
    description: 'Send money to 5 different African countries',
    icon: '💰',
    category: 'africa-focused',
    requirement: { type: 'count', target: 5, metric: 'countries_sent_to' },
    africanTheme: true,
    points: 400
  },
  {
    id: 'remittance-hero',
    name: 'Remittance Hero',
    description: 'Save $100+ in fees using Base',
    icon: '🌐',
    category: 'africa-focused',
    requirement: { type: 'amount', target: 100, metric: 'fees_saved' },
    africanTheme: true,
    points: 600
  },
  {
    id: 'african-connector',
    name: 'African Connector',
    description: 'Send to 10 different people in Africa',
    icon: '👥',
    category: 'africa-focused',
    requirement: { type: 'count', target: 10, metric: 'unique_recipients' },
    africanTheme: true,
    points: 500
  },
  {
    id: 'base-ambassador',
    name: 'Base Ambassador',
    description: 'Invite 5 friends to Base',
    icon: '🏆',
    category: 'africa-focused',
    requirement: { type: 'count', target: 5, metric: 'friends_invited' },
    africanTheme: true,
    points: 400
  },
  {
    id: 'african-innovator',
    name: 'African Innovator',
    description: 'Complete all Africa-focused tutorials',
    icon: '🌟',
    category: 'africa-focused',
    requirement: { type: 'count', target: 3, metric: 'africa_tutorials_completed' },
    africanTheme: true,
    points: 500
  },

  // Transactions
  {
    id: 'swap-master',
    name: 'Swap Master',
    description: 'Complete 10 swaps on Base',
    icon: '🔄',
    category: 'transactions',
    requirement: { type: 'count', target: 10, metric: 'swaps' },
    africanTheme: false,
    points: 300
  },
  {
    id: 'base-whale',
    name: 'Base Whale',
    description: 'Send $10,000+ on Base',
    icon: '💎',
    category: 'transactions',
    requirement: { type: 'amount', target: 10000, metric: 'total_sent' },
    africanTheme: false,
    points: 800
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 50 transactions',
    icon: '⚡',
    category: 'transactions',
    requirement: { type: 'count', target: 50, metric: 'transactions' },
    africanTheme: false,
    points: 500
  },
  {
    id: 'gas-saver',
    name: 'Gas Saver',
    description: 'Save $1,000+ in fees vs traditional',
    icon: '🎯',
    category: 'transactions',
    requirement: { type: 'amount', target: 1000, metric: 'fees_saved' },
    africanTheme: true,
    points: 1000
  },
  {
    id: 'base-power-user',
    name: 'Base Power User',
    description: '100 transactions in 30 days',
    icon: '🔥',
    category: 'transactions',
    requirement: { type: 'streak', target: 100, metric: 'transactions_30d' },
    africanTheme: false,
    points: 700
  },

  // Learning
  {
    id: 'base-basics',
    name: 'Base Basics',
    description: 'Complete "Getting Started" category',
    icon: '📖',
    category: 'learning',
    requirement: { type: 'count', target: 3, metric: 'getting_started_completed' },
    africanTheme: true,
    points: 200
  },
  {
    id: 'africa-expert',
    name: 'Africa Expert',
    description: 'Complete "Practical Use Cases" category',
    icon: '🌍',
    category: 'learning',
    requirement: { type: 'count', target: 2, metric: 'practical_use_completed' },
    africanTheme: true,
    points: 300
  },
  {
    id: 'base-builder',
    name: 'Base Builder',
    description: 'Complete "Advanced" category',
    icon: '🚀',
    category: 'learning',
    requirement: { type: 'count', target: 1, metric: 'advanced_completed' },
    africanTheme: true,
    points: 400
  },
  {
    id: 'base-guru',
    name: 'Base Guru',
    description: 'Complete all tutorials with 100% quiz scores',
    icon: '🏅',
    category: 'learning',
    requirement: { type: 'custom', target: 5, metric: 'perfect_tutorials' },
    africanTheme: true,
    points: 1000
  }
]

export function getAchievementById(id: string): Achievement | undefined {
  return BASE_ACHIEVEMENTS.find(a => a.id === id)
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return BASE_ACHIEVEMENTS.filter(a => a.category === category)
}

export function getAfricanAchievements(): Achievement[] {
  return BASE_ACHIEVEMENTS.filter(a => a.africanTheme)
}

