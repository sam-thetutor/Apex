import { config } from 'dotenv'
import { Pinecone } from '@pinecone-database/pinecone'

// Load environment variables
config({ path: '.env.local' })

async function diagnosePinecone() {
  console.log('🔍 Diagnosing Pinecone configuration...')
  console.log(`API Key: ${process.env.PINECONE_API_KEY?.substring(0, 10)}...`)
  console.log(`Index Name: ${process.env.PINECONE_INDEX_NAME}`)
  
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    })
    
    console.log('📡 Testing Pinecone connection...')
    const indexList = await pinecone.listIndexes()
    console.log('✅ Successfully connected to Pinecone!')
    console.log(`📊 Found ${indexList.indexes?.length || 0} indexes:`)
    
    if (indexList.indexes) {
      indexList.indexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${index.name}`)
        console.log(`     Dimension: ${index.dimension}`)
        console.log(`     Metric: ${index.metric}`)
        console.log(`     Status: ${index.status?.ready ? 'Ready' : 'Not Ready'}`)
        console.log(`     Host: ${index.host}`)
        console.log(`     Spec: ${JSON.stringify(index.spec)}`)
      })
    }
    
    // Check if our target index exists
    const targetIndex = indexList.indexes?.find(index => index.name === process.env.PINECONE_INDEX_NAME)
    if (targetIndex) {
      console.log(`\n🎯 Target index "${process.env.PINECONE_INDEX_NAME}" found!`)
      console.log(`   Dimension: ${targetIndex.dimension}`)
      console.log(`   Metric: ${targetIndex.metric}`)
      console.log(`   Status: ${targetIndex.status?.ready ? 'Ready' : 'Not Ready'}`)
      
      if (targetIndex.dimension !== 1024) {
        console.log(`⚠️  WARNING: Index dimension is ${targetIndex.dimension}, but we're using 1024`)
      }
    } else {
      console.log(`\n❌ Target index "${process.env.PINECONE_INDEX_NAME}" not found`)
      console.log('💡 You may need to create it or use a different index name')
    }
    
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.log('\n💡 Possible solutions:')
        console.log('1. Check your Pinecone API key at https://app.pinecone.io/')
        console.log('2. Make sure the API key has the correct permissions')
        console.log('3. Verify the API key is not expired')
      } else if (error.message.includes('region')) {
        console.log('\n💡 Possible solutions:')
        console.log('1. Check your Pinecone project region')
        console.log('2. Update the region in the Pinecone configuration')
      }
    }
  }
}

diagnosePinecone()
  .then(() => {
    console.log('\n✅ Diagnosis complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Diagnosis failed:', error)
    process.exit(1)
  })
