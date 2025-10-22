import { baseKnowledgeCollector } from './base-knowledge-collector'

// Initial Base knowledge entries
const initialBaseKnowledge = [
  {
    content: `Base is a Layer 2 blockchain built on Ethereum that offers fast, cheap, and secure transactions. Base is designed to be the home for Coinbase's onchain products and an open ecosystem where anyone can build.

Key Features:
- **Low Fees**: Transactions cost less than $0.01
- **Fast Transactions**: Near-instant finality
- **Ethereum Security**: Inherits security from Ethereum mainnet
- **Developer Friendly**: Easy to build and deploy dApps
- **Coinbase Integration**: Seamless integration with Coinbase products

Base uses Optimistic Rollup technology to scale Ethereum while maintaining security and decentralization.`,
    source: 'manual',
    category: 'getting-started',
    title: 'What is Base Blockchain?',
    url: 'https://docs.base.org'
  },
  {
    content: `Base Bridge allows you to move assets between Ethereum mainnet and Base. You can bridge ETH, ERC-20 tokens, and NFTs.

How to Bridge:
1. Go to bridge.base.org
2. Connect your wallet
3. Select the token you want to bridge
4. Enter the amount
5. Confirm the transaction

Bridge Fees:
- Ethereum to Base: Pay gas fees on Ethereum
- Base to Ethereum: Pay gas fees on Base (very low)

Security: Base Bridge is secured by Ethereum's security model and has been audited by multiple security firms.`,
    source: 'manual',
    category: 'bridge',
    title: 'How to Bridge Assets to Base',
    url: 'https://bridge.base.org'
  },
  {
    content: `Base supports all standard Ethereum tools and infrastructure:

**Wallets**: MetaMask, Coinbase Wallet, Rainbow, WalletConnect
**Development Tools**: Hardhat, Foundry, Remix, Truffle
**RPC Endpoints**: 
- Mainnet: https://mainnet.base.org
- Testnet: https://sepolia.base.org

**Block Explorer**: https://basescan.org
**Faucet**: https://bridge.base.org/deposit (for testnet ETH)

**Gas Fees**: Base uses ETH for gas fees, but they're much cheaper than Ethereum mainnet.`,
    source: 'manual',
    category: 'technical',
    title: 'Base Development Tools and Infrastructure',
    url: 'https://docs.base.org'
  },
  {
    content: `Base offers several advantages over traditional banking and other blockchains:

**vs Traditional Banking**:
- 24/7 availability
- Global access
- Lower fees ($0.01 vs $15+ for international transfers)
- No intermediaries
- Programmable money

**vs Ethereum Mainnet**:
- 10x lower fees
- Faster transactions
- Same security
- Full EVM compatibility

**vs Other L2s**:
- Coinbase backing and integration
- Focus on user experience
- Strong developer ecosystem
- Regulatory compliance focus`,
    source: 'manual',
    category: 'general',
    title: 'Base Advantages and Comparisons',
    url: 'https://docs.base.org'
  },
  {
    content: `Base supports all ERC-20 tokens and NFTs. Popular tokens on Base include:

**Native Tokens**:
- ETH (Ethereum)
- USDC (USD Coin)
- USDT (Tether)

**DeFi Tokens**:
- DAI (MakerDAO)
- WETH (Wrapped Ethereum)
- Various DeFi protocol tokens

**NFTs**: All ERC-721 and ERC-1155 NFTs can be bridged to Base

**Adding Custom Tokens**:
1. Get the token contract address
2. Add it to your wallet
3. The token will appear in your portfolio

Base is EVM compatible, so any Ethereum token can be used on Base.`,
    source: 'manual',
    category: 'tokens',
    title: 'Supported Tokens on Base',
    url: 'https://docs.base.org'
  },
  {
    content: `Base is designed to be the most secure and compliant Layer 2 blockchain:

**Security Features**:
- Inherits Ethereum's security model
- Optimistic rollup with fraud proofs
- Multiple security audits
- Bug bounty program

**Compliance**:
- Built by Coinbase (publicly traded company)
- Follows regulatory guidelines
- KYC/AML compliance where required
- Transparent operations

**Decentralization**:
- Open source code
- Community governance
- Multiple validators
- No single point of failure

Base prioritizes security and compliance while maintaining the benefits of blockchain technology.`,
    source: 'manual',
    category: 'security',
    title: 'Base Security and Compliance',
    url: 'https://docs.base.org'
  }
]

export async function addInitialBaseKnowledge(): Promise<void> {
  console.log('Adding initial Base knowledge...')
  
  try {
    await baseKnowledgeCollector.addManualKnowledge(initialBaseKnowledge)
    console.log('Initial Base knowledge added successfully!')
  } catch (error) {
    console.error('Error adding initial Base knowledge:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  addInitialBaseKnowledge()
    .then(() => {
      console.log('Setup complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Setup failed:', error)
      process.exit(1)
    })
}
