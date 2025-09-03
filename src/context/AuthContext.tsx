import React, { createContext, useContext, useReducer, useEffect } from 'react'
import apiService from '../services/api'

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
  last_login: string
  badges: Badge[]
  completedActivities: string[]
  language: 'en' | 'hi'
  tts_enabled: boolean
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

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Actions
type AuthAction = 
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        error: null
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Context
const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name: string; email: string; password: string; avatar?: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  completeActivity: (activityId: string, tokens: number, xp: number) => Promise<void>
  addBadge: (badge: Badge) => Promise<void>
  redeemPerk: (perkId: string, perkName: string, cost: number) => Promise<void>
  updateStreak: () => Promise<void>
  clearError: () => void
} | null>(null)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('telco-token')
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' })
          const response = await apiService.getCurrentUser()
          dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
        } catch (error) {
          console.error('Auth check failed:', error)
          apiService.setToken(null)
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' })
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' })
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await apiService.login({ email, password })
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: { name: string; email: string; password: string; avatar?: string }) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await apiService.register(userData)
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(updates)
      dispatch({ type: 'UPDATE_USER', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const completeActivity = async (activityId: string, tokens: number, xp: number) => {
    try {
      const response = await apiService.completeActivity({ activity_id: activityId, tokens_earned: tokens, xp_earned: xp })
      dispatch({ type: 'UPDATE_USER', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Activity completion failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const addBadge = async (badge: Badge) => {
    try {
      const response = await apiService.addBadge({
        badge_id: badge.id,
        badge_name: badge.name,
        badge_description: badge.description,
        badge_icon: badge.icon,
        badge_rarity: badge.rarity
      })
      dispatch({ type: 'UPDATE_USER', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Badge addition failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const redeemPerk = async (perkId: string, perkName: string, cost: number) => {
    try {
      const response = await apiService.redeemPerk({
        perk_id: perkId,
        perk_name: perkName,
        cost: cost
      })
      dispatch({ type: 'UPDATE_USER', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Perk redemption failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const updateStreak = async () => {
    try {
      const response = await apiService.updateStreak()
      dispatch({ type: 'UPDATE_USER', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Streak update failed'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      updateProfile,
      completeActivity,
      addBadge,
      redeemPerk,
      updateStreak,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
