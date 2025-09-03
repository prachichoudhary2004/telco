import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ConfettiProvider } from './components/ConfettiProvider'
import { OfflineProvider } from './context/OfflineContext'

// Pages
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ActivitiesPage from './pages/ActivitiesPage'
import WalletPage from './pages/WalletPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'

// Components
import MobileNavigation from './components/MobileNavigation'
import OfflineBanner from './components/OfflineBanner'
import AIAssistantModal from './components/AIAssisstantModal'

function App() {
  return (
    <OfflineProvider>
      <AppProvider>
        <ConfettiProvider>
          <Router>
            <div className="min-h-screen bg-slate-900">
              <OfflineBanner />
              
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <MobileNavigation />
              <AIAssistantModal />
            </div>
          </Router>
        </ConfettiProvider>
      </AppProvider>
    </OfflineProvider>
  )
}

export default App
