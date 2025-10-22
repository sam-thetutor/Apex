'use client'

import { useState } from 'react'

export default function BaseKnowledgeManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/base-knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    setSearchResults(null)
    
    try {
      const response = await fetch(`/api/base-knowledge?action=search&query=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      setSearchResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStats = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/base-knowledge?action=stats')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Base Knowledge Manager</h1>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleAction('upload')}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : '📤 Upload Knowledge'}
        </button>
        
        <button
          onClick={() => handleAction('test')}
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : '🧪 Test Search'}
        </button>
        
        <button
          onClick={getStats}
          disabled={isLoading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : '📊 Get Stats'}
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Knowledge Base</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Base knowledge..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Action Result</h2>
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {searchResults.success ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Found {searchResults.data.count} results for "{searchResults.data.query}"
              </p>
              {searchResults.data.results.map((result: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg">{result.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Category: {result.category}</p>
                  <p className="text-sm">{result.content.substring(0, 200)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800">Error: {searchResults.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Knowledge Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Knowledge Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'introduction', name: 'Introduction', count: 3 },
            { id: 'technology', name: 'Technology', count: 4 },
            { id: 'benefits', name: 'Benefits', count: 4 },
            { id: 'defi', name: 'DeFi', count: 4 },
            { id: 'transactions', name: 'Transactions', count: 4 },
            { id: 'development', name: 'Development', count: 4 },
            { id: 'ecosystem', name: 'Ecosystem', count: 4 },
            { id: 'comparison', name: 'Comparison', count: 3 }
          ].map((category) => (
            <div key={category.id} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} documents</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure GROQ_API_KEY and PINECONE_API_KEY are set in your environment</li>
          <li>• Upload will add ~30 comprehensive Base knowledge documents</li>
          <li>• Test search will verify the knowledge is properly indexed</li>
          <li>• Clear action will remove all knowledge (use with caution)</li>
        </ul>
      </div>
    </div>
  )
}
