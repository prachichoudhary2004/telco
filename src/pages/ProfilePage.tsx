import React, { useEffect, useState } from 'react'
import { User, Settings, Trophy, Flame, Edit3, Save, X, Volume2, VolumeX, Globe, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { state, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: state.user?.name || '',
    email: state.user?.email || ''
  })

  if (!state.user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-white">Loading...</div>
    </div>
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        email: editForm.email
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleLanguageChange = async (language: 'en' | 'hi') => {
    try {
      await updateProfile({ language })
      // Speak confirmation in the newly selected language if TTS is enabled
      if ('speechSynthesis' in window && state.user?.tts_enabled) {
        const utter = new SpeechSynthesisUtterance(language === 'hi' ? 'भाषा बदली गई' : 'Language changed')
        utter.lang = language === 'hi' ? 'hi-IN' : 'en-US'
        speechSynthesis.speak(utter)
      }
    } catch (error) {
      console.error('Failed to update language:', error)
    }
  }

  const handleTTSToggle = async () => {
    try {
      await updateProfile({ tts_enabled: !state.user.tts_enabled })
      // Provide audible feedback after toggling
      const enabled = !state.user.tts_enabled
      if ('speechSynthesis' in window && enabled) {
        const utter = new SpeechSynthesisUtterance(state.user.language === 'hi' ? 'आवाज सक्षम' : 'Voice enabled')
        utter.lang = state.user.language === 'hi' ? 'hi-IN' : 'en-US'
        speechSynthesis.speak(utter)
      }
    } catch (error) {
      console.error('Failed to toggle TTS:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const nextLevelXP = (state.user.level * 100)
  const progressPercentage = (state.user.xp % 100)

  const earnedBadges = state.user.badges || []
  const availableBadges = [] // We'll implement this later with a badges API

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400'
      case 'rare': return 'bg-blue-500/20 text-blue-400'
      case 'epic': return 'bg-purple-500/20 text-purple-400'
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  useEffect(() => {
    if ('speechSynthesis' in window && state.user?.tts_enabled) {
      const utter = new SpeechSynthesisUtterance(state.user.language === 'hi' ? 'प्रोफ़ाइल पृष्ठ' : 'Profile page')
      utter.lang = state.user.language === 'hi' ? 'hi-IN' : 'en-US'
      speechSynthesis.speak(utter)
    }
  }, [state.user?.tts_enabled, state.user?.language])

  return (
    <div className="mobile-nav-height">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <img
                src={state.user.avatar}
                alt={state.user.name}
                className="w-14 h-14 rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{state.user.name}</h1>
              <p className="text-violet-100">{state.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
          >
            {isEditing ? <X className="text-white" size={20} /> : <Edit3 className="text-white" size={20} />}
          </button>
        </div>

        {/* Level Progress */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Level {state.user.level}</span>
            <span className="text-violet-200 text-sm">{state.user.xp}/{nextLevelXP} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div 
              className="bg-yellow-400 rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-violet-200">
            <span>Progress to Level {state.user.level + 1}</span>
            <span>{100 - progressPercentage} XP needed</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mx-6 mt-6 bg-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Edit Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{state.user.tokens}</div>
          <div className="text-sm text-slate-400">Total Tokens</div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">{state.user.streak}</div>
          <div className="text-sm text-slate-400">Day Streak</div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Achievements */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="text-yellow-400" size={24} />
            <h3 className="text-xl font-bold text-white">Achievements</h3>
          </div>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Earned Badges</h4>
              <div className="grid grid-cols-2 gap-4">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-4"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="text-white font-semibold text-sm">{badge.name}</div>
                      <div className="text-slate-300 text-xs mt-1">{badge.description}</div>
                      <div className={`mt-2 px-2 py-1 rounded-lg text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Badges */}
          {availableBadges.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Available Badges</h4>
              <div className="grid grid-cols-2 gap-4">
                {availableBadges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 opacity-75"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                      <div className="text-slate-300 font-semibold text-sm">{badge.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{badge.description}</div>
                      <div className={`mt-2 px-2 py-1 rounded-lg text-xs font-medium ${getRarityColor(badge.rarity)} opacity-50`}>
                        {badge.rarity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="text-indigo-400" size={24} />
            <h3 className="text-xl font-bold text-white">Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Language Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="text-slate-400" size={20} />
                <div>
                  <div className="text-white font-medium">Language</div>
                  <div className="text-slate-400 text-sm">Choose your preferred language</div>
                </div>
              </div>
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    state.user.language === 'en'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('hi')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    state.user.language === 'hi'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हि
                </button>
              </div>
            </div>

            {/* TTS Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {state.user.tts_enabled ? (
                  <Volume2 className="text-slate-400" size={20} />
                ) : (
                  <VolumeX className="text-slate-400" size={20} />
                )}
                <div>
                  <div className="text-white font-medium">Text-to-Speech</div>
                  <div className="text-slate-400 text-sm">Enable audio feedback</div>
                </div>
              </div>
              <button
                onClick={handleTTSToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.user.tts_enabled ? 'bg-indigo-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.user.tts_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Flame className="text-orange-400" size={24} />
            <h3 className="text-xl font-bold text-white">Activity Summary</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{state.user.completedActivities?.length || 0}</div>
              <div className="text-slate-400 text-sm">Activities Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-slate-400 text-sm">Remaining</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-400">
                0%
              </div>
              <div className="text-slate-400 text-sm">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}