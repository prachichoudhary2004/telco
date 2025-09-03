import React, { useState } from 'react'
import { Trophy, Medal, Crown, Flame, TrendingUp, Calendar, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function LeaderboardPage() {
  const { state } = useApp()
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week')

  // Add current user to leaderboard for demo
  const leaderboardData = [
    ...state.leaderboard,
    {
      id: state.user?.id || 'current-user',
      name: state.user?.name || 'You',
      avatar: state.user?.avatar || '',
      tokens: state.user?.tokens || 0,
      level: state.user?.level || 1,
      badges: state.user?.badges.length || 0,
      streak: state.user?.streak || 0
    }
  ].sort((a, b) => b.tokens - a.tokens)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={24} />
      case 2: return <Medal className="text-gray-400" size={24} />
      case 3: return <Medal className="text-amber-600" size={24} />
      default: return <span className="text-slate-400 font-bold text-lg">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-slate-500/20 border border-gray-400/30'
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-600/30'
      default: return 'bg-slate-800 border border-slate-700'
    }
  }

  const currentUserRank = leaderboardData.findIndex(user => user.id === state.user?.id) + 1

  return (
    <div className="mobile-nav-height">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            <p className="text-amber-100">See who's leading the pack</p>
          </div>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Trophy className="text-white" size={24} />
          </div>
        </div>

        {/* Your Rank */}
        {state.user && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden">
                  <img
                    src={state.user.avatar}
                    alt={state.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-semibold">Your Position</div>
                  <div className="text-amber-100 text-sm">#{currentUserRank} • {state.user.tokens} tokens</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">#{currentUserRank}</div>
                <div className="text-amber-100 text-sm">Rank</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Filter */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-2">
          <div className="grid grid-cols-3">
            {[
              { key: 'week', label: 'This Week', icon: Calendar },
              { key: 'month', label: 'This Month', icon: TrendingUp },
              { key: 'all', label: 'All Time', icon: Users }
            ].map((filter) => {
              const Icon = filter.icon
              return (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key as any)}
                  className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-medium transition-colors ${
                    timeFilter === filter.key
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{filter.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-6 mb-8">
        <div className="flex items-end justify-center space-x-4 h-32">
          {/* 2nd Place */}
          {leaderboardData[1] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-400 to-slate-500 flex items-center justify-center overflow-hidden mb-2">
                <img
                  src={leaderboardData[1].avatar}
                  alt={leaderboardData[1].name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              </div>
              <div className="bg-gray-400 w-20 h-16 rounded-t-xl flex flex-col items-center justify-center">
                <Medal className="text-white" size={20} />
                <span className="text-white text-xs font-bold">2nd</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {leaderboardData[0] && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden mb-2">
                <img
                  src={leaderboardData[0].avatar}
                  alt={leaderboardData[0].name}
                  className="w-18 h-18 rounded-xl object-cover"
                />
              </div>
              <div className="bg-yellow-400 w-24 h-20 rounded-t-xl flex flex-col items-center justify-center">
                <Crown className="text-white" size={24} />
                <span className="text-white text-xs font-bold">1st</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboardData[2] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center justify-center overflow-hidden mb-2">
                <img
                  src={leaderboardData[2].avatar}
                  alt={leaderboardData[2].name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              </div>
              <div className="bg-amber-600 w-20 h-12 rounded-t-xl flex flex-col items-center justify-center">
                <Medal className="text-white" size={18} />
                <span className="text-white text-xs font-bold">3rd</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-white mb-4">Full Rankings</h3>
        
        <div className="space-y-3">
          {leaderboardData.map((user, index) => {
            const rank = index + 1
            const isCurrentUser = user.id === state.user?.id
            
            return (
              <div
                key={user.id}
                className={`${getRankBg(rank)} rounded-2xl p-4 ${
                  isCurrentUser ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-700">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <div className={`font-semibold ${isCurrentUser ? 'text-indigo-400' : 'text-white'}`}>
                        {user.name}
                        {isCurrentUser && <span className="text-indigo-300 text-sm ml-2">(You)</span>}
                      </div>
                      <div className="text-slate-400 text-sm">Level {user.level}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-400">{user.tokens}</div>
                    <div className="text-slate-400 text-sm">tokens</div>
                  </div>
                </div>
                
                {/* Additional Stats */}
                <div className="mt-3 pt-3 border-t border-slate-600/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Trophy className="text-slate-400" size={14} />
                        <span className="text-slate-300">{user.badges} badges</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flame className="text-orange-400" size={14} />
                        <span className="text-slate-300">{user.streak} day streak</span>
                      </div>
                    </div>
                    
                    {rank <= 3 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-slate-400">Top 3!</span>
                        <Trophy className="text-yellow-400" size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Coming Soon */}
        <div className="mt-8 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center">
          <div className="p-3 bg-slate-700/50 rounded-full w-fit mx-auto mb-4">
            <TrendingUp className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Global Competition Coming Soon</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Compete with users worldwide and win exclusive rewards in upcoming tournaments!
          </p>
        </div>
      </div>
    </div>
  )
}