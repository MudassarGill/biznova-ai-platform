import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  FileText, ArrowRight, Zap, Target, DollarSign,
  Megaphone, Map, CheckCircle, Clock, TrendingUp,
  Download, Share2, Printer
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-3 shadow-xl">
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs" style={{ color: entry.color || '#fff' }}>
            {entry.name}: {typeof entry.value === 'number' && entry.name !== 'Users' ? `$${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PlanPage() {
  const navigate = useNavigate()
  const { selectedIdea, businessPlan } = useApp()

  if (!selectedIdea || !businessPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">No Business Plan</h2>
        <p className="text-dark-400 mb-6 max-w-md">
          Select a business idea to generate a comprehensive AI-powered business plan.
        </p>
        <button onClick={() => navigate('/ideas')} className="btn-primary flex items-center gap-2">
          <Zap className="w-4 h-4" /> Browse Ideas
        </button>
      </div>
    )
  }

  const { overview, investment, marketing, roadmap } = businessPlan

  const statusColors = {
    current: 'border-brand-500 bg-brand-500/10',
    upcoming: 'border-amber-500 bg-amber-500/10',
    future: 'border-dark-600 bg-dark-800/50',
  }

  const statusTextColors = {
    current: 'text-brand-400',
    upcoming: 'text-amber-400',
    future: 'text-dark-400',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Business Plan</h1>
          <p className="text-dark-400">
            AI-generated plan for <span className="text-brand-400 font-medium">{selectedIdea.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2 text-sm" id="download-plan">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="btn-ghost flex items-center gap-2 text-sm" id="share-plan">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary flex items-center gap-2 group"
            id="go-to-chat"
          >
            Ask AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Overview Section */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-brand-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider font-semibold mb-1">Mission</p>
              <p className="text-sm text-dark-200 leading-relaxed">{overview.mission}</p>
            </div>
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider font-semibold mb-1">Vision</p>
              <p className="text-sm text-dark-200 leading-relaxed">{overview.vision}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider font-semibold mb-1">Target Market</p>
              <p className="text-sm text-dark-200 leading-relaxed">{overview.targetMarket}</p>
            </div>
            <div>
              <p className="text-xs text-dark-400 uppercase tracking-wider font-semibold mb-1">Unique Value</p>
              <p className="text-sm text-dark-200 leading-relaxed">{overview.uniqueValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Breakdown */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">Investment Plan</h2>
              <p className="text-sm text-dark-400">Total: <span className="text-emerald-400 font-bold">{investment.totalRequired}</span></p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={investment.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="amount"
                nameKey="category"
                stroke="none"
              >
                {investment.breakdown.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-4">
            {investment.breakdown.map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-dark-300">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-white">${item.amount.toLocaleString()}</span>
                  <span className="text-xs text-dark-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Projection */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">Revenue Projection</h2>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={investment.revenueProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="quarter" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={val => `$${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {investment.revenueProjection.map(q => (
              <div key={q.quarter} className="text-center p-2 bg-dark-800/50 rounded-lg">
                <p className="text-xs text-dark-400">{q.quarter}</p>
                <p className="text-sm font-bold text-white">{q.users.toLocaleString()}</p>
                <p className="text-xs text-dark-500">users</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing Strategy */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Marketing Strategy</h2>
        </div>

        <p className="text-sm text-dark-300 leading-relaxed mb-6 p-4 bg-dark-800/50 rounded-xl border-l-4 border-brand-500">
          {marketing.strategy}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketing.channels.map((channel) => (
            <div key={channel.name} className="p-4 bg-dark-800/50 rounded-xl border border-dark-700/50 hover:border-brand-500/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${channel.priority === 'High' ? 'badge-success' : 'badge-warning'}`}>
                  {channel.priority}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-3">{channel.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Budget</span>
                  <span className="text-dark-200 font-medium">{channel.budget}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Expected ROI</span>
                  <span className="text-emerald-400 font-bold">{channel.roi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Roadmap */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Map className="w-5 h-5 text-rose-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-white">Execution Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.map((phase, idx) => (
            <div
              key={phase.phase}
              className={`p-5 rounded-xl border-2 ${statusColors[phase.status]} relative`}
            >
              {phase.status === 'current' && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full">
                  Active
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold ${statusTextColors[phase.status]}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h4 className="text-sm font-semibold text-white">{phase.phase}</h4>
              </div>
              <div className="flex items-center gap-1.5 mb-4">
                <Clock className="w-3.5 h-3.5 text-dark-400" />
                <span className="text-xs text-dark-400">{phase.duration}</span>
              </div>
              <ul className="space-y-2">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2 text-xs text-dark-300">
                    <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                      phase.status === 'current' ? 'text-brand-400' : 'text-dark-600'
                    }`} />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanPage
