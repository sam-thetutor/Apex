import { HelpContent } from '@/components/HelpContent'

export default function HelpPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-gray-50">
      {/* Help Content */}
      <div className="flex-1 overflow-y-auto max-w-[1280px] mx-auto w-full">
        <HelpContent />
      </div>
    </main>
  )
}

