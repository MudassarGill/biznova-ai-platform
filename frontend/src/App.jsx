import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'
import LandingPage from './pages/LandingPage'
import InputPage from './pages/InputPage'
import IdeasPage from './pages/IdeasPage'
import AnalysisPage from './pages/AnalysisPage'
import ForecastPage from './pages/ForecastPage'
import PlanPage from './pages/PlanPage'
import ChatPage from './pages/ChatPage'
import UserDashboard from './pages/UserDashboard'
import Toast from './components/Toast'
import ChatBubble from './components/ChatBubble'

function App() {
  const { toast } = useApp()

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/input" element={<InputPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <ChatBubble />
    </>
  )
}

export default App
