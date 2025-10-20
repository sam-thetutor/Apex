# Apex Base - AI Token Assistant

AI-powered token management on Base blockchain. Send, receive, and swap tokens through natural language using Farcaster integration.

## Features

- 🤖 **AI-Powered Chat Interface** - Natural language commands for token operations
- 🔐 **Farcaster Integration** - Seamless wallet connection within Farcaster
- 💼 **Multi-Wallet Support** - Farcaster and MetaMask compatibility
- 📊 **Real-Time Balance Tracking** - Live balance fetching from Base network
- 🎨 **Modern Glassmorphism UI** - Beautiful, responsive design
- ⚡ **Base Network** - Built for Base Layer 2

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** LangChain, OpenAI GPT-4
- **Blockchain:** ethers.js, Base Network
- **Wallet:** Farcaster Mini App SDK, MetaMask

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Base network access

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Apex
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables:**
   In the Vercel dashboard, add these environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NEXT_PUBLIC_SITE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

### Step 3: Update Farcaster Configuration

After deployment, update your Farcaster Mini App configuration with your Vercel URL.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your app's public URL | Yes (for production) |

## Project Structure

```
Apex/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── ai/           # AI processing endpoints
│   ├── chat/             # Chat page
│   ├── portfolio/        # Portfolio page
│   ├── transactions/     # Transaction history
│   └── help/             # Help page
├── components/            # React components
│   ├── ChatInterface.tsx
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   └── ...
├── contexts/              # React contexts
│   └── WalletContext.tsx
├── lib/                   # Utility libraries
│   ├── ai/               # AI tools and parsers
│   ├── blockchain/       # Blockchain utilities
│   └── tokens/           # Token configurations
└── public/               # Static assets
```

## Usage

### Chat Commands

- **Check Balance:** "How much ETH do I have?"
- **View Portfolio:** "What's my portfolio?"
- **Send Tokens:** "Send 100 USDC to @username"
- **Swap Tokens:** "Swap 0.5 ETH for USDC"
- **Get Help:** "help"

### Supported Tokens

- ETH (Native)
- USDC (USD Coin)
- DAI (Dai Stablecoin)

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Build Errors

If you encounter build errors related to peer dependencies:
```bash
npm install --legacy-peer-deps
```

### Wallet Connection Issues

- Make sure you're using a supported browser
- Check that MetaMask is installed (for standalone mode)
- Verify Farcaster integration settings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Base ecosystem
