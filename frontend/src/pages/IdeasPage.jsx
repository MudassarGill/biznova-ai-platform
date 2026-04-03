import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import LoadingSkeleton from '../components/LoadingSkeleton'
import {
  Lightbulb, TrendingUp, ArrowRight, Star, Bookmark,
  Clock, DollarSign, BarChart3, Zap, Filter
} from 'lucide-react'
import { useState } from 'react'

const scoreColor = (score) => {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-rose-400'
}

const scoreBg = (score) => {
  if (score >= 85) return 'bg-emerald-500/15 border-emerald-500/20'
  if (score >= 70) return 'bg-amber-500/15 border-amber-500/20'
  return 'bg-rose-500/15 border-rose-500/20'
}

const demandBadge = (demand) => {
  if (demand === 'Very High') return 'badge-success'
  if (demand === 'High') return 'badge-info'
  return 'badge-warning'
}

function IdeasPage() {
  const navigate = useNavigate()
  const { businessIdeas, selectIdea, saveIdea, isLoading } = useApp()
  const [sortBy, setSortBy] = useState('score')
  const [filterCategory, setFilterCategory] = useState('all')

  if (isLoading) return <LoadingSkeleton type="card" count={6} />

  if (businessIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6">
          <Lightbulb className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">No Ideas Generated Yet</h2>
        <p className="text-dark-400 mb-6 max-w-md">
          Start by telling us about your preferences and we'll generate personalized business ideas for you.
        </p>
        <button onClick={() => navigate('/input')} className="btn-primary flex items-center gap-2" id="go-to-input">
          <Zap className="w-4 h-4" />
          Generate Ideas
        </button>
      </div>
    )
  }

  const categories = ['all', ...new Set(businessIdeas.map(i => i.category))]

  const filteredIdeas = businessIdeas
    .filter(idea => filterCategory === 'all' || idea.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'score') return b.successScore - a.successScore
      if (sortBy === 'name') return a.title.localeCompare(b.title)
      return 0
    })

  const handleViewDetails = (idea) => {
    selectIdea(idea)
    navigate('/analysis')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            AI-Generated Business Ideas
          </h1>
          <p className="text-dark-400">
            {businessIdeas.length} ideas tailored to your profile • Click any idea to explore deeper insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl">
            <Filter className="w-4 h-4 text-dark-400" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-transparent text-sm text-dark-200 outline-none"
              id="filter-category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-dark-800">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl">
            <BarChart3 className="w-4 h-4 text-dark-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-dark-200 outline-none"
              id="sort-by"
            >
              <option value="score" className="bg-dark-800">By Score</option>
              <option value="name" className="bg-dark-800">By Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea, index) => (
          <div
            key={idea.id}
            className="glass-card-hover p-6 flex flex-col group animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span className="badge-info">{idea.category}</span>
              <button
                onClick={(e) => { e.stopPropagation(); saveIdea(idea) }}
                className="p-1.5 text-dark-400 hover:text-brand-400 transition-colors"
                title="Save idea"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
              {idea.title}
            </h3>
            <p className="text-sm text-dark-400 leading-relaxed mb-4 flex-1">
              {idea.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {idea.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-dark-700/80 text-dark-300 text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${scoreColor(idea.successScore)}`} />
                <div>
                  <p className={`text-lg font-bold ${scoreColor(idea.successScore)}`}>
                    {idea.successScore}%
                  </p>
                  <p className="text-xs text-dark-500">Success Score</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent-emerald" />
                <div>
                  <p className="text-lg font-bold text-accent-emerald">{idea.growthRate}</p>
                  <p className="text-xs text-dark-500">Growth</p>
                </div>
              </div>
            </div>

            {/* Info Row */}
            <div className="flex items-center gap-4 text-xs text-dark-400 mb-5">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {idea.investmentRequired}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {idea.timeToMarket}
              </span>
            </div>

            {/* Demand & Competition */}
            <div className="flex items-center gap-2 mb-5">
              <span className={demandBadge(idea.marketDemand)}>
                Demand: {idea.marketDemand}
              </span>
              <span className={`badge ${idea.competition === 'Low' ? 'badge-success' : idea.competition === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                Competition: {idea.competition}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleViewDetails(idea)}
              className="btn-primary w-full flex items-center justify-center gap-2 group/btn"
              id={`view-details-${idea.id}`}
            >
              View Details
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeasPage
