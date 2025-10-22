#!/bin/bash

# Groq SDK Installation Script
echo "🚀 Installing Groq SDK..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install Node.js and npm first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Install groq-sdk
echo "📦 Installing groq-sdk..."
npm install groq-sdk

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Groq SDK installed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Get your Groq API key from: https://console.groq.com/"
    echo "2. Add GROQ_API_KEY=your_key_here to your .env.local file"
    echo "3. Restart your development server"
    echo ""
    echo "🎯 Benefits:"
    echo "• 5-10x faster responses than OpenAI"
    echo "• 90% cost reduction"
    echo "• No quota limits"
else
    echo "❌ Installation failed. Please check your internet connection and try again."
    exit 1
fi

