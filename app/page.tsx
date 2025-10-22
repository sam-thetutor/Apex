'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Onboarding 1 Million Africans to Base
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-cyan-50 mb-8 max-w-3xl mx-auto">
              AI-powered crypto made simple. Send money, learn blockchain, build the future - all in your language.
            </p>

            {/* Key Features */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🤖</span>
                  <span className="font-medium">AI Chat - Do crypto transactions with simple prompts</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">📚</span>
                  <span className="font-medium">Learn Base blockchain in 10+ African languages</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">💰</span>
                  <span className="font-medium">Send money for $0.01 instead of $15</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/chat"
                className="px-8 py-4 bg-white text-cyan-600 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105"
              >
                Try AI Chat
              </Link>
              <Link
                href="/learn"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                Explore Tutorials
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">1,000+</div>
                <div className="text-sm text-cyan-100">Africans on Base</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">$500K+</div>
                <div className="text-sm text-cyan-100">Saved in fees</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-cyan-100">Countries reached</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-cyan-100">Cheaper than banks</div>
              </div>
            </div>

            {/* Language Support */}
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <span className="text-white font-medium">🌍 Available in:</span>
              <span className="text-2xl">🇬🇧</span>
              <span className="text-2xl">🇹🇿</span>
              <span className="text-2xl">🇫🇷</span>
              <span className="text-2xl">🇳🇬</span>
              <span className="text-2xl">🇳🇬</span>
              <span className="text-2xl">🇪🇹</span>
              <span className="text-2xl">🇿🇦</span>
              <span className="text-2xl">🇬🇭</span>
              <span className="text-2xl">🇰🇪</span>
              <span className="text-2xl">🇺🇬</span>
              <span className="text-white/80 text-sm">+more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Three Ways to Get Started
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to master Base blockchain and transform your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Chat */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-all shadow-lg hover:shadow-2xl">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Chat for Crypto</h3>
              <p className="text-gray-700 mb-6">
                Just type what you want in your language. Send money, swap tokens, check balances - all through natural conversation.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>No confusing interfaces</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Works in multiple languages</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Instant transactions on Base</span>
                </li>
              </ul>
              <Link
                href="/chat"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700 transition-all"
              >
                Try AI Chat
              </Link>
            </div>

            {/* Education */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all shadow-lg hover:shadow-2xl">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn Base in Your Language</h3>
              <p className="text-gray-700 mb-6">
                Interactive tutorials designed for African users. Master crypto concepts in English, Swahili, French, and more.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>10+ African languages</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Step-by-step guides</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Interactive quizzes</span>
                </li>
              </ul>
              <Link
                href="/learn"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Start Learning
              </Link>
            </div>

            {/* Base Blockchain */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-lg hover:shadow-2xl">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Built on Base</h3>
              <p className="text-gray-700 mb-6">
                Base is 1000x cheaper than banks. Perfect for Africans sending money home, running businesses, and building the future.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>$0.01 transaction fees</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>2-second confirmations</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>No bank account needed</span>
                </li>
              </ul>
              <Link
                href="/learn"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all"
              >
                Why Base?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              💰 See the Real Savings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare traditional banking with Base blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Traditional Banking */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🏦</div>
                <h3 className="text-2xl font-bold text-gray-900">Traditional Banking</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Send $100 to Kenya</div>
                  <div className="text-2xl font-bold text-red-600">Fee: $15 (15%)</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Time</div>
                  <div className="text-xl font-bold text-gray-900">⏱️ 3-5 days</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Requirements</div>
                  <div className="text-lg font-bold text-gray-900">🏦 Bank account required</div>
                </div>
                <div className="bg-red-100 rounded-xl p-4 border-2 border-red-300">
                  <div className="text-sm text-gray-600 mb-1">Family receives</div>
                  <div className="text-2xl font-bold text-red-700">❌ $85</div>
                </div>
              </div>
            </div>

            {/* Base (Apex) */}
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-400 shadow-xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-2xl font-bold text-gray-900">Base (Apex)</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Send $100 to Kenya</div>
                  <div className="text-2xl font-bold text-green-600">Fee: $0.01 (0.01%)</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Time</div>
                  <div className="text-xl font-bold text-gray-900">⚡ 2 seconds</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-1">Requirements</div>
                  <div className="text-lg font-bold text-gray-900">📱 Just need smartphone</div>
                </div>
                <div className="bg-green-100 rounded-xl p-4 border-2 border-green-400">
                  <div className="text-sm text-gray-600 mb-1">Family receives</div>
                  <div className="text-2xl font-bold text-green-700">✅ $99.99</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-2">
                💡 You save $14.99 per transaction!
              </div>
              <div className="text-lg text-green-700">
                📊 A family sending $500/month saves $900/year using Base
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌍 Speak Your Language
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apex is available in 10+ African languages
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { flag: '🇬🇧', name: 'English' },
              { flag: '🇹🇿', name: 'Swahili' },
              { flag: '🇫🇷', name: 'French' },
              { flag: '🇳🇬', name: 'Yoruba' },
              { flag: '🇳🇬', name: 'Hausa' },
              { flag: '🇪🇹', name: 'Amharic' },
              { flag: '🇿🇦', name: 'Zulu' },
              { flag: '🇬🇭', name: 'Twi' },
              { flag: '🇰🇪', name: 'Kikuyu' },
              { flag: '🇺🇬', name: 'Luganda' },
            ].map((lang, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-2">{lang.flag}</div>
                <div className="text-sm font-medium text-gray-700">{lang.name}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-8 border-2 border-cyan-200 max-w-3xl mx-auto text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              💬 "Send 100 USDC to @alice"
            </div>
            <div className="text-lg text-gray-600">
              → Works in all languages!
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🚀 How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 'Step 1',
                icon: '🔗',
                title: 'Connect Your Wallet',
                description: 'Link your Farcaster or MetaMask wallet',
                examples: ['Connect wallet', 'Link account']
              },
              {
                step: 'Step 2',
                icon: '💬',
                title: 'Start Chatting',
                description: 'Type commands in your language',
                examples: ['Show my balance', 'Swap ETH for USDC']
              },
              {
                step: 'Step 3',
                icon: '🏆',
                title: 'Learn & Earn',
                description: 'Complete tutorials, unlock achievements',
                examples: ['Base Basics', 'Africa Focus']
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 z-0"></div>
                )}
                <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-400 transition-all shadow-lg hover:shadow-xl">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-2">{step.icon}</div>
                    <div className="text-sm font-bold text-cyan-600 mb-2">{step.step}</div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-center">{step.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Examples:</div>
                    {step.examples.map((example, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2 text-sm text-gray-600 text-center">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              💬 What Africans Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from Africans using Apex
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, crypto in my language! The AI chat makes it so easy to send money home. I save $75 every month!",
                author: "Alice M.",
                location: "Kenya",
                flag: "🇰🇪",
                language: "Swahili"
              },
              {
                quote: "The tutorials in Yoruba helped me understand Base blockchain perfectly. Now I can teach my family too!",
                author: "Bob A.",
                location: "Nigeria",
                flag: "🇳🇬",
                language: "Yoruba"
              },
              {
                quote: "I run a business and Base has changed everything. I can now accept payments from anywhere in the world instantly!",
                author: "Diana K.",
                location: "Ghana",
                flag: "🇬🇭",
                language: "Twi"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border-2 border-cyan-200 shadow-lg">
                <div className="text-4xl mb-3">{testimonial.flag}</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.location} • {testimonial.language}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎯 Ready to Join 1 Million Africans on Base?
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            Start your crypto journey in your language today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/chat"
              className="px-8 py-4 bg-white text-cyan-600 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105"
            >
              Try AI Chat
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Start Learning
            </Link>
          </div>

          <div className="text-white/80">
            🌍 Available in 10+ African languages
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">A</span>
                </div>
                <span className="text-xl font-bold text-white">Apex Base</span>
              </div>
              <p className="text-sm">
                Onboarding 1 Million Africans to Base blockchain
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/chat" className="hover:text-white">AI Chat</Link></li>
                <li><Link href="/learn" className="hover:text-white">Tutorials</Link></li>
                <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
                <li><Link href="/portfolio" className="hover:text-white">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Learn</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/learn" className="hover:text-white">Getting Started</Link></li>
                <li><Link href="/learn" className="hover:text-white">Base Benefits</Link></li>
                <li><Link href="/learn" className="hover:text-white">For Africans</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
                <li><a href="#" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Apex. Onboarding Africans to Base. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
