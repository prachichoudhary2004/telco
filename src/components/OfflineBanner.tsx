import React from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { useOffline } from '../context/OfflineContext'

export default function OfflineBanner() {
  const { isOnline, offlineQueue } = useOffline()

  if (isOnline && offlineQueue.length === 0) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-colors ${
      isOnline ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? (
          <>
            <Wifi size={16} />
            <span>Back online! Syncing {offlineQueue.length} actions...</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>You're offline. Actions will sync when reconnected.</span>
          </>
        )}
      </div>
    </div>
  )
}