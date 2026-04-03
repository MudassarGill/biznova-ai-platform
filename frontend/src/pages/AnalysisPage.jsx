import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  TrendingUp, BarChart3, Users, Target, ArrowRight,
  Zap, Globe, Shield, Activity
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, AreaChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function AnalysisPage() {
  const navigate = useNavigate()
  const { selectedIdea, marketData } = useApp()

  if (!selectedIdea || !marketData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
          <BarChart3 className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">No Analysis Available</h2>
        <p className="text-dark-400 mb-6 max-w-md">
          Select a business idea first to see detailed market analysis and insights.
        </p>
        <button onClick={() => navigate('/ideas')} className="btn-primary flex items-center gap-2">
          <Zap className="w-4 h-4" /> Browse Ideas
        </button>
      </div>
    )
  }

  const kpis = [
    { label: 'Market Demand', value: '92/100', change: '+12%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Growth Rate', value: selectedIdea.growthRate, change: 'YoY', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Competition', value: selectedIdea.competition, change: '—', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Success Score', value: `${selectedIdea.successScore}%`, change: 'AI Score', icon: Target, color: 'text-brand-400', bg: 'bg-brand-500/10' },
  ]

  const radarData = [
    { metric: 'Demand', value: 92 },
    { metric: 'Growth', value: 85 },
    { metric: 'Margins', value: 78 },
    { metric: 'Scalability', value: 90 },
    { metric: 'Innovation', value: 88 },
    { metric: 'Timing', value: 82 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Market Analysis</h1>
          <p className="text-dark-400">
            Deep analysis for <span className="text-brand-400 font-medium">{selectedIdea.title}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/forecast')}
          className="btn-primary flex items-center gap-2 group"
          id="go-to-forecast"
        >
          View Forecast
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon, color, bg }, idx) => (
          <div key={label} className="kpi-card animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-dark-400 font-medium">{label}</p>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-dark-500 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Trends */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Demand Trends</h3>
              <p className="text-xs text-dark-400">Monthly market demand over 12 months</p>
            </div>
            <span className="badge-success">↑ Uptrend</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={marketData.demandTrends}>
              <defs>
                <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="demand" stroke="#6366f1" fill="url(#demandGrad)" strokeWidth={2} name="Demand" />
              <Area type="monotone" dataKey="growth" stroke="#10b981" fill="url(#growthGrad)" strokeWidth={2} name="Growth" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* City-wise Demand */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">City-wise Analysis</h3>
              <p className="text-xs text-dark-400">Demand & competition by location</p>
            </div>
            <Globe className="w-5 h-5 text-dark-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData.cityDemand} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="city" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="demand" fill="#6366f1" name="Demand" radius={[4, 4, 0, 0]} />
              <Bar dataKey="competition" fill="#f59e0b" name="Competition" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitor Pie */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-2">Market Share</h3>
          <p className="text-xs text-dark-400 mb-4">Competitor breakdown</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={marketData.competitors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="marketShare"
                nameKey="name"
                stroke="none"
              >
                {marketData.competitors.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-2">Opportunity Radar</h3>
          <p className="text-xs text-dark-400 mb-4">Multi-dimensional scoring</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#334155" fontSize={10} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Table */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-2">Competitors</h3>
          <p className="text-xs text-dark-400 mb-4">Competitive landscape</p>
          <div className="space-y-3">
            {marketData.competitors.map((comp, idx) => (
              <div key={comp.name} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <div>
                    <p className="text-sm font-medium text-white">{comp.name}</p>
                    <p className="text-xs text-dark-400">{comp.marketShare}% share</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-400">+{comp.growth}%</p>
                  <span className={`text-xs ${comp.threat === 'High' ? 'text-rose-400' : comp.threat === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {comp.threat} threat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City Scores Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-white mb-2">City Opportunity Scores</h3>
        <p className="text-xs text-dark-400 mb-4">Best locations for your business idea</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">City</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Demand</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Competition</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Score</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {marketData.cityDemand
                .sort((a, b) => b.score - a.score)
                .map((city) => (
                  <tr key={city.city} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-white">{city.city}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${city.demand}%` }} />
                        </div>
                        <span className="text-xs text-dark-300">{city.demand}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${city.competition}%` }} />
                        </div>
                        <span className="text-xs text-dark-300">{city.competition}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-bold ${city.score >= 80 ? 'text-emerald-400' : city.score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {city.score}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={city.score >= 80 ? 'badge-success' : city.score >= 70 ? 'badge-warning' : 'badge-danger'}>
                        {city.score >= 80 ? 'Excellent' : city.score >= 70 ? 'Good' : 'Fair'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
