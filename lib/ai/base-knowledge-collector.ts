import axios from 'axios'
import * as cheerio from 'cheerio'
import { BaseKnowledgeService, BaseKnowledge } from '../db/base-knowledge'

export class BaseKnowledgeCollector {
  private knowledgeService = new BaseKnowledgeService()
  private baseUrl = 'https://docs.base.org'

  async collectAllBaseKnowledge(): Promise<void> {
    console.log('Starting Base knowledge collection...')
    
    try {
      // Collect from different sources
      await this.collectFromDocs()
      await this.collectFromBlog()
      await this.collectFromGitHub()
      
      console.log('Base knowledge collection completed!')
      
      // Print stats
      const stats = await this.knowledgeService.getStats()
      console.log('Knowledge base stats:', stats)
      
    } catch (error) {
      console.error('Error collecting Base knowledge:', error)
      throw error
    }
  }

  async collectFromDocs(): Promise<void> {
    console.log('Collecting from Base documentation...')
    
    try {
      const response = await axios.get(this.baseUrl)
      const $ = cheerio.load(response.data)
      
      // Find all documentation links
      const docLinks: string[] = []
      $('a[href*="/docs/"]').each((_, element) => {
        const href = $(element).attr('href')
        if (href && !docLinks.includes(href)) {
          docLinks.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`)
        }
      })
      
      console.log(`Found ${docLinks.length} documentation pages`)
      
      // Process each page
      for (const url of docLinks.slice(0, 20)) { // Limit to first 20 pages for now
        try {
          await this.processDocPage(url)
          await this.delay(1000) // Rate limiting
        } catch (error) {
          console.error(`Error processing page ${url}:`, error)
        }
      }
      
    } catch (error) {
      console.error('Error collecting from docs:', error)
    }
  }

  async collectFromBlog(): Promise<void> {
    console.log('Collecting from Base blog...')
    
    try {
      const blogUrl = 'https://base.org/blog'
      const response = await axios.get(blogUrl)
      const $ = cheerio.load(response.data)
      
      const blogLinks: string[] = []
      $('a[href*="/blog/"]').each((_, element) => {
        const href = $(element).attr('href')
        if (href && !blogLinks.includes(href)) {
          blogLinks.push(href.startsWith('http') ? href : `https://base.org${href}`)
        }
      })
      
      console.log(`Found ${blogLinks.length} blog posts`)
      
      // Process each blog post
      for (const url of blogLinks.slice(0, 10)) { // Limit to first 10 posts
        try {
          await this.processBlogPost(url)
          await this.delay(1000) // Rate limiting
        } catch (error) {
          console.error(`Error processing blog post ${url}:`, error)
        }
      }
      
    } catch (error) {
      console.error('Error collecting from blog:', error)
    }
  }

  async collectFromGitHub(): Promise<void> {
    console.log('Collecting from Base GitHub...')
    
    try {
      // Collect from Base GitHub README and key repositories
      const githubUrls = [
        'https://raw.githubusercontent.com/base-org/base/master/README.md',
        'https://raw.githubusercontent.com/base-org/base/master/docs/README.md'
      ]
      
      for (const url of githubUrls) {
        try {
          await this.processGitHubContent(url)
          await this.delay(1000) // Rate limiting
        } catch (error) {
          console.error(`Error processing GitHub content ${url}:`, error)
        }
      }
      
    } catch (error) {
      console.error('Error collecting from GitHub:', error)
    }
  }

  private async processDocPage(url: string): Promise<void> {
    try {
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)
      
      // Extract title
      const title = $('h1').first().text().trim() || 
                   $('title').text().trim() || 
                   'Base Documentation'
      
      // Extract main content
      const content = $('main, .content, .documentation').text().trim() ||
                     $('body').text().trim()
      
      if (!content || content.length < 100) {
        console.log(`Skipping page ${url} - insufficient content`)
        return
      }
      
      // Determine category based on URL
      const category = this.determineCategory(url)
      
      // Chunk the content
      const chunks = BaseKnowledgeService.chunkContent(content)
      
      // Add each chunk as a separate document
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkTitle = chunks.length > 1 ? `${title} (Part ${i + 1})` : title
        
        await this.knowledgeService.addDocument({
          content: chunk,
          source: 'docs',
          category,
          url,
          title: chunkTitle
        })
      }
      
      console.log(`Processed documentation page: ${title}`)
      
    } catch (error) {
      console.error(`Error processing doc page ${url}:`, error)
    }
  }

  private async processBlogPost(url: string): Promise<void> {
    try {
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)
      
      // Extract title
      const title = $('h1').first().text().trim() || 
                   $('title').text().trim() || 
                   'Base Blog Post'
      
      // Extract main content
      const content = $('article, .post-content, .blog-content').text().trim() ||
                     $('main').text().trim() ||
                     $('body').text().trim()
      
      if (!content || content.length < 100) {
        console.log(`Skipping blog post ${url} - insufficient content`)
        return
      }
      
      // Chunk the content
      const chunks = BaseKnowledgeService.chunkContent(content)
      
      // Add each chunk as a separate document
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkTitle = chunks.length > 1 ? `${title} (Part ${i + 1})` : title
        
        await this.knowledgeService.addDocument({
          content: chunk,
          source: 'blog',
          category: 'announcements',
          url,
          title: chunkTitle
        })
      }
      
      console.log(`Processed blog post: ${title}`)
      
    } catch (error) {
      console.error(`Error processing blog post ${url}:`, error)
    }
  }

  private async processGitHubContent(url: string): Promise<void> {
    try {
      const response = await axios.get(url)
      const content = response.data
      
      if (!content || content.length < 100) {
        console.log(`Skipping GitHub content ${url} - insufficient content`)
        return
      }
      
      // Extract title from URL
      const urlParts = url.split('/')
      const title = urlParts[urlParts.length - 1] || 'GitHub Content'
      
      // Chunk the content
      const chunks = BaseKnowledgeService.chunkContent(content)
      
      // Add each chunk as a separate document
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkTitle = chunks.length > 1 ? `${title} (Part ${i + 1})` : title
        
        await this.knowledgeService.addDocument({
          content: chunk,
          source: 'github',
          category: 'technical',
          url,
          title: chunkTitle
        })
      }
      
      console.log(`Processed GitHub content: ${title}`)
      
    } catch (error) {
      console.error(`Error processing GitHub content ${url}:`, error)
    }
  }

  private determineCategory(url: string): string {
    if (url.includes('/getting-started')) return 'getting-started'
    if (url.includes('/api')) return 'api'
    if (url.includes('/tutorial')) return 'tutorial'
    if (url.includes('/guide')) return 'guide'
    if (url.includes('/faq')) return 'faq'
    if (url.includes('/security')) return 'security'
    if (url.includes('/bridge')) return 'bridge'
    if (url.includes('/deploy')) return 'deployment'
    return 'general'
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Method to add manual knowledge entries
  async addManualKnowledge(entries: Array<{
    content: string
    source: string
    category: string
    title: string
    url?: string
  }>): Promise<void> {
    console.log(`Adding ${entries.length} manual knowledge entries...`)
    
    for (const entry of entries) {
      try {
        await this.knowledgeService.addDocument({
          content: entry.content,
          source: entry.source,
          category: entry.category,
          title: entry.title,
          url: entry.url || ''
        })
        console.log(`Added manual entry: ${entry.title}`)
      } catch (error) {
        console.error(`Error adding manual entry ${entry.title}:`, error)
      }
    }
  }
}

// Export singleton instance
export const baseKnowledgeCollector = new BaseKnowledgeCollector()
