import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  Send, Bot, User, Sparkles, Lightbulb, BarChart3,
  TrendingUp, FileText, Trash2, RefreshCw, Plus,
  MessageSquare, Upload, X, FileUp, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Clock, Search as SearchIcon
} from 'lucide-react'

const suggestions = [
  { icon: Lightbulb, text: 'What business idea suits a $50K budget?' },
  { icon: BarChart3, text: 'Analyze the SaaS market in Austin' },
  { icon: TrendingUp, text: 'What are the growth trends in FinTech?' },
  { icon: FileText, text: 'Create a marketing plan for my app' },
]

/* ── Simple Markdown Renderer ─────────────────────────────────────────── */
function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-dark-700 px-1.5 py-0.5 rounded text-brand-300 text-xs">$1</code>')
    .replace(/^### (.+)$/gm, '<h4 class="text-white font-semibold mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-white font-bold mt-4 mb-2 text-base">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="text-white font-bold mt-4 mb-2 text-lg">$1</h2>')
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc text-dark-200">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-dark-200">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
  return html
}

function ChatPage() {
  const {
    chatMessages, sendChatMessage, isStreaming,
    chatSessions, currentSessionId,
    createChatSession, loadSessionMessages, deleteChatSession,
    clearChatMessages, loadChatSessions,
    documents, uploadDocument, deleteDocument,
    useRag, setUseRag,
  } = useApp()

  const [input, setInput] = useState('')
  const [showSessions, setShowSessions] = useState(true)
  const [showDocPanel, setShowDocPanel] = useState(false)
  const [sessionSearch, setSessionSearch] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return
    const msg = input.trim()
    setInput('')
    await sendChatMessage(msg)
    inputRef.current?.focus()
  }

  const handleSuggestion = async (text) => {
    if (isStreaming) return
    await sendChatMessage(text)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) { await uploadDocument(file); e.target.value = '' }
  }

  const filteredSessions = chatSessions.filter(s =>
    s.title.toLowerCase().includes(sessionSearch.toLowerCase())
  )

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now - d
    if (diff < 86400000) return 'Today'
    if (diff < 172800000) return 'Yesterday'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] max-w-6xl mx-auto gap-4">
      {/* ═══ Session Sidebar (LTM) ═══ */}
      {showSessions && (
        <div className="w-72 flex-shrink-0 glass-card flex flex-col animate-fade-in">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-dark-700/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" /> Chat History
              </h3>
              <button onClick={() => setShowSessions(false)} className="text-dark-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={createChatSession}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 transition-all text-sm font-medium"
              id="new-chat-btn"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <div className="relative mt-2">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-500" />
              <input
                type="text" placeholder="Search chats..." value={sessionSearch}
                onChange={e => setSessionSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-dark-800/50 border border-dark-700/50 rounded-lg text-xs text-dark-200 placeholder-dark-500 outline-none focus:border-brand-500/50"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.length === 0 ? (
              <p className="text-xs text-dark-500 text-center py-8">No conversations yet</p>
            ) : filteredSessions.map(session => (
              <button
                key={session.id}
                onClick={() => loadSessionMessages(session.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all group flex items-start justify-between gap-2 ${
                  currentSessionId === session.id
                    ? 'bg-brand-600/20 border border-brand-500/30 text-white'
                    : 'hover:bg-dark-700/50 text-dark-300 border border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{session.title}</p>
                  <p className="text-dark-500 mt-0.5">{formatDate(session.updated_at)} · {session.message_count} msgs</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChatSession(session.id) }}
                  className="opacity-0 group-hover:opacity-100 text-dark-500 hover:text-rose-400 transition-all flex-shrink-0 mt-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
          </div>

          {/* Documents Section */}
          <div className="border-t border-dark-700/50 p-3">
            <button onClick={() => setShowDocPanel(!showDocPanel)}
              className="w-full flex items-center justify-between text-xs font-semibold text-dark-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2"><FileUp className="w-3.5 h-3.5" /> Documents ({documents.length})</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDocPanel ? 'rotate-90' : ''}`} />
            </button>
            {showDocPanel && (
              <div className="mt-2 space-y-1.5 animate-fade-in">
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs hover:bg-accent-emerald/20 transition-all"
                >
                  <Upload className="w-3 h-3" /> Upload PDF/TXT
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-dark-800/50 text-xs">
                    <span className="truncate text-dark-300 flex-1">{doc.filename}</span>
                    <button onClick={() => deleteDocument(doc.id)} className="text-dark-500 hover:text-rose-400 ml-2 flex-shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Main Chat Area ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!showSessions && (
              <button onClick={() => setShowSessions(true)} className="btn-ghost p-2 mr-1">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">BizNova AI Assistant</h2>
              <p className="text-xs text-emerald-400">
                {isStreaming ? '● Generating...' : '● Always ready to help'}
                {documents.length > 0 && <span className="text-dark-500 ml-2">| {documents.length} doc(s) loaded</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* RAG Toggle */}
            {documents.length > 0 && (
              <button
                onClick={() => setUseRag(!useRag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  useRag ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30' : 'bg-dark-700/50 text-dark-400 border border-dark-700'
                }`}
                title={useRag ? 'CRAG enabled — answers from your documents' : 'Click to search your documents'}
              >
                {useRag ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                CRAG
              </button>
            )}
            <button onClick={clearChatMessages} className="btn-ghost p-2" title="Clear chat" id="clear-chat">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={loadChatSessions} className="btn-ghost p-2" title="Refresh" id="refresh-chat">
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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-accent-emerald to-green-600'
                  : 'bg-gradient-to-br from-brand-500 to-accent-cyan'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <p className="text-xs text-dark-500 mb-1">{msg.role === 'user' ? 'You' : 'BizNova AI'}</p>
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-md'
                    : 'bg-dark-700/80 text-dark-200 rounded-tl-md border border-dark-600/50'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-brand-400 ml-0.5 animate-pulse rounded-sm" />
                      )}
                    </div>
                  ) : msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming Indicator (when no content yet) */}
          {isStreaming && chatMessages[chatMessages.length - 1]?.content === '' && (
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
        {chatMessages.length <= 2 && !isStreaming && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {suggestions.map(({ icon: Icon, text }) => (
              <button key={text} onClick={() => handleSuggestion(text)}
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
                ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={useRag ? "Ask about your uploaded documents..." : "Ask about business ideas, market trends, strategies..."}
                className="input-field pr-12" id="chat-input" disabled={isStreaming}
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            </div>
            <button onClick={handleSend} disabled={!input.trim() || isStreaming}
              className="btn-primary p-3 rounded-xl disabled:opacity-50" id="chat-send-btn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-dark-500 mt-2 text-center">
            {useRag
              ? '🔍 CRAG Mode — Answers grounded in your uploaded documents'
              : 'BizNova AI provides data-driven insights. Always verify critical business decisions independently.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
