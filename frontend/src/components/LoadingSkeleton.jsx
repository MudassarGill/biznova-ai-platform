function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="skeleton-shimmer h-6 w-3/4" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-4 w-full" />
              <div className="skeleton-shimmer h-4 w-5/6" />
              <div className="skeleton-shimmer h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton-shimmer h-8 w-20 rounded-full" />
              <div className="skeleton-shimmer h-8 w-20 rounded-full" />
            </div>
            <div className="skeleton-shimmer h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="skeleton-shimmer h-6 w-1/3" />
        <div className="skeleton-shimmer h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="skeleton-shimmer h-4 w-1/2" />
            <div className="skeleton-shimmer h-8 w-2/3" />
            <div className="skeleton-shimmer h-3 w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default LoadingSkeleton
