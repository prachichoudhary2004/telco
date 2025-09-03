import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coins, Trophy, Flame, Plus, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useConfetti } from '../components/ConfettiProvider'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state, loginUser, updateStreak, openAIModal } = useApp()
  const { celebrate } = useConfetti()

  // Auto-login demo user if not authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      loginUser({
        name: 'Demo User',
        email: 'demo@telco.com',
        tokens: 250,
        level: 3,
        streak: 5,
        xp: 420
      })
    } else if (state.user) {
      updateStreak()
    }
  }, [state.isAuthenticated, state.user])

  const handleQuickActivity = () => {
    const quickActivity = state.activities[0]
    if (quickActivity) {
      navigate('/activities')
    }
  }

  const handleStreakCelebration = () => {
    celebrate('streak')
  }

  if (!state.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  const recentActivities = state.activities.filter(a => a.completed).slice(0, 3)
  const nextLevelXP = (state.user.level * 100)
  const progressPercentage = (state.user.xp % 100)

  return (
    <div className="mobile-nav-height">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            <p className="text-indigo-100">{state.user.name}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <img
              src={state.user.avatar}
              alt={state.user.name}
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Level {state.user.level}</span>
            <span className="text-indigo-200 text-sm">{state.user.xp}/{nextLevelXP} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-yellow-400 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-8 grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="text-yellow-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{state.user.tokens}</div>
          <div className="text-sm text-slate-400">Tokens</div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="text-orange-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{state.user.streak}</div>
          <div className="text-sm text-slate-400">Day Streak</div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="text-indigo-400" size={24} />
          </div>
          <div className="text-2xl font-bold text-white">{state.user.badges.length}</div>
          <div className="text-sm text-slate-400">Badges</div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Daily Challenge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="text-white" size={20} />
                <span className="text-white font-medium">Daily Challenge</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Complete 3 Activities</h3>
              <p className="text-green-100 text-sm">Earn 100 bonus tokens</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1/3</div>
              <div className="text-green-100 text-sm">Completed</div>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-1/3 transition-all duration-300" />
          </div>
        </div>

        {/* Streak Celebration */}
        {state.user.streak >= 5 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="text-white" size={20} />
                  <span className="text-white font-medium">Streak Milestone!</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">5 Day Streak! 🔥</h3>
                <p className="text-orange-100 text-sm">You're on fire! Keep it up!</p>
              </div>
              <button
                onClick={handleStreakCelebration}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-colors"
              >
                Celebrate!
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleQuickActivity}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl p-4 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Plus className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-white font-medium">Start Activity</div>
                  <div className="text-indigo-200 text-sm">Earn tokens</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => openAIModal()}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl p-4 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-white font-medium">AI Assistant</div>
                  <div className="text-purple-200 text-sm">Create content</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button
              onClick={() => navigate('/activities')}
              className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{activity.icon}</span>
                    <div>
                      <div className="text-white font-medium">{activity.title}</div>
                      <div className="text-slate-400 text-sm">{activity.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-medium">+{activity.tokens}</div>
                    <div className="text-slate-400 text-sm">tokens</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-slate-700/50 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="text-slate-400" size={24} />
              </div>
              <p className="text-slate-400 mb-4">No activities completed yet</p>
              <button
                onClick={() => navigate('/activities')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                Start Your First Activity
              </button>
            </div>
          )}
        </div>

        {/* Achievements Preview */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Latest Badges</h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {state.badges.slice(0, 5).map((badge) => (
              <div
                key={badge.id}
                className={`flex-shrink-0 w-20 text-center ${
                  badge.earned ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-2 ${
                  badge.earned 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                    : 'bg-slate-700'
                }`}>
                  {badge.icon}
                </div>
                <p className="text-xs text-slate-400 font-medium">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insight */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="text-white" size={24} />
            <h3 className="text-xl font-bold text-white">Weekly Insight</h3>
          </div>
          <p className="text-blue-100 mb-4">
            You've earned 25% more tokens this week compared to last week! 
            Keep up the great work!
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <span className="text-white font-medium">+180 tokens</span>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <span className="text-white font-medium">5 activities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}