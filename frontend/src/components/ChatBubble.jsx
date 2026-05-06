import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const { chatMessages, sendChatMessage, isStreaming } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  // Don't show on landing or chat page
  if (location.pathname === '/' || location.pathname === '/chat') return null

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return
    const msg = input.trim()
    setInput('')
    await sendChatMessage(msg)
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="chat-bubble" id="chat-bubble-btn">
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 h-[500px] glass-card flex flex-col shadow-2xl animate-scale-in" id="chat-popup">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">BizNova AI</p>
            <p className="text-xs text-emerald-400">{isStreaming ? '● Typing...' : '● Online'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/chat')}
            className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Full Chat →
          </button>
          <button onClick={() => setIsOpen(false)} className="text-dark-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.slice(-8).map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-md'
                : 'bg-dark-700/80 text-dark-200 rounded-bl-md'
            }`}>
              {msg.content}
              {msg.isStreaming && <span className="inline-block w-1.5 h-3.5 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-emerald to-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-700/50">
        <div className="flex items-center gap-2">
          <input type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..." disabled={isStreaming}
            className="input-field text-sm py-2" id="chat-bubble-input"
          />
          <button onClick={handleSend} disabled={isStreaming || !input.trim()}
            className="p-2 bg-brand-600 rounded-xl text-white hover:bg-brand-500 transition-colors disabled:opacity-50" id="chat-bubble-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
