'use client'

import { useState, useEffect } from 'react'
import { BASE_ACHIEVEMENTS, Achievement } from '@/lib/gamification/base-achievements'
import { AchievementBadge } from '@/components/gamification/AchievementBadge'
import { useWallet } from '@/contexts/WalletContext'

export default function AchievementsPage() {
  const { address } = useWallet()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [userAchievements, setUserAchievements] = useState<string[]>([])
  const [totalPoints, setTotalPoints] = useState<number>(0)
  const [progress, setProgress] = useState<{ [achievementId: string]: number }>({})
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'All Achievements', icon: '🏆' },
    { id: 'base-onboarding', name: 'Base Onboarding', icon: '🚀' },
    { id: 'africa-focused', name: 'Africa Focused', icon: '🌍' },
    { id: 'transactions', name: 'Transactions', icon: '💎' },
    { id: 'learning', name: 'Learning', icon: '📚' },
  ]

  // Fetch user achievements from API
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!address) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/achievements?userAddress=${address}`)
        const result = await response.json()

        if (result.success) {
          setUserAchievements(result.data.achievements.unlocked)
          setTotalPoints(result.data.achievements.totalPoints)
          setProgress(result.data.achievements.progress)
        }
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAchievements()
  }, [address])

  const filteredAchievements = BASE_ACHIEVEMENTS.filter(achievement => {
    return selectedCategory === 'all' || achievement.category === selectedCategory
  })

  const unlockedCount = userAchievements.length
  const africanAchievementsUnlocked = BASE_ACHIEVEMENTS
    .filter(a => a.africanTheme && userAchievements.includes(a.id))
    .length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your achievements...</p>
        </div>
      </div>
    )
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Connect your wallet to view your achievements and progress
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Achievements
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Track your progress as you master Base blockchain for Africa
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              {unlockedCount}/{BASE_ACHIEVEMENTS.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Achievements Unlocked</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {totalPoints}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {africanAchievementsUnlocked}
            </div>
            <div className="text-gray-600 dark:text-gray-400">African Achievements</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAchievements.map(achievement => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              isUnlocked={userAchievements.includes(achievement.id)}
              progress={progress[achievement.id] || 0}
            />
          ))}
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🌍 African Leaderboard
          </h2>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Alice K.', country: '🇰🇪 Kenya', points: 2500 },
              { rank: 2, name: 'Bob M.', country: '🇺🇬 Uganda', points: 2200 },
              { rank: 3, name: 'Charlie N.', country: '🇹🇿 Tanzania', points: 2000 },
              { rank: 4, name: 'Diana A.', country: '🇳🇬 Nigeria', points: 1800 },
              { rank: 5, name: 'You', country: '🌍', points: totalPoints },
            ].map(user => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  user.rank === 5
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-500'
                    : 'bg-gray-100 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    user.rank === 1 ? 'bg-yellow-400 text-gray-900' :
                    user.rank === 2 ? 'bg-gray-300 text-gray-900' :
                    user.rank === 3 ? 'bg-orange-400 text-gray-900' :
                    'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {user.country}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-cyan-600 dark:text-cyan-400">
                  {user.points.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

