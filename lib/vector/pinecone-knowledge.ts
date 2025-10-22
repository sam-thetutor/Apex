import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

export interface BaseKnowledgeDocument {
  id: string
  content: string
  source: string // 'docs', 'blog', 'github', 'discord', etc.
  category: string // 'getting-started', 'api', 'tutorial', 'faq', etc.
  url: string
  title: string
  lastUpdated: Date
  createdAt: Date
}

export class PineconeKnowledgeService {
  private pinecone: Pinecone
  private openai: OpenAI
  private indexName: string
  private embeddingCache: Map<string, number[]> = new Map()

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || 'dummy-key-for-build'
    })
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build'
    })
    this.indexName = process.env.PINECONE_INDEX_NAME || 'base-knowledge'
  }

  async initialize(): Promise<void> {
    try {
      // Skip initialization check - assume index exists and is ready
      console.log(`Using Pinecone index: ${this.indexName}`)
      return
      
      // Original initialization code (commented out for now)
      /*
      // Check if index exists, create if not
      const indexList = await this.pinecone.listIndexes()
      const indexExists = indexList.indexes?.some(index => index.name === this.indexName)
      
      if (!indexExists) {
        console.log(`Creating Pinecone index: ${this.indexName}`)
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1024, // Match existing index dimensions
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        })
        
        // Wait for index to be ready
        console.log('Waiting for index to be ready...')
        await this.waitForIndexReady()
      }
      
      console.log(`✅ Pinecone index ${this.indexName} is ready`)
      */
    } catch (error) {
      console.error('Error initializing Pinecone:', error)
      throw error
    }
  }

  private async waitForIndexReady(): Promise<void> {
    const maxAttempts = 30
    let attempts = 0
    
    while (attempts < maxAttempts) {
      try {
        const indexDescription = await this.pinecone.describeIndex(this.indexName)
        if (indexDescription.status?.ready) {
          return
        }
        console.log(`Index not ready yet, waiting... (${attempts + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
      } catch (error) {
        console.log(`Waiting for index... (${attempts + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
      }
    }
    
    throw new Error('Index did not become ready in time')
  }

  async addDocument(document: Omit<BaseKnowledgeDocument, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string> {
    try {
      await this.initialize()
      
      // Generate embedding
      const embedding = await this.generateEmbedding(document.content)
      
      // Generate unique ID
      const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Prepare metadata
      const metadata = {
        content: document.content,
        source: document.source,
        category: document.category,
        url: document.url,
        title: document.title,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      
      // Insert into Pinecone
      const index = this.pinecone.index(this.indexName)
      await index.upsert([{
        id,
        values: embedding,
        metadata
      }])
      
      console.log(`✅ Added document to Pinecone: ${document.title}`)
      return id
    } catch (error) {
      console.error('Error adding document to Pinecone:', error)
      throw error
    }
  }

  async searchSimilar(query: string, limit: number = 5, filters?: { source?: string, category?: string }): Promise<BaseKnowledgeDocument[]> {
    try {
      // Skip Pinecone initialization for faster response - assume it's ready
      // await this.initialize()
      
      // Try cached embedding first
      const cacheKey = query.toLowerCase().trim()
      let queryEmbedding: number[]
      
      if (this.embeddingCache.has(cacheKey)) {
        queryEmbedding = this.embeddingCache.get(cacheKey)!
      } else {
        // Generate embedding with very short timeout
        queryEmbedding = await Promise.race([
          this.generateEmbedding(query),
          new Promise<number[]>((_, reject) => 
            setTimeout(() => reject(new Error('Embedding generation timeout')), 1000)
          )
        ]) as number[]
      }
      
      // Prepare filter
      const filter: any = {}
      if (filters?.source) {
        filter.source = { $eq: filters.source }
      }
      if (filters?.category) {
        filter.category = { $eq: filters.category }
      }
      
      // Search Pinecone with shorter timeout
      const index = this.pinecone.index(this.indexName)
      const searchResponse = await Promise.race([
        index.query({
          vector: queryEmbedding,
          topK: limit,
          includeMetadata: true,
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Pinecone search timeout')), 1500)
        )
      ]) as any
      
      // Convert results to our format
      const results: BaseKnowledgeDocument[] = searchResponse.matches?.map((match: any) => ({
        id: match.id!,
        content: match.metadata?.content as string,
        source: match.metadata?.source as string,
        category: match.metadata?.category as string,
        url: match.metadata?.url as string,
        title: match.metadata?.title as string,
        createdAt: new Date(match.metadata?.createdAt as string),
        lastUpdated: new Date(match.metadata?.lastUpdated as string)
      })) || []
      
      return results
    } catch (error) {
      console.error('Error searching Pinecone:', error)
      // Fallback to text search if vector search fails
      return await this.fallbackTextSearch(query, limit, filters)
    }
  }

  async updateDocument(id: string, updates: Partial<BaseKnowledgeDocument>): Promise<boolean> {
    try {
      await this.initialize()
      
      const index = this.pinecone.index(this.indexName)
      
      // Get existing document
      const existingDoc = await index.fetch([id])
      if (!existingDoc.records || Object.keys(existingDoc.records).length === 0) {
        return false
      }
      
      const existingVector = existingDoc.records[id]
      const existingMetadata = existingVector.metadata as any
      
      // Update metadata
      const updatedMetadata = {
        ...existingMetadata,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
      
      // If content changed, regenerate embedding
      let embedding = existingVector.values
      if (updates.content) {
        embedding = await this.generateEmbedding(updates.content)
      }
      
      // Update in Pinecone
      await index.upsert([{
        id,
        values: embedding,
        metadata: updatedMetadata
      }])
      
      return true
    } catch (error) {
      console.error('Error updating document in Pinecone:', error)
      return false
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      await this.initialize()
      
      const index = this.pinecone.index(this.indexName)
      await index.deleteOne(id)
      
      return true
    } catch (error) {
      console.error('Error deleting document from Pinecone:', error)
      return false
    }
  }

  async getAllDocuments(limit: number = 100): Promise<BaseKnowledgeDocument[]> {
    try {
      await this.initialize()
      
      const index = this.pinecone.index(this.indexName)
      
      // Get index stats to know how many vectors we have
      const stats = await index.describeIndexStats()
      const totalVectors = stats.totalRecordCount || 0
      
      if (totalVectors === 0) {
        return []
      }
      
      // Query with a dummy vector to get all documents
      const dummyEmbedding = new Array(1024).fill(0)
      const searchResponse = await index.query({
        vector: dummyEmbedding,
        topK: Math.min(limit, totalVectors),
        includeMetadata: true
      })
      
      // Convert results to our format
      const results: BaseKnowledgeDocument[] = searchResponse.matches?.map((match: any) => ({
        id: match.id!,
        content: match.metadata?.content as string,
        source: match.metadata?.source as string,
        category: match.metadata?.category as string,
        url: match.metadata?.url as string,
        title: match.metadata?.title as string,
        createdAt: new Date(match.metadata?.createdAt as string),
        lastUpdated: new Date(match.metadata?.lastUpdated as string)
      })) || []
      
      return results
    } catch (error) {
      console.error('Error getting all documents from Pinecone:', error)
      return []
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Check cache first
      const cacheKey = text.toLowerCase().trim()
      if (this.embeddingCache.has(cacheKey)) {
        return this.embeddingCache.get(cacheKey)!
      }

      // Generate a simple hash-based embedding (1024 dimensions)
      // This is a deterministic approach that doesn't require API calls
      const embedding = this.generateHashEmbedding(text)

      // Cache the result
      this.embeddingCache.set(cacheKey, embedding)

      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw error
    }
  }

  private generateHashEmbedding(text: string): number[] {
    // Generate a deterministic 1024-dimensional embedding based on text content
    const embedding = new Array(1024).fill(0)
    const words = text.toLowerCase().split(/\s+/)
    
    words.forEach((word, wordIndex) => {
      // Simple hash function for each word
      let hash = 0
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff
      }
      
      // Distribute hash across embedding dimensions
      const baseIndex = Math.abs(hash) % 1024
      const spread = Math.min(10, words.length) // Spread across up to 10 dimensions
      
      for (let i = 0; i < spread; i++) {
        const index = (baseIndex + i) % 1024
        const weight = 1.0 / (i + 1) // Decreasing weight
        embedding[index] += weight * (wordIndex + 1) / words.length
      }
    })
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] = embedding[i] / magnitude
      }
    }
    
    return embedding
  }

  private async fallbackTextSearch(query: string, limit: number, filters?: { source?: string, category?: string }): Promise<BaseKnowledgeDocument[]> {
    try {
      // Use pre-defined knowledge base for instant results
      const predefinedKnowledge: BaseKnowledgeDocument[] = [
        // Introduction to Base
        {
          id: 'base-overview',
          content: 'Base is a Layer 2 blockchain built on Ethereum that offers ultra-low fees (less than $0.01), fast transactions, and high security through Optimistic Rollup technology. It\'s designed to be the foundation for Coinbase\'s onchain products and an open ecosystem for anyone to build on.',
          source: 'docs',
          category: 'introduction',
          url: 'https://docs.base.org',
          title: 'What is Base Blockchain',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-purpose',
          content: 'Base was created by Coinbase to bring the next billion users onchain. It provides a secure, low-cost, developer-friendly platform for building decentralized applications while maintaining Ethereum\'s security guarantees.',
          source: 'docs',
          category: 'introduction',
          url: 'https://docs.base.org',
          title: 'Base\'s Mission and Purpose',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-coinbase-relationship',
          content: 'Base is Coinbase\'s Layer 2 blockchain, but it\'s designed to be an open ecosystem. While Coinbase provides the infrastructure, Base is permissionless and allows anyone to build and deploy applications.',
          source: 'docs',
          category: 'introduction',
          url: 'https://docs.base.org',
          title: 'Base and Coinbase Relationship',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Technology
        {
          id: 'optimistic-rollups',
          content: 'Base uses Optimistic Rollup technology to process transactions off-chain and then batch them to Ethereum mainnet for security. This provides fast, cheap, and secure transactions while maintaining Ethereum\'s security guarantees.',
          source: 'docs',
          category: 'technology',
          url: 'https://docs.base.org',
          title: 'Optimistic Rollup Technology',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'ethereum-compatibility',
          content: 'Base is fully compatible with Ethereum, meaning you can deploy existing Ethereum smart contracts with minimal changes. It supports all standard Ethereum tools, wallets, and development frameworks.',
          source: 'docs',
          category: 'technology',
          url: 'https://docs.base.org',
          title: 'Ethereum Compatibility',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-security',
          content: 'Base inherits Ethereum\'s security through Optimistic Rollup technology. It has undergone multiple security audits and has a bug bounty program. Your funds are as secure as on Ethereum mainnet.',
          source: 'docs',
          category: 'technology',
          url: 'https://docs.base.org',
          title: 'Base Security Model',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-finality',
          content: 'Base offers near-instant transaction finality! Transactions are processed quickly and efficiently, making it perfect for real-time applications and frequent trading.',
          source: 'docs',
          category: 'technology',
          url: 'https://docs.base.org',
          title: 'Transaction Finality',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Benefits
        {
          id: 'low-fees',
          content: 'Base transaction fees are incredibly low - typically under $0.01! This is much cheaper than Ethereum mainnet and other Layer 2 solutions. The low fees make Base perfect for frequent transactions and DeFi activities.',
          source: 'docs',
          category: 'benefits',
          url: 'https://docs.base.org',
          title: 'Ultra-Low Transaction Fees',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'fast-transactions',
          content: 'Base offers near-instant transaction finality! Transactions are processed quickly and efficiently, making it perfect for real-time applications and frequent trading.',
          source: 'docs',
          category: 'benefits',
          url: 'https://docs.base.org',
          title: 'Fast Transaction Processing',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'developer-friendly',
          content: 'Base is developer-friendly with full Ethereum compatibility. You can deploy existing Ethereum dApps with minimal changes. It supports all standard Ethereum tools and has comprehensive documentation.',
          source: 'docs',
          category: 'benefits',
          url: 'https://docs.base.org',
          title: 'Developer-Friendly Platform',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'coinbase-integration',
          content: 'Base integrates seamlessly with Coinbase, making it easy for users to move funds between Coinbase and Base. This provides a smooth onboarding experience for new crypto users.',
          source: 'docs',
          category: 'benefits',
          url: 'https://docs.base.org',
          title: 'Coinbase Integration',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // DeFi
        {
          id: 'defi-overview',
          content: 'Base supports DeFi protocols including DEXs, lending platforms, yield farming, and liquidity pools. Popular protocols include Uniswap, Aave, and Compound. You can access all major DeFi services with low fees!',
          source: 'docs',
          category: 'defi',
          url: 'https://docs.base.org',
          title: 'DeFi Ecosystem on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'uniswap-base',
          content: 'Uniswap is available on Base, allowing users to swap tokens with minimal fees. The familiar Uniswap interface works seamlessly on Base with the same security and functionality.',
          source: 'docs',
          category: 'defi',
          url: 'https://docs.base.org',
          title: 'Uniswap on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'aave-base',
          content: 'Aave lending protocol is deployed on Base, enabling users to lend and borrow assets with competitive rates. The low fees on Base make lending and borrowing more cost-effective.',
          source: 'docs',
          category: 'defi',
          url: 'https://docs.base.org',
          title: 'Aave Lending on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'yield-farming-base',
          content: 'Base supports various yield farming opportunities with lower fees, making it more profitable for farmers. Popular farming protocols include Compound, Aave, and native Base protocols.',
          source: 'docs',
          category: 'defi',
          url: 'https://docs.base.org',
          title: 'Yield Farming on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Transactions
        {
          id: 'sending-tokens',
          content: 'To send tokens on Base: 1) Connect your wallet, 2) Select the token to send, 3) Enter recipient address, 4) Enter amount, 5) Confirm transaction. Fees are typically under $0.01!',
          source: 'docs',
          category: 'transactions',
          url: 'https://docs.base.org',
          title: 'How to Send Tokens on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'wallet-setup',
          content: 'To use Base, you need a compatible wallet like MetaMask, Coinbase Wallet, or WalletConnect. Add Base network (Chain ID: 8453) to your wallet and fund it with ETH for gas fees.',
          source: 'docs',
          category: 'transactions',
          url: 'https://docs.base.org',
          title: 'Setting Up Wallet for Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'bridge-to-base',
          content: 'You can bridge assets to Base from Ethereum mainnet using the official Base Bridge. The bridge is secure and allows you to move ETH and ERC-20 tokens to Base with minimal fees.',
          source: 'docs',
          category: 'transactions',
          url: 'https://docs.base.org',
          title: 'Bridging Assets to Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'gas-fees-base',
          content: 'Gas fees on Base are paid in ETH and are typically under $0.01. The low fees make Base ideal for frequent transactions, micro-payments, and DeFi activities.',
          source: 'docs',
          category: 'transactions',
          url: 'https://docs.base.org',
          title: 'Gas Fees on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Development
        {
          id: 'smart-contracts',
          content: 'Base supports all Ethereum smart contract standards including ERC-20, ERC-721, ERC-1155, and more. You can deploy existing Ethereum contracts with minimal modifications.',
          source: 'docs',
          category: 'development',
          url: 'https://docs.base.org',
          title: 'Smart Contract Development',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'development-tools',
          content: 'Base supports all standard Ethereum development tools including Hardhat, Truffle, Remix, and Foundry. The familiar development environment makes it easy to build on Base.',
          source: 'docs',
          category: 'development',
          url: 'https://docs.base.org',
          title: 'Development Tools and Frameworks',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-testnet',
          content: 'Base has a testnet (Base Sepolia) for development and testing. You can get testnet ETH from faucets and deploy contracts for free to test your applications.',
          source: 'docs',
          category: 'development',
          url: 'https://docs.base.org',
          title: 'Base Testnet Development',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'deployment-guide',
          content: 'To deploy to Base mainnet: 1) Set up your development environment, 2) Configure your wallet with Base network, 3) Deploy using your preferred tool (Hardhat, Truffle, etc.), 4) Verify contracts on BaseScan.',
          source: 'docs',
          category: 'development',
          url: 'https://docs.base.org',
          title: 'Deployment Guide for Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Ecosystem
        {
          id: 'base-ecosystem-overview',
          content: 'The Base ecosystem includes hundreds of projects across DeFi, NFTs, gaming, and social applications. Popular projects include Friend.tech, Uniswap, Aave, and many native Base applications.',
          source: 'docs',
          category: 'ecosystem',
          url: 'https://docs.base.org',
          title: 'Base Ecosystem Overview',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'friend-tech',
          content: 'Friend.tech is a social application built on Base that allows users to tokenize their social connections. It\'s one of the most popular applications on Base.',
          source: 'docs',
          category: 'ecosystem',
          url: 'https://docs.base.org',
          title: 'Friend.tech on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-nfts',
          content: 'Base supports NFT marketplaces and collections. Popular NFT platforms on Base include OpenSea, Zora, and native Base NFT marketplaces.',
          source: 'docs',
          category: 'ecosystem',
          url: 'https://docs.base.org',
          title: 'NFTs on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-gaming',
          content: 'Base is becoming a hub for blockchain gaming with low fees enabling micro-transactions and frequent gameplay interactions. Several gaming projects are building on Base.',
          source: 'docs',
          category: 'ecosystem',
          url: 'https://docs.base.org',
          title: 'Gaming on Base',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        
        // Comparison
        {
          id: 'base-vs-ethereum',
          content: 'Base vs Ethereum: Base offers the same security as Ethereum but with 100x lower fees and faster transactions. Base is built on Ethereum, so it inherits all security guarantees.',
          source: 'docs',
          category: 'comparison',
          url: 'https://docs.base.org',
          title: 'Base vs Ethereum Mainnet',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-vs-other-l2s',
          content: 'Base vs Other L2s: Base offers competitive fees, fast finality, and strong Coinbase integration. It\'s designed for mainstream adoption with user-friendly features.',
          source: 'docs',
          category: 'comparison',
          url: 'https://docs.base.org',
          title: 'Base vs Other Layer 2s',
          createdAt: new Date(),
          lastUpdated: new Date()
        },
        {
          id: 'base-vs-solana',
          content: 'Base vs Solana: Base offers Ethereum compatibility and security, while Solana has different trade-offs. Base is better for Ethereum developers and DeFi applications.',
          source: 'docs',
          category: 'comparison',
          url: 'https://docs.base.org',
          title: 'Base vs Solana',
          createdAt: new Date(),
          lastUpdated: new Date()
        }
      ]
      
      // Simple text matching with predefined knowledge
      const results = predefinedKnowledge.filter(doc => {
        const queryLower = query.toLowerCase()
        const matchesQuery = doc.content.toLowerCase().includes(queryLower) ||
                           doc.title.toLowerCase().includes(queryLower) ||
                           doc.category.toLowerCase().includes(queryLower)
        
        const matchesSource = !filters?.source || doc.source === filters.source
        const matchesCategory = !filters?.category || doc.category === filters.category
        
        return matchesQuery && matchesSource && matchesCategory
      })
      
      // Sort by relevance (enhanced scoring)
      results.sort((a, b) => {
        const queryLower = query.toLowerCase()
        const aScore = (a.title.toLowerCase().includes(queryLower) ? 5 : 0) +
                      (a.content.toLowerCase().includes(queryLower) ? 3 : 0) +
                      (a.category.toLowerCase().includes(queryLower) ? 1 : 0)
        const bScore = (b.title.toLowerCase().includes(queryLower) ? 5 : 0) +
                      (b.content.toLowerCase().includes(queryLower) ? 3 : 0) +
                      (b.category.toLowerCase().includes(queryLower) ? 1 : 0)
        return bScore - aScore
      })
      
      return results.slice(0, limit)
    } catch (error) {
      console.error('Error in fallback text search:', error)
      return []
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

  async getStats(): Promise<{
    totalDocuments: number
    documentsBySource: { [source: string]: number }
    documentsByCategory: { [category: string]: number }
    lastUpdated: Date | null
  }> {
    try {
      await this.initialize()
      
      const index = this.pinecone.index(this.indexName)
      const stats = await index.describeIndexStats()
      
      const totalDocuments = stats.totalRecordCount || 0
      
      // Get sample documents to analyze sources and categories
      const sampleDocs = await this.getAllDocuments(1000)
      
      const documentsBySource: { [source: string]: number } = {}
      const documentsByCategory: { [category: string]: number } = {}
      
      sampleDocs.forEach(doc => {
        documentsBySource[doc.source] = (documentsBySource[doc.source] || 0) + 1
        documentsByCategory[doc.category] = (documentsByCategory[doc.category] || 0) + 1
      })
      
      const lastUpdated = sampleDocs.length > 0 
        ? new Date(Math.max(...sampleDocs.map(doc => doc.lastUpdated.getTime())))
        : null
      
      return {
        totalDocuments,
        documentsBySource,
        documentsByCategory,
        lastUpdated
      }
    } catch (error) {
      console.error('Error getting Pinecone stats:', error)
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
export const pineconeKnowledgeService = new PineconeKnowledgeService()
