import { PortfolioOverview } from '@/components/PortfolioOverview'

export default function PortfolioPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-gray-50">
      {/* Portfolio Content */}
      <div className="flex-1 overflow-y-auto max-w-[1280px] mx-auto w-full">
        <PortfolioOverview />
      </div>
    </main>
  )
}

