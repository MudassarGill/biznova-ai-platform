import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Send, Bot, User, Sparkles, Lightbulb, BarChart3,
  TrendingUp, FileText, Trash2, RefreshCw
} from 'lucide-react'

const suggestions = [
  { icon: Lightbulb, text: 'What business idea suits a $50K budget?' },
  { icon: BarChart3, text: 'Analyze the SaaS market in Austin' },
  { icon: TrendingUp, text: 'What are the growth trends in FinTech?' },
  { icon: FileText, text: 'Create a marketing plan for my app' },
]

function ChatPage() {
  const { chatMessages, sendChatMessage } = useApp()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setIsTyping(true)
    await sendChatMessage(msg)
    setIsTyping(false)
    inputRef.current?.focus()
  }

  const handleSuggestion = async (text) => {
    setIsTyping(true)
    await sendChatMessage(text)
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="glass-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">BizNova AI Assistant</h2>
            <p className="text-xs text-emerald-400">● Always ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost p-2" title="Clear chat" id="clear-chat">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="btn-ghost p-2" title="Refresh" id="refresh-chat">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto glass-card p-6 mb-4 space-y-6">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-accent-emerald to-green-600'
                : 'bg-gradient-to-br from-brand-500 to-accent-cyan'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message */}
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <p className="text-xs text-dark-500 mb-1">
                {msg.role === 'user' ? 'You' : 'BizNova AI'}
              </p>
              <div
                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-md'
                    : 'bg-dark-700/80 text-dark-200 rounded-tl-md border border-dark-600/50'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-5 py-3.5 bg-dark-700/80 rounded-2xl rounded-tl-md border border-dark-600/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {chatMessages.length <= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {suggestions.map(({ icon: Icon, text }) => (
            <button
              key={text}
              onClick={() => handleSuggestion(text)}
              className="flex items-center gap-3 p-3 glass-card-hover text-left text-sm group"
            >
              <Icon className="w-4 h-4 text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-dark-300 group-hover:text-white transition-colors">{text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about business ideas, market trends, strategies..."
              className="input-field pr-12"
              id="chat-input"
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary p-3 rounded-xl disabled:opacity-50"
            id="chat-send-btn"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-dark-500 mt-2 text-center">
          BizNova AI provides data-driven insights. Always verify critical business decisions independently.
        </p>
      </div>
    </div>
  )
}

export default ChatPage
