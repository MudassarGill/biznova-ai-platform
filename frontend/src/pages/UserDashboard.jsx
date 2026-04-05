import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, Lightbulb, Clock, Star, Trash2,
  ArrowRight, Sparkles, BarChart3, TrendingUp, FileText,
  MessageSquare, Eye, Bookmark
} from 'lucide-react'

function UserDashboard() {
  const navigate = useNavigate()
  const { savedIdeas, userProfile, businessIdeas } = useApp()

  const quickActions = [
    { icon: Sparkles, label: 'Generate Ideas', path: '/input', color: 'from-brand-500 to-purple-500' },
    { icon: BarChart3, label: 'Market Analysis', path: '/analysis', color: 'from-accent-cyan to-blue-500' },
    { icon: TrendingUp, label: 'Forecasting', path: '/forecast', color: 'from-accent-emerald to-green-500' },
    { icon: FileText, label: 'Business Plan', path: '/plan', color: 'from-accent-amber to-orange-500' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/chat', color: 'from-rose-500 to-pink-500' },
  ]

  const recentActivity = [
    { action: 'Generated 6 business ideas', time: '2 minutes ago', icon: Lightbulb, color: 'text-brand-400' },
    { action: 'Analyzed AI Finance App market', time: '5 minutes ago', icon: BarChart3, color: 'text-cyan-400' },
    { action: 'Viewed demand forecast', time: '7 minutes ago', icon: TrendingUp, color: 'text-emerald-400' },
    { action: 'Created business plan', time: '10 minutes ago', icon: FileText, color: 'text-amber-400' },
    { action: 'Chat with AI assistant', time: '15 minutes ago', icon: MessageSquare, color: 'text-rose-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="glow-orb w-[300px] h-[300px] bg-brand-500 -top-20 -right-20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back from BizNova AI
          </h1>
          <p className="text-dark-400 text-lg mb-6">
            Your AI-powered business intelligence dashboard is ready.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <p className="text-2xl font-bold text-brand-400">{businessIdeas.length}</p>
              <p className="text-xs text-dark-400">Ideas Generated</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <p className="text-2xl font-bold text-accent-emerald">{savedIdeas.length}</p>
              <p className="text-xs text-dark-400">Saved Ideas</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <p className="text-2xl font-bold text-accent-cyan">3</p>
              <p className="text-xs text-dark-400">Analyses Run</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50">
              <p className="text-2xl font-bold text-accent-amber">1</p>
              <p className="text-xs text-dark-400">Plans Created</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickActions.map(({ icon: Icon, label, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="glass-card-hover p-5 text-center group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Ideas */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-display font-semibold text-white">Saved Ideas</h2>
            </div>
            <span className="text-xs text-dark-500">{savedIdeas.length} total</span>
          </div>

          {savedIdeas.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm mb-4">No saved ideas yet</p>
              <button
                onClick={() => navigate('/ideas')}
                className="btn-secondary text-sm px-4 py-2"
              >
                Browse Ideas
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedIdeas.map((idea) => (
                <div key={idea.id} className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-brand-500/30 transition-all group">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                      {idea.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-dark-400">{idea.category}</span>
                      <span className={`text-xs font-bold ${
                        idea.successScore >= 85 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {idea.successScore}% score
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { navigate('/analysis') }}
                      className="p-2 text-dark-400 hover:text-brand-400 transition-colors"
                      title="View analysis"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-cyan" />
              <h2 className="text-lg font-display font-semibold text-white">Recent Activity</h2>
            </div>
          </div>

          <div className="space-y-1">
            {recentActivity.map(({ action, time, icon: Icon, color }, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-800/50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-200">{action}</p>
                  <p className="text-xs text-dark-500">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      {userProfile && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <p className="text-xs text-dark-400 mb-1">Budget</p>
              <p className="text-lg font-bold text-white">${Number(userProfile.budget).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <p className="text-xs text-dark-400 mb-1">Location</p>
              <p className="text-lg font-bold text-white">{userProfile.location}</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <p className="text-xs text-dark-400 mb-1">Skills</p>
              <p className="text-sm text-white">{userProfile.skills.join(', ')}</p>
            </div>
            <div className="p-4 bg-dark-800/50 rounded-xl">
              <p className="text-xs text-dark-400 mb-1">Interests</p>
              <p className="text-sm text-white">{userProfile.interests.join(', ') || 'Not specified'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
