import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { mockLeaderboard, mockBadges, mockTelcoPerks } from '../utils/mockData'
import { useAuth } from './AuthContext'

// Types
interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  xp: number
  tokens: number
  streak: number
  lastLogin: string
  badges: Badge[]
  completedActivities: string[]
  language: 'en' | 'hi'
  ttsEnabled: boolean
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Activity {
  id: string
  title: string
  description: string
  type: 'quiz' | 'game' | 'video' | 'puzzle' | 'trivia' | 'memory' | 'strategy' | 'arcade' | 'simulator'
  category: string
  tokens: number
  xp: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  icon: string
  completed: boolean
}

interface TelcoPerk {
  id: string
  name: string
  description: string
  cost: number
  category: string
  image: string
  availability: 'available' | 'limited' | 'sold_out'
  validUntil: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  activities: Activity[]
  badges: Badge[]
  telcoPerks: TelcoPerk[]
  leaderboard: any[]
  offlineQueue: any[]
  aiModalOpen: boolean
  currentActivity: Activity | null
  notifications: any[]
  language: 'en' | 'hi'
}

// Actions
type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'COMPLETE_ACTIVITY'; payload: { activityId: string; tokens: number; xp: number } }
  | { type: 'EARN_BADGE'; payload: Badge }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'REDEEM_PERK'; payload: { perkId: string; cost: number } }
  | { type: 'OPEN_AI_MODAL'; payload: Activity | null }
  | { type: 'CLOSE_AI_MODAL' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' }
  | { type: 'TOGGLE_TTS' }
  | { type: 'ADD_TO_OFFLINE_QUEUE'; payload: any }
  | { type: 'CLEAR_OFFLINE_QUEUE' }

// Default activities with expanded selection
const defaultActivities: Activity[] = [
  {
    id: 'quiz-1',
    title: 'Telco Knowledge Quiz',
    description: 'Test your knowledge about telecommunications',
    type: 'quiz',
    category: 'Education',
    tokens: 50,
    xp: 25,
    duration: 5,
    difficulty: 'easy',
    icon: '🧠',
    completed: false
  },
  {
    id: 'game-1',
    title: 'Signal Strength Game',
    description: 'Connect towers to maximize signal coverage',
    type: 'game',
    category: 'Strategy',
    tokens: 75,
    xp: 40,
    duration: 10,
    difficulty: 'medium',
    icon: '📡',
    completed: false
  },
  {
    id: 'video-1',
    title: '5G Technology Overview',
    description: 'Learn about the future of mobile networks',
    type: 'video',
    category: 'Education',
    tokens: 30,
    xp: 15,
    duration: 8,
    difficulty: 'easy',
    icon: '📱',
    completed: false
  },
  {
    id: 'puzzle-1',
    title: 'Network Puzzle Challenge',
    description: 'Solve network routing puzzles',
    type: 'puzzle',
    category: 'Logic',
    tokens: 60,
    xp: 35,
    duration: 12,
    difficulty: 'medium',
    icon: '🧩',
    completed: false
  },
  {
    id: 'trivia-1',
    title: 'Mobile History Trivia',
    description: 'Fun facts about mobile phone evolution',
    type: 'trivia',
    category: 'Fun',
    tokens: 40,
    xp: 20,
    duration: 6,
    difficulty: 'easy',
    icon: '📞',
    completed: false
  },
  {
    id: 'memory-1',
    title: 'Data Plan Memory Game',
    description: 'Match data plans with their features',
    type: 'memory',
    category: 'Memory',
    tokens: 55,
    xp: 30,
    duration: 8,
    difficulty: 'medium',
    icon: '🧠',
    completed: false
  },
  {
    id: 'strategy-1',
    title: 'Tower Defense Strategy',
    description: 'Build and defend your network infrastructure',
    type: 'strategy',
    category: 'Strategy',
    tokens: 85,
    xp: 50,
    duration: 15,
    difficulty: 'hard',
    icon: '🏗️',
    completed: false
  },
  {
    id: 'arcade-1',
    title: 'Spectrum Surfing',
    description: 'Navigate through radio frequencies',
    type: 'arcade',
    category: 'Action',
    tokens: 70,
    xp: 45,
    duration: 7,
    difficulty: 'medium',
    icon: '🎮',
    completed: false
  },
  {
    id: 'simulator-1',
    title: 'Network Operations Center',
    description: 'Manage a virtual telecom network',
    type: 'simulator',
    category: 'Simulation',
    tokens: 100,
    xp: 60,
    duration: 20,
    difficulty: 'hard',
    icon: '🖥️',
    completed: false
  }
]

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  activities: defaultActivities,
  badges: mockBadges,
  telcoPerks: mockTelcoPerks,
  leaderboard: mockLeaderboard,
  offlineQueue: [],
  aiModalOpen: false,
  currentActivity: null,
  notifications: [],
  language: 'en'
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      }
    
    case 'LOGOUT':
      localStorage.removeItem('telco-user')
      return {
        ...state,
        user: null,
        isAuthenticated: false
      }
    
    case 'COMPLETE_ACTIVITY':
      if (!state.user) return state
      
      const updatedUser = {
        ...state.user,
        tokens: state.user.tokens + action.payload.tokens,
        xp: state.user.xp + action.payload.xp,
        completedActivities: [...state.user.completedActivities, action.payload.activityId]
      }
      
      // Update activities
      const updatedActivities = state.activities.map(activity =>
        activity.id === action.payload.activityId
          ? { ...activity, completed: true }
          : activity
      )
      
      localStorage.setItem('telco-user', JSON.stringify(updatedUser))
      
      return {
        ...state,
        user: updatedUser,
        activities: updatedActivities
      }
    
    case 'EARN_BADGE':
      if (!state.user) return state
      
      const userWithBadge = {
        ...state.user,
        badges: [...state.user.badges, { ...action.payload, earned: true, earnedAt: new Date().toISOString() }]
      }
      
      localStorage.setItem('telco-user', JSON.stringify(userWithBadge))
      
      return {
        ...state,
        user: userWithBadge
      }
    
    case 'UPDATE_STREAK':
      if (!state.user) return state
      
      const userWithStreak = {
        ...state.user,
        streak: action.payload,
        lastLogin: new Date().toISOString()
      }
      
      localStorage.setItem('telco-user', JSON.stringify(userWithStreak))
      
      return {
        ...state,
        user: userWithStreak
      }
    
    case 'REDEEM_PERK':
      if (!state.user) return state
      
      const userAfterRedemption = {
        ...state.user,
        tokens: state.user.tokens - action.payload.cost
      }
      
      localStorage.setItem('telco-user', JSON.stringify(userAfterRedemption))
      
      return {
        ...state,
        user: userAfterRedemption
      }
    
    case 'OPEN_AI_MODAL':
      return {
        ...state,
        aiModalOpen: true,
        currentActivity: action.payload
      }
    
    case 'CLOSE_AI_MODAL':
      return {
        ...state,
        aiModalOpen: false,
        currentActivity: null
      }
    
    case 'SET_LANGUAGE':
      if (state.user) {
        const updatedUser = { ...state.user, language: action.payload }
        localStorage.setItem('telco-user', JSON.stringify(updatedUser))
      }
      
      return {
        ...state,
        user: state.user ? { ...state.user, language: action.payload } : null,
        language: action.payload
      }
    
    case 'TOGGLE_TTS':
      if (!state.user) return state
      
      const userWithTTS = {
        ...state.user,
        ttsEnabled: !state.user.ttsEnabled
      }
      
      localStorage.setItem('telco-user', JSON.stringify(userWithTTS))
      
      return {
        ...state,
        user: userWithTTS
      }
    
    case 'ADD_TO_OFFLINE_QUEUE':
      return {
        ...state,
        offlineQueue: [...state.offlineQueue, action.payload]
      }
    
    case 'CLEAR_OFFLINE_QUEUE':
      return {
        ...state,
        offlineQueue: []
      }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  loginUser: (userData: Partial<User>) => void
  completeActivity: (activityId: string, tokens: number, xp: number) => void
  earnBadge: (badge: Badge) => void
  updateStreak: () => void
  redeemPerk: (perkId: string, cost: number) => void
  openAIModal: (activity?: Activity) => void
  closeAIModal: () => void
  speak: (text: string) => void
} | null>(null)

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const auth = useAuth()

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('telco-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        dispatch({ type: 'SET_USER', payload: userData })
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
  }, [])

  // Sync language with AuthContext if it changes
  useEffect(() => {
    const lang = auth.state.user?.language
    if (lang && lang !== state.language) {
      dispatch({ type: 'SET_LANGUAGE', payload: lang })
    }
  }, [auth.state.user?.language])

  // Helper functions
  const loginUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || 'user-' + Date.now(),
      name: userData.name || 'User',
      email: userData.email || 'user@example.com',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || 'user'}`,
      level: userData.level || 1,
      xp: userData.xp || 0,
      tokens: userData.tokens || 100, // Welcome bonus
      streak: userData.streak || 1,
      lastLogin: new Date().toISOString(),
      badges: userData.badges || [],
      completedActivities: userData.completedActivities || [],
      language: userData.language || 'en',
      ttsEnabled: userData.ttsEnabled || false
    }
    
    dispatch({ type: 'SET_USER', payload: newUser })
  }

  const completeActivity = (activityId: string, tokens: number, xp: number) => {
    dispatch({ type: 'COMPLETE_ACTIVITY', payload: { activityId, tokens, xp } })
  }

  const earnBadge = (badge: Badge) => {
    dispatch({ type: 'EARN_BADGE', payload: badge })
  }

  const updateStreak = () => {
    if (state.user) {
      const lastLogin = new Date(state.user.lastLogin)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24))
      
      if (daysDiff === 1) {
        dispatch({ type: 'UPDATE_STREAK', payload: state.user.streak + 1 })
      } else if (daysDiff > 1) {
        dispatch({ type: 'UPDATE_STREAK', payload: 1 })
      }
    }
  }

  const redeemPerk = (perkId: string, cost: number) => {
    dispatch({ type: 'REDEEM_PERK', payload: { perkId, cost } })
  }

  const openAIModal = (activity?: Activity) => {
    dispatch({ type: 'OPEN_AI_MODAL', payload: activity || null })
  }

  const closeAIModal = () => {
    dispatch({ type: 'CLOSE_AI_MODAL' })
  }

  const speak = (text: string) => {
    const tts = auth.state.user?.tts_enabled
    const lang = auth.state.user?.language || state.language
    if (tts && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      loginUser,
      completeActivity,
      earnBadge,
      updateStreak,
      redeemPerk,
      openAIModal,
      closeAIModal,
      speak
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Hook
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}