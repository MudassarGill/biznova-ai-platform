import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  TrendingUp, ArrowRight, Zap, AlertTriangle,
  CheckCircle, Shield, Activity, Eye
} from 'lucide-react'
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts'

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

function ForecastPage() {
  const navigate = useNavigate()
  const { selectedIdea, forecastData } = useApp()

  if (!selectedIdea || !forecastData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">No Forecast Data</h2>
        <p className="text-dark-400 mb-6 max-w-md">
          Select a business idea to see time-series forecasting and growth predictions.
        </p>
        <button onClick={() => navigate('/ideas')} className="btn-primary flex items-center gap-2">
          <Zap className="w-4 h-4" /> Browse Ideas
        </button>
      </div>
    )
  }

  const forecastKpis = [
    { label: 'Predicted Growth', value: '+58%', sub: 'Next 12 months', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Confidence', value: '94%', sub: 'Model accuracy', icon: CheckCircle, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Risk Level', value: 'Low', sub: 'Market stable', icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Peak Month', value: 'Dec 25', sub: 'Highest demand', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ]

  const growthRate = forecastData.predictions.map((d, i) => ({
    month: d.month,
    growth: i === 0 ? 0 : Math.round(((d.predicted - forecastData.predictions[i - 1].predicted) / forecastData.predictions[i - 1].predicted) * 100 * 10) / 10,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Demand Forecasting</h1>
          <p className="text-dark-400">
            AI predictions for <span className="text-brand-400 font-medium">{selectedIdea.title}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/plan')}
          className="btn-primary flex items-center gap-2 group"
          id="go-to-plan"
        >
          View Business Plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Forecast KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecastKpis.map(({ label, value, sub, icon: Icon, color, bg }, idx) => (
          <div key={label} className="kpi-card animate-slide-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-dark-400 font-medium">{label}</p>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-dark-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main Forecast Chart */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Demand Forecast</h3>
            <p className="text-xs text-dark-400">Actual vs. predicted with confidence interval</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-brand-500 rounded" />
              <span className="text-dark-400">Predicted</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span className="text-dark-400">Actual</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-brand-500/20 rounded" />
              <span className="text-dark-400">Confidence</span>
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={forecastData.predictions}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confGrad)" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" name="Lower Bound" />
            <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} name="Predicted" />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{ fill: '#049766ff', r: 4 }} name="Actual" connectNulls={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Rate Chart & Risk Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Rate */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-2">Month-over-Month Growth</h3>
          <p className="text-xs text-dark-400 mb-4">Predicted growth rate changes</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growthRate.slice(1)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#5e728fff" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={12} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="growth" name="Growth %" radius={[6, 6, 0, 0]}>
                {growthRate.slice(1).map((entry, idx) => (
                  <rect key={idx} fill={entry.growth >= 0 ? '#10b981' : '#f33958ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Indicators */}
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
          <p className="text-xs text-dark-400 mb-6">AI-evaluated risk factors</p>
          <div className="space-y-5">
            {forecastData.riskIndicators.map(({ label, value, status }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {status === 'low' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : status === 'medium' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Shield className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${
                    status === 'low' ? 'text-emerald-400' : status === 'medium' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {value}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      status === 'low' ? 'bg-emerald-500' : status === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Low Overall Risk</span>
            </div>
            <p className="text-xs text-dark-300 leading-relaxed">
              Market conditions are favorable with stable growth indicators. Competition growth is the primary factor to monitor over the next 6 months.
            </p>
          </div>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-white mb-2">Detailed Predictions</h3>
        <p className="text-xs text-dark-400 mb-4">Monthly demand forecast breakdown</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Month</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Actual</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Predicted</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Range</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-dark-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.predictions.map((row) => (
                <tr key={row.month} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-white">{row.month}</td>
                  <td className="py-3 px-4 text-sm text-emerald-400 font-mono">
                    {row.actual ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-sm text-brand-400 font-mono font-bold">{row.predicted}</td>
                  <td className="py-3 px-4 text-xs text-dark-400 font-mono">{row.lower} – {row.upper}</td>
                  <td className="py-3 px-4">
                    {row.actual ? (
                      <span className="badge-success">Verified</span>
                    ) : (
                      <span className="badge-info flex items-center gap-1 w-fit">
                        <Eye className="w-3 h-3" /> Forecast
                      </span>
                    )}
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

export default ForecastPage
