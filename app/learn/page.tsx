'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BASE_TUTORIALS, Tutorial } from '@/lib/education/base-tutorials'
import { TutorialCard } from '@/components/education/TutorialCard'
import { useWallet } from '@/contexts/WalletContext'

export default function LearnPage() {
  const router = useRouter()
  const { address } = useWallet()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'base-benefits', name: 'Base Benefits', icon: '💎' },
    { id: 'practical-use', name: 'Practical Use', icon: '👥' },
    { id: 'advanced', name: 'Advanced', icon: '🏆' },
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ]

  // Fetch completed tutorials
  useEffect(() => {
    const fetchCompletedTutorials = async () => {
      if (!address) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/achievements?userAddress=${address}`)
        const result = await response.json()

        if (result.success) {
          setCompletedTutorials(result.data.progress.tutorialsCompleted || [])
        }
      } catch (error) {
        console.error('Error fetching completed tutorials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompletedTutorials()
  }, [address])

  const filteredTutorials = BASE_TUTORIALS.filter(tutorial => {
    const categoryMatch = selectedCategory === 'all' || tutorial.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Learn Base for Africa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Master Base blockchain and revolutionize how you send money, run businesses, and build the future of Africa
          </p>
        </div> */}

        {/* Category Filter */}
        {/* <div className="flex flex-wrap gap-3 mb-8 justify-center">
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
        </div> */}

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {difficulties.map(difficulty => (
            <button
              key={difficulty.id}
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                selectedDifficulty === difficulty.id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {difficulty.name}
            </button>
          ))}
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(tutorial => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              onClick={() => router.push(`/learn/${tutorial.id}`)}
              isCompleted={completedTutorials.includes(tutorial.id)}
            />
          ))}
        </div>

        {/* Stats */}
        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              {BASE_TUTORIALS.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Tutorials Available</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {BASE_TUTORIALS.filter(t => t.africanContext).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">African-Focused</div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {BASE_TUTORIALS.reduce((acc, t) => acc + t.estimatedTime, 0)} min
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Learning Time</div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

