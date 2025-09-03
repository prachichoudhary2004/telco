import React, { createContext, useContext, useState, useEffect } from 'react'

interface OfflineContextType {
  isOnline: boolean
  offlineQueue: any[]
  addToQueue: (action: any) => void
  clearQueue: () => void
}

const OfflineContext = createContext<OfflineContextType | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineQueue, setOfflineQueue] = useState<any[]>([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      // Process queued actions
      console.log('Processing offline queue:', offlineQueue)
      setOfflineQueue([])
    }
  }, [isOnline, offlineQueue])

  const addToQueue = (action: any) => {
    setOfflineQueue(prev => [...prev, { ...action, timestamp: Date.now() }])
  }

  const clearQueue = () => {
    setOfflineQueue([])
  }

  return (
    <OfflineContext.Provider value={{
      isOnline,
      offlineQueue,
      addToQueue,
      clearQueue
    }}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return context
}