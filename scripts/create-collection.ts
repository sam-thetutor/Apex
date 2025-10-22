import clientPromise from '../lib/db/mongodb'

async function createBaseKnowledgeCollection() {
  try {
    const client = await clientPromise
    const db = client.db('apex')
    
    // Create the collection
    const collection = db.collection('base_knowledge')
    
    // Insert a dummy document to ensure collection exists
    await collection.insertOne({
      content: 'Dummy document to create collection',
      embedding: [],
      source: 'system',
      category: 'system',
      url: '',
      title: 'Collection Initializer',
      createdAt: new Date(),
      lastUpdated: new Date()
    })
    
    console.log('✅ base_knowledge collection created successfully!')
    
    // Remove the dummy document
    await collection.deleteOne({ source: 'system' })
    console.log('✅ Dummy document removed')
    
    return true
  } catch (error) {
    console.error('❌ Error creating collection:', error)
    return false
  }
}

// Run if called directly
if (require.main === module) {
  createBaseKnowledgeCollection()
    .then((success) => {
      if (success) {
        console.log('🎉 Collection setup complete!')
        console.log('📝 Next steps:')
        console.log('1. Go to MongoDB Atlas Dashboard')
        console.log('2. Navigate to Search tab')
        console.log('3. Create vector search index for base_knowledge collection')
        process.exit(0)
      } else {
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('Setup failed:', error)
      process.exit(1)
    })
}

export { createBaseKnowledgeCollection }
