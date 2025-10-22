import { BaseKnowledgeDocument } from './pinecone-knowledge'

export interface BaseKnowledgeCategory {
  id: string
  name: string
  description: string
  documents: BaseKnowledgeDocument[]
}

export const BASE_KNOWLEDGE_CATEGORIES: BaseKnowledgeCategory[] = [
  {
    id: 'introduction',
    name: 'Introduction to Base',
    description: 'Basic information about what Base is and its purpose',
    documents: [
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
      }
    ]
  },
  {
    id: 'technology',
    name: 'Base Technology',
    description: 'Technical details about how Base works',
    documents: [
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
      }
    ]
  },
  {
    id: 'benefits',
    name: 'Base Benefits',
    description: 'Advantages and benefits of using Base',
    documents: [
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
      }
    ]
  },
  {
    id: 'defi',
    name: 'DeFi on Base',
    description: 'Decentralized Finance applications and protocols on Base',
    documents: [
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
      }
    ]
  },
  {
    id: 'transactions',
    name: 'Transactions and Usage',
    description: 'How to use Base for transactions and interactions',
    documents: [
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
      }
    ]
  },
  {
    id: 'development',
    name: 'Development on Base',
    description: 'Building applications and smart contracts on Base',
    documents: [
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
      }
    ]
  },
  {
    id: 'ecosystem',
    name: 'Base Ecosystem',
    description: 'Projects, applications, and partners in the Base ecosystem',
    documents: [
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
      }
    ]
  },
  {
    id: 'comparison',
    name: 'Base vs Others',
    description: 'Comparisons between Base and other blockchain solutions',
    documents: [
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
  }
]

export function getAllBaseKnowledgeDocuments(): BaseKnowledgeDocument[] {
  return BASE_KNOWLEDGE_CATEGORIES.flatMap(category => category.documents)
}

export function getBaseKnowledgeByCategory(categoryId: string): BaseKnowledgeDocument[] {
  const category = BASE_KNOWLEDGE_CATEGORIES.find(cat => cat.id === categoryId)
  return category ? category.documents : []
}

export function searchBaseKnowledge(query: string): BaseKnowledgeDocument[] {
  const allDocs = getAllBaseKnowledgeDocuments()
  const queryLower = query.toLowerCase()
  
  return allDocs.filter(doc => 
    doc.content.toLowerCase().includes(queryLower) ||
    doc.title.toLowerCase().includes(queryLower) ||
    doc.category.toLowerCase().includes(queryLower)
  )
}
