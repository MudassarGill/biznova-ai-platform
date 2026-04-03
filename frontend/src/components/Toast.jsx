import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'border-emerald-500/30 text-emerald-400',
  error: 'border-rose-500/30 text-rose-400',
  info: 'border-cyan-500/30 text-cyan-400',
}

function Toast({ message, type = 'success' }) {
  const { showToast } = useApp()
  const Icon = icons[type] || icons.success
  const color = colors[type] || colors.success

  return (
    <div className={`toast ${color}`} id="toast-notification">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => showToast(null)}
        className="absolute top-3 right-3 text-dark-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
