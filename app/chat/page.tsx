import { ChatInterface } from '@/components/ChatInterface'
import { QuickActions } from '@/components/QuickActions'

export default function ChatPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-gray-50">
      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <QuickActions />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  )
}

