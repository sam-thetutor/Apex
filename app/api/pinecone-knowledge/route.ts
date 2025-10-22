import { NextRequest, NextResponse } from 'next/server'
import { pineconeKnowledgeService } from '@/lib/vector/pinecone-knowledge'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'init':
        await pineconeKnowledgeService.initialize()
        return NextResponse.json({ 
          success: true, 
          message: 'Pinecone knowledge service initialized successfully' 
        })

      case 'stats':
        const stats = await pineconeKnowledgeService.getStats()
        return NextResponse.json({ 
          success: true, 
          data: stats 
        })

      case 'search':
        const { query, limit = 5, filters } = await request.json()
        const results = await pineconeKnowledgeService.searchSimilar(query, limit, filters)
        return NextResponse.json({ 
          success: true, 
          data: results 
        })

      case 'add_document':
        const { document } = await request.json()
        const id = await pineconeKnowledgeService.addDocument(document)
        return NextResponse.json({ 
          success: true, 
          data: { id } 
        })

      case 'update_document':
        const { id: docId, updates } = await request.json()
        const updated = await pineconeKnowledgeService.updateDocument(docId, updates)
        return NextResponse.json({ 
          success: true, 
          data: { updated } 
        })

      case 'delete_document':
        const { id: deleteId } = await request.json()
        const deleted = await pineconeKnowledgeService.deleteDocument(deleteId)
        return NextResponse.json({ 
          success: true, 
          data: { deleted } 
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in Pinecone knowledge API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request'
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        const stats = await pineconeKnowledgeService.getStats()
        return NextResponse.json({ 
          success: true, 
          data: stats 
        })

      case 'search':
        const query = searchParams.get('query')
        const limit = parseInt(searchParams.get('limit') || '5')
        const source = searchParams.get('source') || undefined
        const category = searchParams.get('category') || undefined
        
        if (!query) {
          return NextResponse.json({ 
            error: 'Query parameter is required' 
          }, { status: 400 })
        }

        const filters = { source, category }
        const results = await pineconeKnowledgeService.searchSimilar(query, limit, filters)
        return NextResponse.json({ 
          success: true, 
          data: results 
        })

      case 'documents':
        const limitParam = parseInt(searchParams.get('limit') || '50')
        const documents = await pineconeKnowledgeService.getAllDocuments(limitParam)
        return NextResponse.json({ 
          success: true, 
          data: documents 
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error in Pinecone knowledge API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request'
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 })
  }
}
