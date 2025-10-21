import { ChatInterface } from '@/components/ChatInterface'
import { QuickActions } from '@/components/QuickActions'

export default function ChatPage() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] pb-16 md:pb-0 bg-gray-50">

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden max-w-[1280px] mx-auto w-full">
        <ChatInterface />
      </div>
    </main>
  )
}

