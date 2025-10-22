import { pineconeKnowledgeService } from '@/lib/vector/pinecone-knowledge'
import { getAllBaseKnowledgeDocuments } from '@/lib/ai/base-knowledge-data'

export async function uploadBaseKnowledgeToVectorIndex() {
  console.log('🚀 Starting Base knowledge upload to Pinecone...')
  
  try {
    // Initialize Pinecone service
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

export async function testBaseKnowledgeSearch() {
  console.log('🧪 Testing Base knowledge search...')
  
  const testQueries = [
    'what is base',
    'how does base work',
    'base fees',
    'defi on base',
    'how to send tokens',
    'base security',
    'base vs ethereum',
    'development on base'
  ]
  
  for (const query of testQueries) {
    try {
      const results = await pineconeKnowledgeService.searchSimilar(query, 3)
      console.log(`\n🔍 Query: "${query}"`)
      console.log(`📚 Found ${results.length} results:`)
      
      results.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.title} (${result.category})`)
        console.log(`     ${result.content.substring(0, 100)}...`)
      })
    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error)
    }
  }
}

// Function to clear existing knowledge (use with caution)
export async function clearBaseKnowledge() {
  console.log('⚠️ Clearing all Base knowledge from vector index...')
  
  try {
    const allDocs = await pineconeKnowledgeService.getAllDocuments()
    console.log(`Found ${allDocs.length} documents to delete`)
    
    for (const doc of allDocs) {
      await pineconeKnowledgeService.deleteDocument(doc.id)
      console.log(`🗑️ Deleted: ${doc.title}`)
    }
    
    console.log('✅ All Base knowledge cleared from vector index')
    return { success: true, deleted: allDocs.length }
  } catch (error) {
    console.error('❌ Error clearing Base knowledge:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
