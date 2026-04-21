import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AppContext = createContext()

const API_BASE = 'http://localhost:8000'

// Mock data for the frontend
const mockBusinessIdeas = [
  {
    id: 1,
    title: 'AI-Powered Personal Finance App',
    description: 'A mobile application that uses machine learning to analyze spending patterns, provide personalized budgeting advice, and automate savings goals.',
    category: 'FinTech',
    successScore: 87,
    investmentRequired: '$50,000 - $120,000',
    timeToMarket: '4-6 months',
    marketDemand: 'High',
    competition: 'Medium',
    growthRate: '+24%',
    tags: ['AI/ML', 'Mobile', 'Finance'],
  },
  {
    id: 2,
    title: 'Sustainable Food Delivery Platform',
    description: 'An eco-friendly food delivery service connecting local organic restaurants with health-conscious consumers, using electric vehicle fleet.',
    category: 'FoodTech',
    successScore: 74,
    investmentRequired: '$80,000 - $200,000',
    timeToMarket: '6-9 months',
    marketDemand: 'Very High',
    competition: 'High',
    growthRate: '+18%',
    tags: ['Sustainability', 'Delivery', 'Health'],
  },
  {
    id: 3,
    title: 'Remote Team Collaboration Suite',
    description: 'An all-in-one platform combining project management, video conferencing, and AI-assisted task prioritization for distributed teams.',
    category: 'SaaS',
    successScore: 91,
    investmentRequired: '$100,000 - $250,000',
    timeToMarket: '8-12 months',
    marketDemand: 'Very High',
    competition: 'High',
    growthRate: '+32%',
    tags: ['SaaS', 'Productivity', 'AI'],
  },
  {
    id: 4,
    title: 'Smart Home Energy Management',
    description: 'IoT-based system that monitors and optimizes household energy consumption using AI predictions and automated device control.',
    category: 'CleanTech',
    successScore: 79,
    investmentRequired: '$150,000 - $350,000',
    timeToMarket: '10-14 months',
    marketDemand: 'High',
    competition: 'Low',
    growthRate: '+28%',
    tags: ['IoT', 'Energy', 'Smart Home'],
  },
  {
    id: 5,
    title: 'AI Content Creation Studio',
    description: 'A platform that uses generative AI to create marketing content, social media posts, and brand visuals with one-click publishing.',
    category: 'MarTech',
    successScore: 83,
    investmentRequired: '$30,000 - $80,000',
    timeToMarket: '3-5 months',
    marketDemand: 'Very High',
    competition: 'Medium',
    growthRate: '+45%',
    tags: ['GenAI', 'Marketing', 'Content'],
  },
  {
    id: 6,
    title: 'Telemedicine Platform for Rural Areas',
    description: 'A healthcare platform connecting rural patients with specialists via AI-assisted diagnosis, video consultations, and prescription delivery.',
    category: 'HealthTech',
    successScore: 68,
    investmentRequired: '$200,000 - $500,000',
    timeToMarket: '12-18 months',
    marketDemand: 'High',
    competition: 'Low',
    growthRate: '+21%',
    tags: ['Healthcare', 'AI', 'Telemedicine'],
  },
]

const mockMarketData = {
  demandTrends: [
    { month: 'Jan', demand: 65, growth: 12 },
    { month: 'Feb', demand: 72, growth: 15 },
    { month: 'Mar', demand: 68, growth: 14 },
    { month: 'Apr', demand: 85, growth: 22 },
    { month: 'May', demand: 90, growth: 25 },
    { month: 'Jun', demand: 88, growth: 24 },
    { month: 'Jul', demand: 95, growth: 28 },
    { month: 'Aug', demand: 102, growth: 32 },
    { month: 'Sep', demand: 98, growth: 30 },
    { month: 'Oct', demand: 110, growth: 35 },
    { month: 'Nov', demand: 115, growth: 38 },
    { month: 'Dec', demand: 120, growth: 42 },
  ],
  cityDemand: [
    { city: 'New York', demand: 95, competition: 82, score: 78 },
    { city: 'San Francisco', demand: 92, competition: 90, score: 72 },
    { city: 'Austin', demand: 88, competition: 55, score: 89 },
    { city: 'Chicago', demand: 78, competition: 65, score: 74 },
    { city: 'Seattle', demand: 85, competition: 72, score: 76 },
    { city: 'Miami', demand: 70, competition: 48, score: 82 },
    { city: 'Denver', demand: 72, competition: 42, score: 85 },
    { city: 'Boston', demand: 82, competition: 70, score: 75 },
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
  overview: {
    title: 'AI-Powered Personal Finance App',
    mission: 'Democratize financial intelligence by making AI-driven personal finance management accessible to everyone.',
    vision: 'Become the leading AI-powered personal finance platform, helping 10 million users achieve financial freedom by 2027.',
    targetMarket: 'Millennials and Gen-Z professionals (25-40) with annual income $40K-$150K who want smarter money management.',
    uniqueValue: 'Unlike traditional budgeting apps, we use predictive AI to anticipate expenses, identify saving opportunities, and automate wealth-building strategies.',
  },
  investment: {
    totalRequired: '$85,000',
    breakdown: [
      { category: 'Development', amount: 35000, percentage: 41 },
      { category: 'Marketing', amount: 20000, percentage: 24 },
      { category: 'Operations', amount: 12000, percentage: 14 },
      { category: 'Legal & Compliance', amount: 8000, percentage: 9 },
      { category: 'Reserve Fund', amount: 10000, percentage: 12 },
    ],
    revenueProjection: [
      { quarter: 'Q1', revenue: 5000, users: 500 },
      { quarter: 'Q2', revenue: 18000, users: 2200 },
      { quarter: 'Q3', revenue: 45000, users: 5800 },
      { quarter: 'Q4', revenue: 85000, users: 12000 },
    ],
  },
  marketing: {
    channels: [
      { name: 'Social Media Marketing', budget: '$8,000', roi: '320%', priority: 'High' },
      { name: 'Content Marketing & SEO', budget: '$5,000', roi: '450%', priority: 'High' },
      { name: 'Influencer Partnerships', budget: '$4,000', roi: '280%', priority: 'Medium' },
      { name: 'Paid Advertising', budget: '$3,000', roi: '200%', priority: 'Medium' },
    ],
    strategy: 'Focus on organic growth through educational content about personal finance, leveraging TikTok and Instagram for viral reach, while building authority through expert blog posts and podcast appearances.',
  },
  roadmap: [
    { phase: 'Phase 1: MVP', duration: '0-3 months', tasks: ['Core budgeting features', 'AI spending analysis', 'User onboarding flow', 'Basic dashboard'], status: 'current' },
    { phase: 'Phase 2: Growth', duration: '3-6 months', tasks: ['Investment tracking', 'Bill negotiation AI', 'Social features', 'Premium tier launch'], status: 'upcoming' },
    { phase: 'Phase 3: Scale', duration: '6-12 months', tasks: ['Bank partnerships', 'Advanced AI models', 'International expansion', 'B2B offerings'], status: 'future' },
    { phase: 'Phase 4: Dominate', duration: '12-18 months', tasks: ['Wealth management suite', 'AI financial advisor', 'API marketplace', 'IPO preparation'], status: 'future' },
  ],
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
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your BizNova AI assistant. I can help you explore business ideas, analyze markets, and plan your startup journey. What would you like to know?' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ─── Auth: Fetch current user on app load if token exists ───
  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        // Token is invalid/expired — clear it
        logout()
      }
    } catch {
      // Backend is unreachable
      console.error('Failed to fetch user profile')
    }
  }

  // ─── Auth: Signup ───
  const signup = useCallback(async (email, password, fullName) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName || '',
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.detail || 'Signup failed', 'error')
        setIsLoading(false)
        return false
      }

      showToast('🎉 Account created! Please log in.', 'success')
      setIsLoading(false)
      return true
    } catch {
      showToast('Server unreachable. Please try again.', 'error')
      setIsLoading(false)
      return false
    }
  }, [showToast])

  // ─── Auth: Login ───
  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        showToast(data.detail || 'Login failed', 'error')
        setIsLoading(false)
        return false
      }

      // Save token and user
      localStorage.setItem('biznova_token', data.access_token)
      setToken(data.access_token)
      setUser(data.user)
      showToast(`👋 Welcome back, ${data.user.full_name || data.user.email}!`, 'success')
      setIsLoading(false)
      return true
    } catch {
      showToast('Server unreachable. Please try again.', 'error')
      setIsLoading(false)
      return false
    }
  }, [showToast])

  // ─── Auth: Logout ───
  const logout = useCallback(() => {
    localStorage.removeItem('biznova_token')
    setToken(null)
    setUser(null)
    setUserProfile(null)
    setBusinessIdeas([])
    setSelectedIdea(null)
    setSavedIdeas([])
    showToast('👋 Logged out successfully', 'info')
  }, [showToast])

  const generateIdeas = useCallback(async (profile) => {
    setIsLoading(true)
    setUserProfile(profile)
    // Simulate API call (will be replaced in future steps)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setBusinessIdeas(mockBusinessIdeas)
    setIsLoading(false)
    showToast('🚀 6 business ideas generated successfully!')
  }, [showToast])

  const selectIdea = useCallback((idea) => {
    setSelectedIdea(idea)
    setMarketData(mockMarketData)
    setForecastData(mockForecastData)
    setBusinessPlan(mockBusinessPlan)
  }, [])

  const saveIdea = useCallback((idea) => {
    setSavedIdeas(prev => {
      const exists = prev.find(i => i.id === idea.id)
      if (exists) {
        showToast('Idea already saved', 'info')
        return prev
      }
      showToast('💾 Idea saved to your dashboard!')
      return [...prev, { ...idea, savedAt: new Date().toISOString() }]
    })
  }, [showToast])

  const sendChatMessage = useCallback(async (content) => {
    const userMsg = { id: Date.now(), role: 'user', content }
    setChatMessages(prev => [...prev, userMsg])

    // Simulate AI response (will be replaced in future steps)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const responses = [
      "Based on market analysis, I'd recommend focusing on the tech sector. The current growth rate of 32% in SaaS tools suggests strong demand for innovative solutions.",
      "Great question! Looking at your budget and skills, I think an AI-powered content creation platform could be a perfect fit. The initial investment is relatively low, and the market is expanding rapidly.",
      "The competitive landscape shows that while there are established players, there's significant room for niche solutions. Consider targeting underserved segments like small businesses or freelancers.",
      "From a forecasting perspective, the data suggests steady growth in your chosen market over the next 12-18 months. I'd recommend an agile launch strategy to capture early market share.",
      "For your business plan, I suggest a lean approach: start with an MVP, validate with 100 beta users, then scale. This minimizes risk while maximizing learning opportunities.",
    ]

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responses[Math.floor(Math.random() * responses.length)]
    }
    setChatMessages(prev => [...prev, aiMsg])
  }, [])

  const value = {
    // Auth
    user, token, isAuthenticated,
    login, logout, signup,
    // App
    userProfile, setUserProfile,
    businessIdeas, setBusinessIdeas,
    selectedIdea, selectIdea,
    marketData, forecastData, businessPlan,
    savedIdeas, saveIdea,
    chatMessages, sendChatMessage,
    isLoading, setIsLoading,
    toast, showToast,
    sidebarOpen, setSidebarOpen,
    generateIdeas,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppContext
