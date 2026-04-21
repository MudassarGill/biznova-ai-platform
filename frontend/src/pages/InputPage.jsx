import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  DollarSign, MapPin, Wrench, Heart, Sparkles,
  ArrowRight, X, Plus, Briefcase, Target
} from 'lucide-react'

const suggestedSkills = [
  'Web Development', 'Mobile Apps', 'Machine Learning', 'Data Science',
  'Marketing', 'Design', 'Finance', 'Sales', 'Writing', 'Video Production',
  'Cloud Computing', 'Blockchain', 'IoT', 'Cybersecurity', 'Project Management',
]

const businessCategories = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Food & Beverage', 'Real Estate', 'Entertainment', 'Sustainability', 'Consulting',
]

const pakistanCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Mardan',
  'Sukkur', 'Larkana', 'Sahiwal', 'Jhang', 'Rahim Yar Khan',
  'Sheikhupura', 'Gujrat', 'Kasur', 'Dera Ghazi Khan', 'Chiniot',
  'Muzaffargarh', 'Mirpur Khas', 'Nawabshah', 'Mingora', 'Kohat',
  'Okara', 'Kamoke', 'Jhelum', 'Sadiqabad', 'Burewala',
  'Jacobabad', 'Khairpur', 'Khanewal', 'Hafizabad', 'Attock',
]

const internationalCities = [
  'New York', 'San Francisco', 'Austin', 'Chicago', 'Seattle',
  'Miami', 'Denver', 'Boston', 'Los Angeles', 'Atlanta',
  'London', 'Berlin', 'Toronto', 'Singapore', 'Dubai',
  'Riyadh', 'Doha', 'Istanbul', 'Kuala Lumpur', 'Sydney',
]

function InputPage() {
  const navigate = useNavigate()
  const { generateIdeas, isLoading } = useApp()

  const [formData, setFormData] = useState({
    budget: '',
    location: '',
    skills: [],
    interests: [],
    additionalNotes: '',
  })

  const [skillInput, setSkillInput] = useState('')
  const [useCustomLocation, setUseCustomLocation] = useState(false)
  const [customLocation, setCustomLocation] = useState('')

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }))
    }
  }

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleCustomSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      addSkill(skillInput.trim())
      setSkillInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await generateIdeas(formData)
    navigate('/ideas')
  }

  const isValid = formData.budget && (formData.location || customLocation) && formData.skills.length > 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
          <Target className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-medium text-brand-300">Step 1 of 7</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Tell Us About You</h1>
        <p className="text-dark-400 text-lg">
          Share your preferences and we'll generate personalized AI business ideas tailored to your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Budget & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <DollarSign className="w-4 h-4 text-accent-emerald" />
              Investment Budget (USD)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="e.g., 50000"
              className="input-field"
              min="1000"
              id="budget-input"
            />
            <div className="flex gap-2 mt-3">
              {['10000', '50000', '100000', '250000'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, budget: val }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    formData.budget === val
                      ? 'bg-brand-600 text-white'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  ${Number(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="glass-card p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <MapPin className="w-4 h-4 text-accent-rose" />
              Target Location
            </label>

            {!useCustomLocation ? (
              <>
                <select
                  value={formData.location}
                  onChange={e => {
                    if (e.target.value === '__custom__') {
                      setUseCustomLocation(true)
                      setFormData(prev => ({ ...prev, location: '' }))
                    } else {
                      setFormData(prev => ({ ...prev, location: e.target.value }))
                    }
                  }}
                  className="input-field"
                  id="location-select"
                >
                  <option value="">Select a city...</option>
                  <optgroup label="🇵🇰 Pakistan">
                    {pakistanCities.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🌍 International">
                    {internationalCities.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </optgroup>
                  <optgroup label="➕ Other">
                    <option value="__custom__">Type my own city...</option>
                  </optgroup>
                </select>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customLocation}
                  onChange={e => {
                    setCustomLocation(e.target.value)
                    setFormData(prev => ({ ...prev, location: e.target.value }))
                  }}
                  placeholder="Enter your city name..."
                  className="input-field"
                  autoFocus
                  id="custom-location-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomLocation(false)
                    setCustomLocation('')
                    setFormData(prev => ({ ...prev, location: '' }))
                  }}
                  className="p-3 bg-dark-700 rounded-xl text-dark-300 hover:text-white hover:bg-dark-600 transition-colors flex-shrink-0"
                  title="Back to list"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <p className="text-xs text-dark-500 mt-3">
              {useCustomLocation
                ? 'Type your city name — click ✕ to go back to the list'
                : 'Select a city or choose "Type my own city" at the bottom'
              }
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Wrench className="w-4 h-4 text-accent-amber" />
            Your Skills & Expertise
          </label>

          {/* Selected Skills */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20 text-sm font-medium"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>
                    <X className="w-3.5 h-3.5 hover:text-white transition-colors" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Custom Skill Input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleCustomSkill}
              placeholder="Type a skill and press Enter..."
              className="input-field"
              id="skill-input"
            />
            <button
              type="button"
              onClick={() => { if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput('') } }}
              className="p-3 bg-brand-600 rounded-xl text-white hover:bg-brand-500 transition-colors flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Suggested Skills */}
          <p className="text-xs text-dark-500 mb-2">Suggested:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.filter(s => !formData.skills.includes(s)).map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="px-3 py-1.5 rounded-full bg-dark-700/80 text-dark-300 text-sm hover:bg-dark-600 hover:text-white transition-all border border-dark-600/50 hover:border-dark-500"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Business Interests */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Heart className="w-4 h-4 text-rose-400" />
            Business Interests
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {businessCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleInterest(cat)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  formData.interests.includes(cat)
                    ? 'bg-brand-600/20 text-brand-300 border-brand-500/30 shadow-glow'
                    : 'bg-dark-800/50 text-dark-300 border-dark-600/50 hover:border-dark-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="glass-card p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Briefcase className="w-4 h-4 text-accent-cyan" />
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={e => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="Tell us more about your goals, experience, or any specific requirements..."
            className="input-field min-h-[120px] resize-y"
            id="notes-input"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-500">
            {formData.skills.length} skills selected • {formData.interests.length} interests
          </p>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            id="generate-ideas-btn"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Business Ideas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InputPage
