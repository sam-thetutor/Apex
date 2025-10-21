'use client'

import { Tutorial } from '@/lib/education/base-tutorials'

interface TutorialCardProps {
  tutorial: Tutorial
  onClick: () => void
  isCompleted?: boolean
}

export function TutorialCard({ tutorial, onClick, isCompleted }: TutorialCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/40 p-6 cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{tutorial.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {tutorial.title}
            </h3>
            {isCompleted && (
              <span className="text-green-500 text-xl">✓</span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {tutorial.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tutorial.estimatedTime} min
            </span>
            <span className={`px-2 py-1 rounded-full ${
              tutorial.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {tutorial.difficulty}
            </span>
            
          </div>
        </div>
      </div>
    </div>
  )
}

