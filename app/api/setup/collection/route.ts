import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'

export async function POST(request: NextRequest) {
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
    
    return NextResponse.json({ 
      success: true, 
      message: 'base_knowledge collection created successfully!',
      instructions: [
        '1. Go to MongoDB Atlas Dashboard',
        '2. Navigate to your cluster',
        '3. Click on "Search" tab',
        '4. Create vector search index for base_knowledge collection',
        '5. Use the configuration provided in the documentation'
      ]
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create collection'
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}
