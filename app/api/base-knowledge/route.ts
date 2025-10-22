import { NextRequest, NextResponse } from 'next/server'
import { uploadBaseKnowledgeToVectorIndex, testBaseKnowledgeSearch, clearBaseKnowledge } from '@/lib/ai/base-knowledge-uploader'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'upload':
        console.log('📤 Starting Base knowledge upload...')
        const uploadResult = await uploadBaseKnowledgeToVectorIndex()
        return NextResponse.json({
          success: uploadResult.success,
          message: uploadResult.success 
            ? `Successfully uploaded ${uploadResult.uploaded}/${uploadResult.total} documents`
            : `Upload failed: ${uploadResult.error}`,
          data: uploadResult
        })
        
      case 'test':
        console.log('🧪 Testing Base knowledge search...')
        await testBaseKnowledgeSearch()
        return NextResponse.json({
          success: true,
          message: 'Knowledge search test completed. Check console for results.'
        })
        
      case 'clear':
        console.log('🗑️ Clearing Base knowledge...')
        const clearResult = await clearBaseKnowledge()
        return NextResponse.json({
          success: clearResult.success,
          message: clearResult.success 
            ? `Successfully cleared ${clearResult.deleted} documents`
            : `Clear failed: ${clearResult.error}`,
          data: clearResult
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: upload, test, or clear'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in Base knowledge API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    
    if (action === 'stats') {
      const { pineconeKnowledgeService } = await import('@/lib/vector/pinecone-knowledge')
      const stats = await pineconeKnowledgeService.getKnowledgeStats()
      
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    if (action === 'search') {
      const query = searchParams.get('query')
      const limit = parseInt(searchParams.get('limit') || '5')
      
      if (!query) {
        return NextResponse.json({
          success: false,
          error: 'Query parameter is required'
        }, { status: 400 })
      }
      
      const { pineconeKnowledgeService } = await import('@/lib/vector/pinecone-knowledge')
      const results = await pineconeKnowledgeService.searchSimilar(query, limit)
      
      return NextResponse.json({
        success: true,
        data: {
          query,
          results,
          count: results.length
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use: stats or search'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Error in Base knowledge GET API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}