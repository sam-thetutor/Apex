'use client'

import { Achievement } from '@/lib/gamification/base-achievements'

interface AchievementBadgeProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  onClick?: () => void
}

export function AchievementBadge({ achievement, isUnlocked, progress, onClick }: AchievementBadgeProps) {
  const progressPercentage = progress ? (progress / achievement.requirement.target) * 100 : 0

  return (
    <div
      onClick={onClick}
      className={`relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border-2 p-4 cursor-pointer hover:scale-105 transition-all shadow-lg ${
        isUnlocked
          ? 'border-yellow-400 dark:border-yellow-500'
          : 'border-gray-300 dark:border-gray-600 opacity-60'
      }`}
    >
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full p-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <div className="text-4xl mb-2">{achievement.icon}</div>
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
        {achievement.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
        {achievement.description}
      </p>
      
      {!isUnlocked && progress !== undefined && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}/{achievement.requirement.target}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-xs px-2 py-1 rounded-full ${
          achievement.category === 'base-onboarding' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
          achievement.category === 'africa-focused' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
          achievement.category === 'transactions' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
        }`}>
          {achievement.category.replace('-', ' ')}
        </span>
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          {achievement.points} pts
        </span>
      </div>
    </div>
  )
}

