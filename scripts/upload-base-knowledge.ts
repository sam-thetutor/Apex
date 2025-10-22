import { config } from 'dotenv'
import { pineconeKnowledgeService } from '@/lib/vector/pinecone-knowledge'
import { getAllBaseKnowledgeDocuments } from '@/lib/ai/base-knowledge-data'

// Load environment variables
config({ path: '.env.local' })

async function uploadBaseKnowledge() {
  console.log('🚀 Starting Base knowledge upload to Pinecone...')
  console.log('🔑 Environment check:')
  console.log(`   PINECONE_API_KEY: ${process.env.PINECONE_API_KEY ? 'Set' : 'Not set'}`)
  console.log(`   PINECONE_INDEX_NAME: ${process.env.PINECONE_INDEX_NAME || 'base-knowledge'}`)
  console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? 'Set' : 'Not set'}`)
  
  try {
    // Initialize Pinecone service
    console.log('📡 Initializing Pinecone service...')
    await pineconeKnowledgeService.initialize()
    console.log('✅ Pinecone service initialized')
    
    // Get all knowledge documents
    const knowledgeDocuments = getAllBaseKnowledgeDocuments()
    console.log(`📚 Found ${knowledgeDocuments.length} knowledge documents to upload`)
    
    // Upload each document
    let successCount = 0
    let errorCount = 0
    
    for (const doc of knowledgeDocuments) {
      try {
        await pineconeKnowledgeService.addDocument(doc)
        successCount++
        console.log(`✅ Uploaded: ${doc.title} (${doc.category})`)
      } catch (error) {
        errorCount++
        console.error(`❌ Failed to upload ${doc.title}:`, error)
      }
    }
    
    console.log(`\n📊 Upload Summary:`)
    console.log(`✅ Successfully uploaded: ${successCount} documents`)
    console.log(`❌ Failed uploads: ${errorCount} documents`)
    console.log(`📈 Success rate: ${((successCount / knowledgeDocuments.length) * 100).toFixed(1)}%`)
    
    // Get knowledge stats
    const stats = await pineconeKnowledgeService.getKnowledgeStats()
    console.log(`\n📊 Vector Index Stats:`)
    console.log(`📚 Total documents: ${stats.totalDocuments}`)
    console.log(`🏷️ Categories: ${stats.categories.join(', ')}`)
    console.log(`📅 Last updated: ${stats.lastUpdated}`)
    
    // Test search functionality
    console.log('\n🧪 Testing search functionality...')
    const testQueries = [
      'what is base',
      'base fees',
      'defi on base',
      'how to send tokens'
    ]
    
    for (const query of testQueries) {
      try {
        const results = await pineconeKnowledgeService.searchSimilar(query, 2)
        console.log(`🔍 "${query}" → Found ${results.length} results`)
        if (results.length > 0) {
          console.log(`   Top result: ${results[0].title}`)
        }
      } catch (error) {
        console.error(`❌ Search error for "${query}":`, error)
      }
    }
    
    console.log('\n🎉 Base knowledge upload completed successfully!')
    return {
      success: true,
      uploaded: successCount,
      failed: errorCount,
      total: knowledgeDocuments.length,
      stats
    }
    
  } catch (error) {
    console.error('❌ Error uploading Base knowledge:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Run the upload
uploadBaseKnowledge()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ Upload completed successfully!')
      process.exit(0)
    } else {
      console.error('\n❌ Upload failed:', result.error)
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error)
    process.exit(1)
  })
