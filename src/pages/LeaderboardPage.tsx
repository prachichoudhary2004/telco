import React, { useState } from 'react'
import { ArrowLeft, Trophy, Medal, Crown, TrendingUp, Flame, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { state, speak } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly')
  const { t } = useI18n()

  const periods = [
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'all-time', label: 'All Time' }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />
      case 2: return <Medal className="text-gray-400" size={24} />
      case 3: return <Medal className="text-orange-400" size={24} />
      default: return <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-bold">{rank}</div>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-500/20 border-gray-400/30'
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'
      default: return 'bg-slate-800 border-slate-700'
    }
  }

  const currentUserRank = state.leaderboard.findIndex(user => user.id === state.user?.id) + 1

  return (
    <div className="mobile-nav-height bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => {
              speak(t('nav.home'))
              navigate('/dashboard')
            }}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('leaderboard.title')}</h1>
            <p className="text-orange-200">{t('leaderboard.subtitle')}</p>
          </div>
        </div>

        {/* Your Rank */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify_between">
            <div className="flex items-center space-x-4">
              <img
                src={state.user?.avatar}
                alt={state.user?.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{state.user?.name}</p>
                <p className="text-orange-200 text-sm">{t('leaderboard.your_rank')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">#{currentUserRank || '---'}</div>
              <p className="text-orange-200 text-sm">{state.user?.tokens} tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="px-6 py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                selectedPeriod === period.id
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-6 py-4">
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">🏆 {t('leaderboard.top_performers')}</h3>
          
          <div className="flex items-end justify-center space-x-4">
            {/* 2nd Place */}
            {state.leaderboard[1] && (
              <div className="text-center">
                <div className="relative">
                  <img
                    src={state.leaderboard[1].avatar}
                    alt={state.leaderboard[1].name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-gray-400"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Medal className="text-gray-400" size={20} />
                  </div>
                </div>
                <p className="text-white font-medium text-sm">{state.leaderboard[1].name}</p>
                <p className="text-gray-300 text-xs">{state.leaderboard[1].tokens} tokens</p>
                <div className="w-16 h-12 bg-gray-400 mt-2 mx-auto rounded-t-lg flex items-end justify-center pb-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {state.leaderboard[0] && (
              <div className="text-center">
                <div className="relative">
                  <img
                    src={state.leaderboard[0].avatar}
                    alt={state.leaderboard[0].name}
                    className="w-20 h-20 rounded-full mx-auto mb-2 border-4 border-yellow-400"
                  />
                  <div className="absolute -top-3 -right-1">
                    <Crown className="text-yellow-400" size={24} />
                  </div>
                </div>
                <p className="text-white font-bold">{state.leaderboard[0].name}</p>
                <p className="text-yellow-300 text-sm">{state.leaderboard[0].tokens} tokens</p>
                <div className="w-20 h-16 bg-yellow-400 mt-2 mx-auto rounded-t-lg flex items-end justify-center pb-1">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {state.leaderboard[2] && (
              <div className="text-center">
                <div className="relative">
                  <img
                    src={state.leaderboard[2].avatar}
                    alt={state.leaderboard[2].name}
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-4 border-orange-400"
                  />
                  <div className="absolute -top-2 -right-2">
                    <Medal className="text-orange-400" size={20} />
                  </div>
                </div>
                <p className="text-white font-medium text-sm">{state.leaderboard[2].name}</p>
                <p className="text-orange-300 text-xs">{state.leaderboard[2].tokens} tokens</p>
                <div className="w-16 h-8 bg-orange-400 mt-2 mx-auto rounded-t-lg flex items-end justify-center pb-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('leaderboard.all_rankings')}</h3>
        
        <div className="space-y-3">
          {state.leaderboard.map((user, index) => (
            <div
              key={user.id}
              className={`border rounded-2xl p-4 ${getRankBg(index + 1)}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getRankIcon(index + 1)}
                </div>
                
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-white">{user.name}</h4>
                    {user.id === state.user?.id && (
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                        {t('leaderboard.you')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{t('leaderboard.level')} {user.level}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items_center space-x-1 mb-1">
                    <Trophy className="text-yellow-400" size={16} />
                    <span className="font-bold text-white">{user.tokens}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Flame size={12} />
                      <span>{user.streak}d</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={12} />
                      <span>{user.badges}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climb the Ranks */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{t('leaderboard.climb_title')}</h3>
              <p className="text-indigo-100 text-sm">
                {t('leaderboard.climb_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speak(t('leaderboard.play_more'))
              navigate('/activities')
            }}
            className="w-full mt-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-xl transition-colors"
          >
            {t('leaderboard.play_more')}
          </button>
        </div>
      </div>
    </div>
  )
}