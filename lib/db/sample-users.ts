import clientPromise from './mongodb'

const DATABASE_NAME = 'apex'
const USER_PROGRESS_COLLECTION = 'user_progress'

// Sample users for testing the leaderboard
const sampleUsers = [
  {
    userAddress: '0x1234567890123456789012345678901234567890',
    tutorialsCompleted: ['what-is-base', 'why-base-africa', 'base-vs-banking', 'send-money-family', 'base-defi'],
    quizScores: { 'what-is-base': 100, 'why-base-africa': 100, 'base-vs-banking': 100, 'send-money-family': 100, 'base-defi': 100 },
    achievementsUnlocked: ['african-trailblazer', 'base-scholar', 'base-expert', 'base-basics', 'africa-expert', 'base-builder', 'base-guru'],
    totalPoints: 2500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userAddress: '0x2345678901234567890123456789012345678901',
    tutorialsCompleted: ['what-is-base', 'why-base-africa', 'base-vs-banking', 'send-money-family'],
    quizScores: { 'what-is-base': 100, 'why-base-africa': 100, 'base-vs-banking': 100, 'send-money-family': 100 },
    achievementsUnlocked: ['african-trailblazer', 'base-scholar', 'base-basics', 'africa-expert'],
    totalPoints: 2200,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userAddress: '0x3456789012345678901234567890123456789012',
    tutorialsCompleted: ['what-is-base', 'why-base-africa', 'base-vs-banking'],
    quizScores: { 'what-is-base': 100, 'why-base-africa': 100, 'base-vs-banking': 100 },
    achievementsUnlocked: ['african-trailblazer', 'base-scholar', 'base-basics'],
    totalPoints: 2000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userAddress: '0x4567890123456789012345678901234567890123',
    tutorialsCompleted: ['what-is-base', 'why-base-africa'],
    quizScores: { 'what-is-base': 100, 'why-base-africa': 100 },
    achievementsUnlocked: ['african-trailblazer', 'base-scholar'],
    totalPoints: 1800,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userAddress: '0x5678901234567890123456789012345678901234',
    tutorialsCompleted: ['what-is-base'],
    quizScores: { 'what-is-base': 100 },
    achievementsUnlocked: ['african-trailblazer'],
    totalPoints: 1500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function addSampleUsers() {
  try {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    const collection = db.collection(USER_PROGRESS_COLLECTION)

    // Clear existing sample users first
    await collection.deleteMany({
      userAddress: { $in: sampleUsers.map(u => u.userAddress) }
    })

    // Insert sample users
    await collection.insertMany(sampleUsers)
    
    console.log('Sample users added to leaderboard')
    return { success: true, count: sampleUsers.length }
  } catch (error) {
    console.error('Error adding sample users:', error)
    return { success: false, error: error.message }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  addSampleUsers().then(result => {
    console.log('Result:', result)
    process.exit(0)
  })
}
