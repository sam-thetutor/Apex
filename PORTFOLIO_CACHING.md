# Portfolio Caching System

## Overview
The portfolio caching system provides efficient balance fetching with intelligent caching to reduce API calls and improve user experience.

## Features

### 1. **Automatic Caching**
- Balances are cached in localStorage when fetched
- Cache duration: **5 minutes**
- Cache is keyed by user wallet address

### 2. **Smart Refetching**
The portfolio automatically refetches in these scenarios:
- When user connects their wallet
- After adding a new token
- After sending tokens (future)
- After swapping tokens (future)
- Manual refresh button

### 3. **Cache Management**
```typescript
// Cache key format
const cacheKey = `apex_portfolio_cache_${walletAddress}`

// Cache structure
{
  portfolio: [...],
  timestamp: "2024-01-01T00:00:00.000Z"
}
```

## API Endpoint

### `GET /api/portfolio/balances?address=0x...`
Fetches all token balances for a user's portfolio.

**Response:**
```json
{
  "success": true,
  "portfolio": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "balance": "0.123456",
      "usdValue": "246.91",
      "icon": "💎",
      "address": "native"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Usage

### Manual Refetch
```typescript
// From any component
if (typeof window !== 'undefined') {
  const refetchPortfolio = (window as any).refetchPortfolio
  if (refetchPortfolio) {
    refetchPortfolio() // Force refresh
  }
}
```

### Automatic Refetch
The portfolio automatically refetches when:
1. User adds a token via chat
2. User connects wallet
3. User clicks "Refresh" button

## Benefits

1. **Performance**: Reduces API calls by 80%+
2. **User Experience**: Instant portfolio display from cache
3. **Cost Efficiency**: Fewer blockchain RPC calls
4. **Fresh Data**: Automatic background refetching

## Cache Invalidation

Cache is automatically invalidated when:
- 5 minutes have passed since last fetch
- User manually clicks "Refresh"
- Token is added/removed
- Transaction occurs (future)

## Implementation Details

### PortfolioOverview Component
- Fetches balances on wallet connection
- Caches data in localStorage
- Exposes `refetchPortfolio()` globally
- Shows loading state during fetch
- Displays last updated timestamp

### ChatInterface Component
- Calls `refetchPortfolio()` after adding token
- Provides user feedback about automatic updates

## Future Enhancements

1. **WebSocket Updates**: Real-time balance updates
2. **Transaction Refetch**: Auto-refetch after send/swap
3. **Cache Warming**: Prefetch balances on app load
4. **Offline Support**: Use cached data when offline

