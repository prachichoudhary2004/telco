import React from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { useOffline } from '../context/OfflineContext'

export default function OfflineBanner() {
  const { isOnline, offlineQueue } = useOffline()

  if (isOnline && offlineQueue.length === 0) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm font-medium text-center transition-colors ${
      isOnline 
        ? 'bg-green-600 text-white' 
        : 'bg-orange-600 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        <span>
          {isOnline 
            ? offlineQueue.length > 0 
              ? `Syncing ${offlineQueue.length} offline actions...`
              : 'Back online!'
            : 'You\'re offline - progress will sync when connected'
          }
        </span>
      </div>
    </div>
  )
}