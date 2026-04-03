import { useNavigate } from 'react-router-dom'
import {
  Sparkles, TrendingUp, BarChart3, FileText, MessageSquare,
  Brain, Target, Zap, Shield, ChevronRight, ArrowRight,
  Star, Users, Globe, Lightbulb
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Idea Generation',
    description: 'Get personalized business ideas tailored to your budget, skills, and location using advanced generative AI.',
    color: 'from-brand-500 to-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Market Analysis',
    description: 'Deep-dive into market demand, competition, and city-wise insights powered by machine learning models.',
    color: 'from-accent-cyan to-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Future Forecasting',
    description: 'Time-series predictions and growth trend visualization to anticipate market movements.',
    color: 'from-accent-emerald to-green-500',
  },
  {
    icon: FileText,
    title: 'Business Plans',
    description: 'Complete AI-generated business plans with investment strategy, marketing, and execution roadmap.',
    color: 'from-accent-amber to-orange-500',
  },
  {
    icon: Brain,
    title: 'Success Scoring',
    description: 'ML-powered success probability scoring evaluating viability across multiple dimensions.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Context-aware AI copilot for continuous guidance and data-driven decision support.',
    color: 'from-violet-500 to-brand-500',
  },
]

const stats = [
  { value: '10K+', label: 'Ideas Generated' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Markets Covered' },
  { value: '2.5K', label: 'Active Users' },
]

const techStack = [
  { icon: Brain, label: 'Machine Learning' },
  { icon: Zap, label: 'Deep Learning' },
  { icon: Globe, label: 'NLP Engine' },
  { icon: Sparkles, label: 'Generative AI' },
  { icon: Shield, label: 'MLOps Pipeline' },
  { icon: Target, label: 'Real-time Data' },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">BizNova</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#tech" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Technology</a>
            <a href="#stats" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Stats</a>
          </div>
          <button
            onClick={() => navigate('/input')}
            className="btn-primary text-sm px-5 py-2.5"
            id="nav-get-started"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="glow-orb w-[600px] h-[600px] bg-brand-500 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb w-[400px] h-[400px] bg-accent-cyan top-40 right-0" />
        <div className="glow-orb w-[300px] h-[300px] bg-accent-emerald bottom-0 left-10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">AI-Powered Business Intelligence</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight animate-slide-up">
            <span className="text-white">Biz</span>
            <span className="gradient-text">Nova</span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-display font-semibold text-dark-200 mb-4 animate-slide-up animate-delay-100">
            From Idea to Execution with <span className="gradient-text">AI</span>
          </p>

          {/* Description */}
          <p className="text-lg text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animate-delay-200">
            Discover, evaluate, and plan profitable business ideas using data-driven insights
            and generative AI. Transform raw data into actionable business intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
            <button
              onClick={() => navigate('/input')}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
              id="hero-get-started"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              id="hero-view-demo"
            >
              View Demo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up animate-delay-500">
            {stats.map(({ value, label }) => (
              <div key={label} className="glass-card p-5">
                <p className="text-3xl font-display font-bold gradient-text">{value}</p>
                <p className="text-sm text-dark-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="glow-orb w-[500px] h-[500px] bg-purple-500 top-1/2 left-0 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">Powerful Features</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              BizNova combines multiple AI paradigms to deliver comprehensive business intelligence at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <div
                key={title}
                className="glass-card-hover p-7 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-dark-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tech" className="py-24 px-6 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent-cyan font-semibold text-sm uppercase tracking-wider mb-3">Technology</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Powered by <span className="gradient-text">Advanced AI</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Our platform integrates cutting-edge AI technologies for unmatched accuracy and insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map(({ icon: Icon, label }) => (
              <div key={label} className="glass-card-hover p-6 text-center group">
                <Icon className="w-8 h-8 text-brand-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-dark-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="glow-orb w-[600px] h-[600px] bg-brand-500 bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto glass-card p-12 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Find Your Next Big Idea?
          </h2>
          <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of entrepreneurs using AI to discover and validate profitable business opportunities.
          </p>
          <button
            onClick={() => navigate('/input')}
            className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group"
            id="cta-get-started"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">BizNova</span>
          </div>
          <p className="text-dark-500 text-sm">
            © 2025 BizNova. AI-Powered Business Intelligence Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Terms</a>
            <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
