import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, Lightbulb, BarChart3, TrendingUp,
  FileText, MessageSquare, Settings, ChevronLeft,
  ChevronRight, Search, Bell, User, Sparkles, Menu, Target
} from 'lucide-react'

const navItems = [
  { path: '/input', label: 'Get Started', icon: Sparkles },
  { path: '/ideas', label: 'Business Ideas', icon: Lightbulb },
  { path: '/analysis', label: 'Market Analysis', icon: BarChart3 },
  { path: '/forecast', label: 'Forecasting', icon: TrendingUp },
  { path: '/plan', label: 'Business Plan', icon: FileText },
  { path: '/chat', label: 'AI Assistant', icon: MessageSquare },
  { path: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
]

function DashboardLayout() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const location = useLocation()

  const currentPage = navItems.find(item => item.path === location.pathname)

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-30 h-full bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 
                     transition-all duration-300 flex flex-col
                     ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-dark-700/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-xl gradient-text animate-fade-in">
              BizNova
            </span>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarOpen && (
            <p className="px-4 py-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">
              Navigation
            </p>
          )}
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${!sidebarOpen ? 'justify-center px-2' : ''}`
              }
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="animate-fade-in">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-3 border-t border-dark-700/50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-link w-full justify-center"
            id="sidebar-toggle"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden btn-ghost p-2"
              id="mobile-menu-toggle"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {currentPage?.label || 'BizNova'}
              </h1>
              <p className="text-xs text-dark-400">AI-Powered Business Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl">
              <Search className="w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-dark-200 placeholder-dark-500 w-40"
                id="global-search"
              />
            </div>

            {/* Notifications */}
            <button className="btn-ghost p-2 relative" id="notifications-btn">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-3 border-l border-dark-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-emerald flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-dark-400">Pro Plan</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 dot-grid">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
