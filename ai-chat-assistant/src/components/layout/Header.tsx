import React from 'react'
import { Bot} from 'lucide-react'

const Header = () => {
  return (
     <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">AI Assistant</h1>
      </div>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Your intelligent companion with real-time data access
      </p>
    </div>
  )
}

export default Header
