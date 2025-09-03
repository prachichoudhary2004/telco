import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Trophy, Gamepad2, Wallet, User } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useApp } from '../context/AppContext'

export default function MobileNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()
  const { speak } = useApp()
  
  // Don't show navigation on landing page
  if (location.pathname === '/') return null

  const navItems = [
    { id: 'dashboard', label: t('nav.home'), icon: Home, path: '/dashboard' },
    { id: 'activities', label: t('nav.activities'), icon: Gamepad2, path: '/activities' },
    { id: 'wallet', label: t('nav.wallet'), icon: Wallet, path: '/wallet' },
    { id: 'leaderboard', label: t('nav.leaderboard'), icon: Trophy, path: '/leaderboard' },
    { id: 'profile', label: t('nav.profile'), icon: User, path: '/profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-50">
      <div className="grid grid-cols-5 h-20">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.id}
              onClick={() => {
                speak(item.label)
                navigate(item.path)
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-400 rounded-b-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}