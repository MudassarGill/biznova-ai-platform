import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext()
const API_BASE = 'http://localhost:8000'

// ─── Mock Data (Fallback when backend is unreachable) ───
const mockBusinessIdeas = [
  { id: 1, title: 'AI-Powered Personal Finance App', description: 'A mobile application that uses machine learning to analyze spending patterns, provide personalized budgeting advice, and automate savings goals.', category: 'FinTech', successScore: 87, investmentRequired: '$50,000 - $120,000', timeToMarket: '4-6 months', marketDemand: 'High', competition: 'Medium', growthRate: '+24%', tags: ['AI/ML', 'Mobile', 'Finance'] },
  { id: 2, title: 'Sustainable Food Delivery Platform', description: 'An eco-friendly food delivery service connecting local organic restaurants with health-conscious consumers, using electric vehicle fleet.', category: 'FoodTech', successScore: 74, investmentRequired: '$80,000 - $200,000', timeToMarket: '6-9 months', marketDemand: 'Very High', competition: 'High', growthRate: '+18%', tags: ['Sustainability', 'Delivery', 'Health'] },
  { id: 3, title: 'Remote Team Collaboration Suite', description: 'An all-in-one platform combining project management, video conferencing, and AI-assisted task prioritization for distributed teams.', category: 'SaaS', successScore: 91, investmentRequired: '$100,000 - $250,000', timeToMarket: '8-12 months', marketDemand: 'Very High', competition: 'High', growthRate: '+32%', tags: ['SaaS', 'Productivity', 'AI'] },
  { id: 4, title: 'Smart Home Energy Management', description: 'IoT-based system that monitors and optimizes household energy consumption using AI predictions and automated device control.', category: 'CleanTech', successScore: 79, investmentRequired: '$150,000 - $350,000', timeToMarket: '10-14 months', marketDemand: 'High', competition: 'Low', growthRate: '+28%', tags: ['IoT', 'Energy', 'Smart Home'] },
  { id: 5, title: 'AI Content Creation Studio', description: 'A platform that uses generative AI to create marketing content, social media posts, and brand visuals with one-click publishing.', category: 'MarTech', successScore: 83, investmentRequired: '$30,000 - $80,000', timeToMarket: '3-5 months', marketDemand: 'Very High', competition: 'Medium', growthRate: '+45%', tags: ['GenAI', 'Marketing', 'Content'] },
  { id: 6, title: 'Telemedicine Platform for Rural Areas', description: 'A healthcare platform connecting rural patients with specialists via AI-assisted diagnosis, video consultations, and prescription delivery.', category: 'HealthTech', successScore: 68, investmentRequired: '$200,000 - $500,000', timeToMarket: '12-18 months', marketDemand: 'High', competition: 'Low', growthRate: '+21%', tags: ['Healthcare', 'AI', 'Telemedicine'] },
]

const mockMarketData = {
  demandTrends: [
    { month: 'Jan', demand: 65, growth: 12 }, { month: 'Feb', demand: 72, growth: 15 },
    { month: 'Mar', demand: 68, growth: 14 }, { month: 'Apr', demand: 85, growth: 22 },
    { month: 'May', demand: 90, growth: 25 }, { month: 'Jun', demand: 88, growth: 24 },
    { month: 'Jul', demand: 95, growth: 28 }, { month: 'Aug', demand: 102, growth: 32 },
    { month: 'Sep', demand: 98, growth: 30 }, { month: 'Oct', demand: 110, growth: 35 },
    { month: 'Nov', demand: 115, growth: 38 }, { month: 'Dec', demand: 120, growth: 42 },
  ],
  cityDemand: [
    { city: 'Karachi', demand: 95, competition: 72, score: 82 },
    { city: 'Lahore', demand: 92, competition: 68, score: 85 },
    { city: 'Islamabad', demand: 88, competition: 55, score: 89 },
    { city: 'Rawalpindi', demand: 78, competition: 50, score: 80 },
    { city: 'Faisalabad', demand: 72, competition: 42, score: 82 },
    { city: 'Multan', demand: 68, competition: 38, score: 84 },
    { city: 'Peshawar', demand: 65, competition: 45, score: 76 },
    { city: 'Quetta', demand: 58, competition: 32, score: 78 },
  ],
  competitors: [
    { name: 'Competitor A', marketShare: 28, growth: 12, threat: 'High' },
    { name: 'Competitor B', marketShare: 22, growth: 8, threat: 'Medium' },
    { name: 'Competitor C', marketShare: 15, growth: 18, threat: 'High' },
    { name: 'Competitor D', marketShare: 10, growth: 5, threat: 'Low' },
    { name: 'Others', marketShare: 25, growth: 10, threat: 'Medium' },
  ],
}

const mockForecastData = {
  predictions: [
    { month: 'Jan 25', actual: 120, predicted: 118, lower: 110, upper: 126 },
    { month: 'Feb 25', actual: 125, predicted: 122, lower: 114, upper: 130 },
    { month: 'Mar 25', actual: 130, predicted: 128, lower: 120, upper: 136 },
    { month: 'Apr 25', actual: null, predicted: 135, lower: 125, upper: 145 },
    { month: 'May 25', actual: null, predicted: 142, lower: 130, upper: 154 },
    { month: 'Jun 25', actual: null, predicted: 148, lower: 134, upper: 162 },
    { month: 'Jul 25', actual: null, predicted: 155, lower: 138, upper: 172 },
    { month: 'Aug 25', actual: null, predicted: 162, lower: 142, upper: 182 },
    { month: 'Sep 25', actual: null, predicted: 168, lower: 146, upper: 190 },
    { month: 'Oct 25', actual: null, predicted: 175, lower: 150, upper: 200 },
    { month: 'Nov 25', actual: null, predicted: 182, lower: 155, upper: 209 },
    { month: 'Dec 25', actual: null, predicted: 190, lower: 160, upper: 220 },
  ],
  riskIndicators: [
    { label: 'Market Volatility', value: 35, status: 'low' },
    { label: 'Regulatory Risk', value: 22, status: 'low' },
    { label: 'Competition Growth', value: 65, status: 'medium' },
    { label: 'Tech Disruption', value: 48, status: 'medium' },
  ],
}

const mockBusinessPlan = {
  overview: { title: 'AI-Powered Personal Finance App', mission: 'Democratize financial intelligence by making AI-driven personal finance management accessible to everyone.', vision: 'Become the leading AI-powered personal finance platform, helping 10 million users achieve financial freedom by 2027.', targetMarket: 'Millennials and Gen-Z professionals (25-40) with annual income $40K-$150K who want smarter money management.', uniqueValue: 'Unlike traditional budgeting apps, we use predictive AI to anticipate expenses, identify saving opportunities, and automate wealth-building strategies.' },
  investment: { totalRequired: '$85,000', breakdown: [{ category: 'Development', amount: 35000, percentage: 41 }, { category: 'Marketing', amount: 20000, percentage: 24 }, { category: 'Operations', amount: 12000, percentage: 14 }, { category: 'Legal & Compliance', amount: 8000, percentage: 9 }, { category: 'Reserve Fund', amount: 10000, percentage: 12 }], revenueProjection: [{ quarter: 'Q1', revenue: 5000, users: 500 }, { quarter: 'Q2', revenue: 18000, users: 2200 }, { quarter: 'Q3', revenue: 45000, users: 5800 }, { quarter: 'Q4', revenue: 85000, users: 12000 }] },
  marketing: { channels: [{ name: 'Social Media Marketing', budget: '$8,000', roi: '320%', priority: 'High' }, { name: 'Content Marketing & SEO', budget: '$5,000', roi: '450%', priority: 'High' }, { name: 'Influencer Partnerships', budget: '$4,000', roi: '280%', priority: 'Medium' }, { name: 'Paid Advertising', budget: '$3,000', roi: '200%', priority: 'Medium' }], strategy: 'Focus on organic growth through educational content about personal finance, leveraging TikTok and Instagram for viral reach, while building authority through expert blog posts and podcast appearances.' },
  roadmap: [{ phase: 'Phase 1: MVP', duration: '0-3 months', tasks: ['Core budgeting features', 'AI spending analysis', 'User onboarding flow', 'Basic dashboard'], status: 'current' }, { phase: 'Phase 2: Growth', duration: '3-6 months', tasks: ['Investment tracking', 'Bill negotiation AI', 'Social features', 'Premium tier launch'], status: 'upcoming' }, { phase: 'Phase 3: Scale', duration: '6-12 months', tasks: ['Bank partnerships', 'Advanced AI models', 'International expansion', 'B2B offerings'], status: 'future' }, { phase: 'Phase 4: Dominate', duration: '12-18 months', tasks: ['Wealth management suite', 'AI financial advisor', 'API marketplace', 'IPO preparation'], status: 'future' }],
}

export function AppProvider({ children }) {
  // ─── Auth State ───
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('biznova_token'))
  const isAuthenticated = !!token && !!user

  // ─── App State ───
  const [userProfile, setUserProfile] = useState(null)
  const [businessIdeas, setBusinessIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [businessPlan, setBusinessPlan] = useState(null)
  const [savedIdeas, setSavedIdeas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ─── Chat State (LTM) ───
  const [chatSessions, setChatSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your BizNova AI assistant. I can help you explore business ideas, analyze markets, and plan your startup journey. What would you like to know?' }
  ])
  const [isStreaming, setIsStreaming] = useState(false)

  // ─── CRAG Document State ───
  const [documents, setDocuments] = useState([])
  const [useRag, setUseRag] = useState(false)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ─── Auth helpers ───
  const authHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token])

  useEffect(() => {
    if (token && !user) fetchCurrentUser()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) { setUser(await res.json()) } else { logout() }
    } catch { console.error('Failed to fetch user profile') }
  }

  const getErrorMessage = (data) => {
    if (!data.detail) return null
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) return data.detail[0]?.msg || 'Validation Error'
    return String(data.detail)
  }

  // ─── Auth: Signup ───
  const signup = useCallback(async (email, password, fullName) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, full_name: fullName || '' }) })
      const data = await res.json()
      if (!res.ok) { showToast(getErrorMessage(data) || 'Signup failed', 'error'); setIsLoading(false); return false }
      showToast('🎉 Account created! Please log in.', 'success'); setIsLoading(false); return true
    } catch { showToast('Server unreachable. Please try again.', 'error'); setIsLoading(false); return false }
  }, [showToast])

  // ─── Auth: Login ───
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (!res.ok) { showToast(getErrorMessage(data) || 'Login failed', 'error'); setIsLoading(false); return false }
      localStorage.setItem('biznova_token', data.access_token); setToken(data.access_token); setUser(data.user)
      showToast(`👋 Welcome back, ${data.user.full_name || data.user.email}!`, 'success'); setIsLoading(false); return true
    } catch { showToast('Server unreachable. Please try again.', 'error'); setIsLoading(false); return false }
  }, [showToast])

  // ─── Auth: Google Login ───
  const loginWithGoogle = useCallback(async (token) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      const data = await res.json()
      if (!res.ok) { showToast(data.detail || 'Google Login failed', 'error'); setIsLoading(false); return false }
      localStorage.setItem('biznova_token', data.access_token); setToken(data.access_token); setUser(data.user)
      showToast(`👋 Welcome back, ${data.user.full_name || data.user.email}!`, 'success'); setIsLoading(false); return true
    } catch { showToast('Server unreachable. Please try again.', 'error'); setIsLoading(false); return false }
  }, [showToast])

  // ─── Auth: Logout ───
  const logout = useCallback(() => {
    localStorage.removeItem('biznova_token'); setToken(null); setUser(null); setUserProfile(null)
    setBusinessIdeas([]); setSelectedIdea(null); setSavedIdeas([])
    setChatSessions([]); setCurrentSessionId(null); setDocuments([])
    setChatMessages([{ id: 1, role: 'assistant', content: 'Hello! I\'m your BizNova AI assistant.' }])
    showToast('👋 Logged out successfully', 'info')
  }, [showToast])

  // ─── AI: Generate Business Ideas ───
  const generateIdeas = useCallback(async (profile) => {
    setIsLoading(true); setUserProfile(profile)
    try {
      const res = await fetch(`${API_BASE}/api/ideas/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json(); const ideas = data.ideas || data
      setBusinessIdeas(Array.isArray(ideas) ? ideas : []); showToast(`🚀 ${ideas.length || 6} business ideas generated by AI!`)
    } catch (err) {
      console.warn('Backend AI unavailable, using mock data:', err.message)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setBusinessIdeas(mockBusinessIdeas); showToast('🚀 6 business ideas generated! (demo mode)', 'info')
    }
    setIsLoading(false)
  }, [showToast])

  // ─── AI: Select Idea & Load Analysis Data ───
  const selectIdea = useCallback(async (idea) => {
    setSelectedIdea(idea); const location = userProfile?.location || 'Islamabad'
    try {
      const marketRes = await fetch(`${API_BASE}/api/analysis/market`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea_title: idea.title, location, category: idea.category || '' }) })
      if (marketRes.ok) setMarketData(await marketRes.json()); else throw new Error()
    } catch { setMarketData(mockMarketData) }
    try {
      const forecastRes = await fetch(`${API_BASE}/api/analysis/forecast`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea_title: idea.title, location }) })
      if (forecastRes.ok) setForecastData(await forecastRes.json()); else throw new Error()
    } catch { setForecastData(mockForecastData) }
    try {
      const planRes = await fetch(`${API_BASE}/api/analysis/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea_title: idea.title, budget: userProfile?.budget || '50000', location, skills: userProfile?.skills || [], category: idea.category || '' }) })
      if (planRes.ok) setBusinessPlan(await planRes.json()); else throw new Error()
    } catch { setBusinessPlan(mockBusinessPlan) }
  }, [userProfile])

  const saveIdea = useCallback((idea) => {
    setSavedIdeas(prev => {
      if (prev.find(i => i.id === idea.id)) { showToast('Idea already saved', 'info'); return prev }
      showToast('💾 Idea saved to your dashboard!'); return [...prev, { ...idea, savedAt: new Date().toISOString() }]
    })
  }, [showToast])

  // ═══════════════════════════════════════════════════════════════════════
  // CHAT: Session Management (LTM)
  // ═══════════════════════════════════════════════════════════════════════

  const loadChatSessions = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) setChatSessions(await res.json())
    } catch { console.error('Failed to load chat sessions') }
  }, [token])

  const createChatSession = useCallback(async () => {
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ title: 'New Chat' }) })
      if (res.ok) {
        const session = await res.json(); setChatSessions(prev => [session, ...prev]); setCurrentSessionId(session.id)
        setChatMessages([]); return session
      }
    } catch { showToast('Failed to create session', 'error') }
    return null
  }, [token, authHeaders, showToast])

  const loadSessionMessages = useCallback(async (sessionId) => {
    if (!token) return
    setCurrentSessionId(sessionId)
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}/messages`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        const msgs = await res.json()
        setChatMessages(msgs.length > 0 ? msgs : [{ id: 0, role: 'assistant', content: 'Hello! I\'m your BizNova AI assistant. What would you like to know?' }])
      }
    } catch { showToast('Failed to load messages', 'error') }
  }, [token, showToast])

  const deleteChatSession = useCallback(async (sessionId) => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) { setCurrentSessionId(null); setChatMessages([{ id: 0, role: 'assistant', content: 'Hello! Start a new conversation.' }]) }
        showToast('Session deleted', 'info')
      }
    } catch { showToast('Failed to delete session', 'error') }
  }, [token, currentSessionId, showToast])

  const clearChatMessages = useCallback(() => {
    setChatMessages([{ id: 0, role: 'assistant', content: 'Chat cleared. How can I help you?' }])
  }, [])

  // ═══════════════════════════════════════════════════════════════════════
  // CHAT: Streaming Send Message (SSE)
  // ═══════════════════════════════════════════════════════════════════════

  const sendChatMessage = useCallback(async (content) => {
    const userMsg = { id: Date.now(), role: 'user', content }
    setChatMessages(prev => [...prev, userMsg])

    // Ensure we have a session
    let sessionId = currentSessionId
    if (!sessionId && token) {
      const session = await createChatSession()
      if (session) sessionId = session.id
    }

    // If no token or no session, fallback to non-streaming
    if (!token || !sessionId) {
      try {
        const res = await fetch(`${API_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, history: chatMessages.slice(-10).map(m => ({ role: m.role, content: m.content })), context: selectedIdea ? `Currently exploring: ${selectedIdea.title} (${selectedIdea.category})` : null }) })
        if (!res.ok) throw new Error((await res.json()).detail || 'Chat failed')
        const data = await res.json()
        setChatMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.response }])
      } catch (err) {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: `⚠️ Error: ${err.message}` }])
      }
      return
    }

    // ─── Streaming SSE request ───
    setIsStreaming(true)
    const aiMsgId = Date.now() + 1
    setChatMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', isStreaming: true }])

    try {
      const res = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          session_id: sessionId,
          message: content,
          context: selectedIdea ? `Currently exploring: ${selectedIdea.title} (${selectedIdea.category})` : null,
          use_rag: useRag,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Streaming failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setChatMessages(prev => prev.map(msg =>
                  msg.id === aiMsgId ? { ...msg, content: msg.content + parsed.content } : msg
                ))
              }
            } catch { /* skip unparseable chunks */ }
          }
        }
      }

      // Mark streaming as complete
      setChatMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
      ))

      // Refresh sessions list (title may have updated)
      loadChatSessions()
    } catch (err) {
      setChatMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, content: `⚠️ Error: ${err.message}`, isStreaming: false } : msg
      ))
      showToast(err.message, 'error')
    }
    setIsStreaming(false)
  }, [currentSessionId, token, chatMessages, selectedIdea, useRag, authHeaders, createChatSession, loadChatSessions, showToast])

  // ═══════════════════════════════════════════════════════════════════════
  // CRAG: Document Management
  // ═══════════════════════════════════════════════════════════════════════

  const loadDocuments = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/chat/documents`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) setDocuments(await res.json())
    } catch { console.error('Failed to load documents') }
  }, [token])

  const uploadDocument = useCallback(async (file) => {
    if (!token) return null
    const formData = new FormData(); formData.append('file', file)
    try {
      const res = await fetch(`${API_BASE}/api/chat/documents/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
      if (res.ok) {
        const doc = await res.json(); setDocuments(prev => [doc, ...prev])
        showToast(`📄 "${doc.filename}" uploaded (${doc.total_chunks} chunks)`, 'success'); return doc
      } else {
        const err = await res.json(); showToast(err.detail || 'Upload failed', 'error')
      }
    } catch { showToast('Upload failed', 'error') }
    return null
  }, [token, showToast])

  const deleteDocument = useCallback(async (docId) => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/api/chat/documents/${docId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) { setDocuments(prev => prev.filter(d => d.id !== docId)); showToast('Document deleted', 'info') }
    } catch { showToast('Failed to delete document', 'error') }
  }, [token, showToast])

  // Load sessions and documents when user logs in
  useEffect(() => {
    if (isAuthenticated) { loadChatSessions(); loadDocuments() }
  }, [isAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user, token, isAuthenticated, login, logout, signup, loginWithGoogle,
    userProfile, setUserProfile, businessIdeas, setBusinessIdeas,
    selectedIdea, selectIdea, marketData, forecastData, businessPlan,
    savedIdeas, saveIdea, isLoading, setIsLoading, toast, showToast,
    sidebarOpen, setSidebarOpen, generateIdeas,
    // Chat (LTM + Streaming)
    chatMessages, sendChatMessage, isStreaming,
    chatSessions, currentSessionId, setCurrentSessionId,
    createChatSession, loadSessionMessages, deleteChatSession, clearChatMessages, loadChatSessions,
    // CRAG Documents
    documents, uploadDocument, deleteDocument, loadDocuments, useRag, setUseRag,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppContext
