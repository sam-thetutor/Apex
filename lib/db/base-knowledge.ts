import clientPromise from './mongodb'
import { Collection, ObjectId } from 'mongodb'
import OpenAI from 'openai'

const DATABASE_NAME = process.env.MONGODB_DATABASE_NAME || 'apex'
const BASE_KNOWLEDGE_COLLECTION = 'base_knowledge'

export interface BaseKnowledge {
  _id?: ObjectId
  content: string
  embedding: number[]
  source: string // 'docs', 'blog', 'github', 'discord', etc.
  category: string // 'getting-started', 'api', 'tutorial', 'faq', etc.
  url: string
  title: string
  lastUpdated: Date
  createdAt: Date
}

export class BaseKnowledgeService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  private async getCollection(): Promise<Collection<BaseKnowledge>> {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    return db.collection<BaseKnowledge>(BASE_KNOWLEDGE_COLLECTION)
  }

  async addDocument(knowledge: Omit<BaseKnowledge, '_id' | 'createdAt' | 'lastUpdated' | 'embedding'>): Promise<string> {
    try {
      const collection = await this.getCollection()
      
      // Generate embedding for the content
      const embedding = await this.generateEmbedding(knowledge.content)
      
      const document: BaseKnowledge = {
        ...knowledge,
        embedding,
        createdAt: new Date(),
        lastUpdated: new Date()
      }
      
      const result = await collection.insertOne(document)
      return result.insertedId.toString()
    } catch (error) {
      console.error('Error adding document to base knowledge:', error)
      throw error
    }
  }

  async searchSimilar(query: string, limit: number = 5, filters?: { source?: string, category?: string }): Promise<BaseKnowledge[]> {
    try {
      // Try vector search first, fall back to text search if not available
      try {
        // Generate embedding for the query
        const queryEmbedding = await this.generateEmbedding(query)
        
        const collection = await this.getCollection()
        
        // Build aggregation pipeline for vector search
        const pipeline: any[] = [
          {
            $vectorSearch: {
              index: "base_knowledge_vector_search",
              path: "embedding",
              queryVector: queryEmbedding,
              numCandidates: limit * 10, // Search more candidates for better results
              limit: limit
            }
          }
        ]

        // Add filters if provided
        if (filters) {
          const matchStage: any = {}
          if (filters.source) matchStage.source = filters.source
          if (filters.category) matchStage.category = filters.category
          
          if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage })
          }
        }

        // Add projection to exclude embedding from results (for performance)
        pipeline.push({
          $project: {
            _id: 1,
            content: 1,
            source: 1,
            category: 1,
            url: 1,
            title: 1,
            lastUpdated: 1,
            createdAt: 1,
            score: { $meta: "vectorSearchScore" }
          }
        })

        const results = await collection.aggregate(pipeline).toArray()
        return results as BaseKnowledge[]
        
      } catch (vectorError) {
        console.log('Vector search not available, falling back to text search:', vectorError instanceof Error ? vectorError.message : 'Unknown error')
        // Fall back to text search if vector search fails (e.g., index not configured)
        return await this.fallbackTextSearch(query, limit, filters)
      }
    } catch (error) {
      console.error('Error searching base knowledge:', error)
      // Final fallback to text search
      return await this.fallbackTextSearch(query, limit, filters)
    }
  }

  private async fallbackTextSearch(query: string, limit: number, filters?: { source?: string, category?: string }): Promise<BaseKnowledge[]> {
    try {
      const collection = await this.getCollection()
      
      const searchQuery: any = {
        $or: [
          { content: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } }
        ]
      }

      if (filters) {
        if (filters.source) searchQuery.source = filters.source
        if (filters.category) searchQuery.category = filters.category
      }

      const results = await collection
        .find(searchQuery)
        .limit(limit)
        .sort({ lastUpdated: -1 })
        .toArray()

      return results as BaseKnowledge[]
    } catch (error) {
      console.error('Error in fallback text search:', error)
      return []
    }
  }

  async updateDocument(id: string, updates: Partial<BaseKnowledge>): Promise<BaseKnowledge | null> {
    try {
      const collection = await this.getCollection()
      
      // If content is being updated, regenerate embedding
      if (updates.content) {
        updates.embedding = await this.generateEmbedding(updates.content)
      }
      
      updates.lastUpdated = new Date()
      
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' }
      )
      
      return result || null
    } catch (error) {
      console.error('Error updating base knowledge document:', error)
      throw error
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const collection = await this.getCollection()
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Error deleting base knowledge document:', error)
      throw error
    }
  }

  async getAllDocuments(limit: number = 100): Promise<BaseKnowledge[]> {
    try {
      const collection = await this.getCollection()
      return await collection
        .find({})
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray()
    } catch (error) {
      console.error('Error fetching all base knowledge documents:', error)
      return []
    }
  }

  async getDocumentsBySource(source: string, limit: number = 50): Promise<BaseKnowledge[]> {
    try {
      const collection = await this.getCollection()
      return await collection
        .find({ source })
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray()
    } catch (error) {
      console.error('Error fetching documents by source:', error)
      return []
    }
  }

  async getDocumentsByCategory(category: string, limit: number = 50): Promise<BaseKnowledge[]> {
    try {
      const collection = await this.getCollection()
      return await collection
        .find({ category })
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray()
    } catch (error) {
      console.error('Error fetching documents by category:', error)
      return []
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
      })
      
      return response.data[0].embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  // Utility method to chunk content for better vector search
  static chunkContent(content: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = []
    let start = 0
    
    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length)
      let chunk = content.slice(start, end)
      
      // Try to break at sentence boundaries
      if (end < content.length) {
        const lastSentenceEnd = chunk.lastIndexOf('.')
        const lastNewline = chunk.lastIndexOf('\n')
        const breakPoint = Math.max(lastSentenceEnd, lastNewline)
        
        if (breakPoint > chunkSize * 0.5) {
          chunk = chunk.slice(0, breakPoint + 1)
        }
      }
      
      chunks.push(chunk.trim())
      start = start + chunk.length - overlap
    }
    
    return chunks.filter(chunk => chunk.length > 50) // Filter out very small chunks
  }

  // Get statistics about the knowledge base
  async getStats(): Promise<{
    totalDocuments: number
    documentsBySource: { [source: string]: number }
    documentsByCategory: { [category: string]: number }
    lastUpdated: Date | null
  }> {
    try {
      const collection = await this.getCollection()
      
      const [totalCount, sourceStats, categoryStats, lastDoc] = await Promise.all([
        collection.countDocuments(),
        collection.aggregate([
          { $group: { _id: "$source", count: { $sum: 1 } } }
        ]).toArray(),
        collection.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } }
        ]).toArray(),
        collection.findOne({}, { sort: { lastUpdated: -1 } })
      ])
      
      const documentsBySource: { [source: string]: number } = {}
      sourceStats.forEach(stat => {
        documentsBySource[stat._id] = stat.count
      })
      
      const documentsByCategory: { [category: string]: number } = {}
      categoryStats.forEach(stat => {
        documentsByCategory[stat._id] = stat.count
      })
      
      return {
        totalDocuments: totalCount,
        documentsBySource,
        documentsByCategory,
        lastUpdated: lastDoc?.lastUpdated || null
      }
    } catch (error) {
      console.error('Error getting base knowledge stats:', error)
      return {
        totalDocuments: 0,
        documentsBySource: {},
        documentsByCategory: {},
        lastUpdated: null
      }
    }
  }
}

// Export singleton instance
export const baseKnowledgeService = new BaseKnowledgeService()
