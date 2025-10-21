import clientPromise from './mongodb'

const DATABASE_NAME = 'apex'
const USER_PROGRESS_COLLECTION = 'user_progress'

export interface UserProgress {
  userAddress: string
  tutorialsCompleted: string[] // tutorial IDs
  quizScores: { [tutorialId: string]: number } // percentage scores
  achievementsUnlocked: string[] // achievement IDs
  totalPoints: number
  createdAt: Date
  updatedAt: Date
}

export interface TutorialCompletion {
  tutorialId: string
  completedAt: Date
  quizScore: number // percentage (0-100)
  pointsEarned: number
}

export interface AchievementUnlock {
  achievementId: string
  unlockedAt: Date
  pointsEarned: number
}

/**
 * Get user progress, initialize if first time
 */
export async function getUserProgress(userAddress: string): Promise<UserProgress> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserProgress>(USER_PROGRESS_COLLECTION)

    // Check if user exists
    const userData = await collection.findOne({ userAddress })

    if (!userData) {
      // First time user - initialize with empty progress
      const newUserData: UserProgress = {
        userAddress,
        tutorialsCompleted: [],
        quizScores: {},
        achievementsUnlocked: [],
        totalPoints: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await collection.insertOne(newUserData)
      return newUserData
    }

    return userData
  } catch (error) {
    console.error('Error getting user progress:', error)
    // Return empty progress on error
    return {
      userAddress,
      tutorialsCompleted: [],
      quizScores: {},
      achievementsUnlocked: [],
      totalPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

/**
 * Complete a tutorial and award points
 */
export async function completeTutorial(
  userAddress: string,
  tutorialId: string,
  quizScore: number = 100
): Promise<{ success: boolean; pointsEarned: number; achievementsUnlocked: string[] }> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserProgress>(USER_PROGRESS_COLLECTION)

    // Get current progress
    const userProgress = await getUserProgress(userAddress)
    
    // Check if tutorial already completed
    if (userProgress.tutorialsCompleted.includes(tutorialId)) {
      return { success: false, pointsEarned: 0, achievementsUnlocked: [] }
    }

    // Calculate points based on tutorial difficulty and quiz score
    const pointsEarned = calculateTutorialPoints(tutorialId, quizScore)
    
    // Update progress
    const updatedProgress: Partial<UserProgress> = {
      tutorialsCompleted: [...userProgress.tutorialsCompleted, tutorialId],
      quizScores: { ...userProgress.quizScores, [tutorialId]: quizScore },
      totalPoints: userProgress.totalPoints + pointsEarned,
      updatedAt: new Date(),
    }

    await collection.updateOne(
      { userAddress },
      { $set: updatedProgress }
    )

    // Check for new achievements
    const achievementsUnlocked = await checkAndUnlockAchievements(userAddress, updatedProgress)

    return { success: true, pointsEarned, achievementsUnlocked }
  } catch (error) {
    console.error('Error completing tutorial:', error)
    return { success: false, pointsEarned: 0, achievementsUnlocked: [] }
  }
}

/**
 * Calculate points for tutorial completion
 */
function calculateTutorialPoints(tutorialId: string, quizScore: number): number {
  // Base points by tutorial difficulty
  const basePoints: { [key: string]: number } = {
    'what-is-base': 100,
    'why-base-africa': 100,
    'base-vs-banking': 100,
    'send-money-family': 150,
    'base-defi': 200,
  }

  const base = basePoints[tutorialId] || 100
  
  // Bonus for perfect quiz score
  const quizBonus = quizScore === 100 ? Math.floor(base * 0.2) : 0
  
  return base + quizBonus
}

/**
 * Check and unlock achievements based on current progress
 */
async function checkAndUnlockAchievements(
  userAddress: string,
  updatedProgress: Partial<UserProgress>
): Promise<string[]> {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection<UserProgress>(USER_PROGRESS_COLLECTION)

    // Get full updated progress
    const fullProgress = await getUserProgress(userAddress)
    const newAchievements: string[] = []

    // Check each achievement requirement
    const achievements = [
      // Tutorial completion achievements
      {
        id: 'african-trailblazer',
        check: () => fullProgress.tutorialsCompleted.length >= 1,
      },
      {
        id: 'base-scholar',
        check: () => fullProgress.tutorialsCompleted.length >= 5,
      },
      {
        id: 'base-expert',
        check: () => {
          const scores = Object.values(fullProgress.quizScores)
          return scores.length >= 5 && scores.every(score => score === 100)
        },
      },
      {
        id: 'base-basics',
        check: () => {
          const gettingStartedTutorials = ['what-is-base', 'why-base-africa', 'base-vs-banking']
          return gettingStartedTutorials.every(id => fullProgress.tutorialsCompleted.includes(id))
        },
      },
      {
        id: 'africa-expert',
        check: () => {
          const practicalTutorials = ['send-money-family']
          return practicalTutorials.every(id => fullProgress.tutorialsCompleted.includes(id))
        },
      },
      {
        id: 'base-builder',
        check: () => {
          const advancedTutorials = ['base-defi']
          return advancedTutorials.every(id => fullProgress.tutorialsCompleted.includes(id))
        },
      },
      {
        id: 'base-guru',
        check: () => {
          const scores = Object.values(fullProgress.quizScores)
          return scores.length >= 5 && scores.every(score => score === 100)
        },
      },
    ]

    // Check each achievement
    for (const achievement of achievements) {
      if (!fullProgress.achievementsUnlocked.includes(achievement.id) && achievement.check()) {
        newAchievements.push(achievement.id)
      }
    }

    // Update achievements if any new ones unlocked
    if (newAchievements.length > 0) {
      const achievementPoints = newAchievements.reduce((total, id) => {
        // Get points from achievement definition
        const pointsMap: { [key: string]: number } = {
          'african-trailblazer': 100,
          'base-scholar': 500,
          'base-expert': 300,
          'base-basics': 200,
          'africa-expert': 300,
          'base-builder': 400,
          'base-guru': 1000,
        }
        return total + (pointsMap[id] || 0)
      }, 0)

      await collection.updateOne(
        { userAddress },
        { 
          $set: { 
            achievementsUnlocked: [...fullProgress.achievementsUnlocked, ...newAchievements],
            totalPoints: fullProgress.totalPoints + achievementPoints,
            updatedAt: new Date(),
          }
        }
      )
    }

    return newAchievements
  } catch (error) {
    console.error('Error checking achievements:', error)
    return []
  }
}

/**
 * Get user's unlocked achievements with details
 */
export async function getUserAchievements(userAddress: string): Promise<{
  unlocked: string[]
  totalPoints: number
  progress: { [achievementId: string]: number }
}> {
  try {
    const userProgress = await getUserProgress(userAddress)
    
    // Calculate progress for each achievement
    const progress: { [achievementId: string]: number } = {}
    
    // Tutorial completion progress
    progress['african-trailblazer'] = Math.min(userProgress.tutorialsCompleted.length, 1)
    progress['base-scholar'] = Math.min(userProgress.tutorialsCompleted.length, 5)
    
    // Quiz score progress
    const perfectQuizzes = Object.values(userProgress.quizScores).filter(score => score === 100).length
    progress['base-expert'] = Math.min(perfectQuizzes, 5)
    progress['base-guru'] = Math.min(perfectQuizzes, 5)
    
    // Category completion progress
    const gettingStartedTutorials = ['what-is-base', 'why-base-africa', 'base-vs-banking']
    const completedGettingStarted = gettingStartedTutorials.filter(id => 
      userProgress.tutorialsCompleted.includes(id)
    ).length
    progress['base-basics'] = completedGettingStarted
    
    const practicalTutorials = ['send-money-family']
    const completedPractical = practicalTutorials.filter(id => 
      userProgress.tutorialsCompleted.includes(id)
    ).length
    progress['africa-expert'] = completedPractical
    
    const advancedTutorials = ['base-defi']
    const completedAdvanced = advancedTutorials.filter(id => 
      userProgress.tutorialsCompleted.includes(id)
    ).length
    progress['base-builder'] = completedAdvanced

    return {
      unlocked: userProgress.achievementsUnlocked,
      totalPoints: userProgress.totalPoints,
      progress,
    }
  } catch (error) {
    console.error('Error getting user achievements:', error)
    return {
      unlocked: [],
      totalPoints: 0,
      progress: {},
    }
  }
}
