# Environment Setup for Groq Integration

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Pinecone Configuration  
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=base-knowledge

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DATABASE_NAME=apex

# Base Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453
```

## Getting Groq API Key

1. Go to https://console.groq.com/
2. Sign up for a free account
3. Create an API key
4. Add it to your `.env.local` file

## Installation

The system now uses the Groq SDK directly (no LangChain wrapper needed):

```bash
npm install groq-sdk
```

## Benefits of Groq

- **Faster responses**: Groq offers ultra-fast inference (0.5-1 second)
- **Cost-effective**: 90% cheaper than OpenAI
- **High-quality models**: Access to Llama 3.1 70B and other models
- **No quota limits**: Generous free tier
- **Direct SDK**: No LangChain wrapper needed

## Model Used

- **Primary Model**: `llama-3.3-70b-versatile`
- **Temperature**: 0.3 for structured responses, 0.7 for creative answers
- **Speed**: Typically 5-10x faster than OpenAI GPT-4
- **Implementation**: Direct Groq SDK calls
