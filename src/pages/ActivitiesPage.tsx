import React, { useState, useEffect } from 'react'
import { ArrowLeft, Play, Clock, Trophy, Zap, Star, Filter, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useConfetti } from '../components/ConfettiProvider'
import { useI18n } from '../context/I18nContext'

// Game Components
import QuizGame from '../components/games/QuizGame'
import SignalGame from '../components/games/SignalGame'
import MemoryGame from '../components/games/MemoryGame'
import PuzzleGame from '../components/games/PuzzleGame'
import StrategyGame from '../components/games/StrategyGame'

export default function ActivitiesPage() {
  const navigate = useNavigate()
  const { state, completeActivity, earnBadge, openAIModal, speak } = useApp()
  const { celebrate } = useConfetti()
  const { t } = useI18n()
  
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [gameResults, setGameResults] = useState<{score: number, perfect?: boolean} | null>(null)

  // Filter activities
  const filteredActivities = state.activities.filter(activity => {
    const matchesFilter = selectedFilter === 'all' || activity.category.toLowerCase() === selectedFilter.toLowerCase()
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categories = ['all', 'Strategy', 'Memory', 'Logic', 'Action', 'Skills', 'Education']
  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/20',
    medium: 'text-yellow-400 bg-yellow-400/20', 
    hard: 'text-red-400 bg-red-400/20'
  }

  const handleGameComplete = (activityId: string, score: number, perfect = false) => {
    const activity = state.activities.find(a => a.id === activityId)
    if (!activity) return

    // Calculate bonus tokens based on score and perfect completion
    let bonusTokens = Math.floor(score * 0.1)
    if (perfect) bonusTokens *= 2
    
    const totalTokens = activity.tokens + bonusTokens
    const totalXP = activity.xp + (perfect ? activity.xp * 0.5 : Math.floor(score * 0.05))

    // Complete the activity
    completeActivity(activityId, totalTokens, Math.floor(totalXP))
    
    // Set results for display
    setGameResults({ score, perfect })
    
    // Show celebration
    celebrate(perfect ? 'perfect' : 'complete')
    speak(perfect ? 'Perfect!' : 'Great Job!')
    
    // Check for badges
    checkForBadges(activityId, score, perfect)
    
    // Close game after delay
    setTimeout(() => {
      setCurrentGame(null)
      setGameResults(null)
    }, 3000)
  }

  const checkForBadges = (activityId: string, score: number, perfect: boolean) => {
    const completedCount = state.activities.filter(a => a.completed).length + 1
    
    // First activity badge
    if (completedCount === 1) {
      earnBadge({
        id: 'first-activity',
        name: 'Getting Started',
        description: 'Completed your first activity',
        icon: '🎯',
        earned: true,
        rarity: 'common'
      })
    }
    
    // Perfect score badge
    if (perfect) {
      earnBadge({
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieved a perfect score',
        icon: '💯',
        earned: true,
        rarity: 'rare'
      })
    }
    
    // High score badge
    if (score >= 800) {
      earnBadge({
        id: 'high-scorer',
        name: 'High Scorer',
        description: 'Scored 800+ points in a game',
        icon: '🏆',
        earned: true,
        rarity: 'epic'
      })
    }
  }

  const renderGame = () => {
    if (!currentGame) return null
    
    const activity = state.activities.find(a => a.id === currentGame)
    if (!activity) return null

    const commonProps = {
      activity,
      onComplete: handleGameComplete,
      onClose: () => setCurrentGame(null)
    }

    switch (activity.type) {
      case 'quiz':
        return <QuizGame {...commonProps} />
      case 'game':
        return <SignalGame {...commonProps} />
      case 'memory':
        return <MemoryGame {...commonProps} />
      case 'puzzle':
        return <PuzzleGame {...commonProps} />
      case 'strategy':
        return <StrategyGame {...commonProps} />
      default:
        return <QuizGame {...commonProps} />
    }
  }

  // Show game fullscreen
  if (currentGame) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50">
        {renderGame()}
        
        {/* Game Results Overlay */}
        {gameResults && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">
                {gameResults.perfect ? '🎉' : '🎯'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {gameResults.perfect ? 'Perfect!' : 'Great Job!'}
              </h3>
              <p className="text-slate-300 mb-4">
                Score: {gameResults.score}
              </p>
              {gameResults.perfect && (
                <p className="text-yellow-400 font-semibold">
                  Perfect bonus applied! 🌟
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mobile-nav-height bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('activities.title')}</h1>
            <p className="text-purple-200">{t('activities.subtitle')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={t('activities.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg_white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="px-6 py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                selectedFilter === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="px-6 pb-24">
        <div className="grid gap-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`bg-slate-800 rounded-2xl p-6 ${
                activity.completed ? 'ring-2 ring-green-400/30' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{activity.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">{activity.title}</h3>
                    <p className="text-sm text-slate-400">{activity.description}</p>
                  </div>
                </div>
                {activity.completed && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Trophy size={16} />
                    <span className="text-xs font-medium">{t('activities.completed')}</span>
                  </div>
                )}
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="text-yellow-400" size={16} />
                  </div>
                  <div className="text-sm font-semibold text-white">{activity.tokens}</div>
                  <div className="text-xs text-slate-400">{t('activities.tokens')}</div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="text-blue-400" size={16} />
                  </div>
                  <div className="text-sm font-semibold text-white">{activity.xp}</div>
                  <div className="text-xs text-slate-400">{t('activities.xp')}</div>
                </div>
                
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="text-purple-400" size={16} />
                  </div>
                  <div className="text-sm font-semibold text-white">{activity.duration}</div>
                  <div className="text-xs text-slate-400">{t('activities.min')}</div>
                </div>
              </div>

              {/* Difficulty & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500">{activity.category}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  difficultyColors[activity.difficulty]
                }`}>
                  {activity.difficulty}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    speak(activity.completed ? t('activities.play_again') : t('activities.start'))
                    setCurrentGame(activity.id)
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl py-3 px-4 text-white font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Play size={16} />
                  <span>{activity.completed ? t('activities.play_again') : t('activities.start')}</span>
                </button>
                
                {activity.completed && (
                  <button
                    onClick={() => {
                      speak('AI')
                      openAIModal(activity)
                    }}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
                  >
                    <Star size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('activities.empty_title')}</h3>
            <p className="text-slate-400">{t('activities.empty_desc')}</p>
          </div>
        )}
      </div>
    </div>
  )
}