'use client'

export function QuickActions() {
  const actions = [
    { 
      label: 'Send', 
      action: 'send',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      )
    },
    { 
      label: 'Swap', 
      action: 'swap',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      label: 'Balance', 
      action: 'balance',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="flex gap-2">
      {actions.map((action) => (
        <button
          key={action.action}
          className="flex-1 flex flex-col items-center gap-2 px-3 py-3 bg-white/60 backdrop-blur-md hover:bg-white/80 rounded-xl transition-all border border-white/40 shadow-lg hover:shadow-xl"
        >
          <div className="text-primary-600">{action.icon}</div>
          <span className="text-xs font-medium text-gray-700">{action.label}</span>
        </button>
      ))}
    </div>
  )
}

