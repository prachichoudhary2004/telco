import React, { createContext, useContext, useState, useEffect } from 'react'

interface OfflineContextType {
  isOnline: boolean
  offlineQueue: any[]
  addToQueue: (item: any) => void
  processQueue: () => void
  clearQueue: () => void
}

const OfflineContext = createContext<OfflineContextType | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineQueue, setOfflineQueue] = useState<any[]>([])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Auto-process queue when coming back online
      setTimeout(processQueue, 1000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load offline queue from localStorage
    const savedQueue = localStorage.getItem('offline-queue')
    if (savedQueue) {
      try {
        setOfflineQueue(JSON.parse(savedQueue))
      } catch (error) {
        console.error('Error loading offline queue:', error)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const addToQueue = (item: any) => {
    const newQueue = [...offlineQueue, { ...item, timestamp: Date.now() }]
    setOfflineQueue(newQueue)
    localStorage.setItem('offline-queue', JSON.stringify(newQueue))
  }

  const processQueue = () => {
    if (offlineQueue.length === 0) return

    // Simulate processing offline actions
    console.log('Processing offline queue:', offlineQueue)
    
    // In a real app, you would sync these with your backend
    offlineQueue.forEach(item => {
      console.log('Syncing:', item.type, item.data)
    })

    clearQueue()
  }

  const clearQueue = () => {
    setOfflineQueue([])
    localStorage.removeItem('offline-queue')
  }

  return (
    <OfflineContext.Provider value={{
      isOnline,
      offlineQueue,
      addToQueue,
      processQueue,
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