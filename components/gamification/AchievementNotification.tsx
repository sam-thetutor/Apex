'use client'

import { useState, useEffect } from 'react'
import { Achievement } from '@/lib/gamification/base-achievements'

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 shadow-2xl border-2 border-yellow-300 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg mb-1">
              🎉 Achievement Unlocked!
            </div>
            <div className="text-white font-semibold mb-1">
              {achievement.name}
            </div>
            <div className="text-yellow-100 text-sm mb-2">
              {achievement.description}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-yellow-200 text-sm font-medium">
                +{achievement.points} points
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-yellow-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AchievementNotificationManagerProps {
  achievements: string[]
  onAchievementsShown: () => void
}

export function AchievementNotificationManager({ 
  achievements, 
  onAchievementsShown 
}: AchievementNotificationManagerProps) {
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0)
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (achievements.length > 0 && !isShowing) {
      setIsShowing(true)
      setCurrentAchievementIndex(0)
    }
  }, [achievements, isShowing])

  const handleClose = () => {
    const nextIndex = currentAchievementIndex + 1
    if (nextIndex < achievements.length) {
      setCurrentAchievementIndex(nextIndex)
    } else {
      setIsShowing(false)
      onAchievementsShown()
    }
  }

  if (!isShowing || achievements.length === 0) {
    return null
  }

  // Get achievement details
  const achievementId = achievements[currentAchievementIndex]
  const achievement = {
    id: achievementId,
    name: achievementId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `You've unlocked the ${achievementId.replace(/-/g, ' ')} achievement!`,
    icon: '🏆',
    points: 100, // Default points, could be fetched from achievement data
  } as Achievement

  return (
    <AchievementNotification 
      achievement={achievement} 
      onClose={handleClose}
    />
  )
}
