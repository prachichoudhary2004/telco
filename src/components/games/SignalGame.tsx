import React, { useState, useEffect, useRef } from 'react'
import { X, Zap, Target } from 'lucide-react'

interface SignalGameProps {
  activity: any
  onComplete: (activityId: string, score: number, perfect?: boolean) => void
  onClose: () => void
}

interface Tower {
  id: number
  x: number
  y: number
  range: number
  active: boolean
}

interface User {
  id: number
  x: number
  y: number
  connected: boolean
}

export default function SignalGame({ activity, onComplete, onClose }: SignalGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [towers, setTowers] = useState<Tower[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedTower, setSelectedTower] = useState<number | null>(null)
  const [gamePhase, setGamePhase] = useState<'playing' | 'complete'>('playing')
  const [connectedUsers, setConnectedUsers] = useState(0)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Game timer
  useEffect(() => {
    if (gamePhase !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gamePhase])

  // Draw game
  useEffect(() => {
    drawGame()
  }, [towers, users, selectedTower])

  // Spawn users periodically
  useEffect(() => {
    if (gamePhase !== 'playing') return
    
    const interval = setInterval(() => {
      spawnUser()
    }, 2000)

    return () => clearInterval(interval)
  }, [gamePhase])

  // Update connections
  useEffect(() => {
    updateConnections()
  }, [towers, users])

  const initializeGame = () => {
    // Add initial tower
    setTowers([{
      id: 1,
      x: 200,
      y: 300,
      range: 100,
      active: true
    }])
    
    // Add initial users
    const initialUsers = []
    for (let i = 0; i < 3; i++) {
      initialUsers.push({
        id: i + 1,
        x: Math.random() * 350 + 25,
        y: Math.random() * 500 + 50,
        connected: false
      })
    }
    setUsers(initialUsers)
  }

  const spawnUser = () => {
    setUsers(prev => [...prev, {
      id: Date.now(),
      x: Math.random() * 350 + 25,
      y: Math.random() * 500 + 50,
      connected: false
    }])
  }

  const updateConnections = () => {
    let connected = 0
    const updatedUsers = users.map(user => {
      const isConnected = towers.some(tower => {
        if (!tower.active) return false
        const distance = Math.sqrt(
          Math.pow(user.x - tower.x, 2) + Math.pow(user.y - tower.y, 2)
        )
        return distance <= tower.range
      })
      
      if (isConnected && !user.connected) {
        setScore(prev => prev + 10)
      }
      
      if (isConnected) connected++
      
      return { ...user, connected: isConnected }
    })
    
    setUsers(updatedUsers)
    setConnectedUsers(connected)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gamePhase !== 'playing') return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Check if clicking on existing tower
    const clickedTower = towers.find(tower => {
      const distance = Math.sqrt(Math.pow(x - tower.x, 2) + Math.pow(y - tower.y, 2))
      return distance <= 30
    })
    
    if (clickedTower) {
      setSelectedTower(clickedTower.id)
    } else if (towers.length < 5) {
      // Add new tower
      const newTower: Tower = {
        id: towers.length + 1,
        x,
        y,
        range: 80,
        active: true
      }
      setTowers(prev => [...prev, newTower])
      setScore(prev => prev - 50) // Cost to build tower
    }
  }

  const upgradeTower = () => {
    if (selectedTower && score >= 100) {
      setTowers(prev => prev.map(tower => 
        tower.id === selectedTower 
          ? { ...tower, range: Math.min(tower.range + 20, 150) }
          : tower
      ))
      setScore(prev => prev - 100)
    }
  }

  const drawGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw towers and ranges
    towers.forEach(tower => {
      // Draw range circle
      ctx.beginPath()
      ctx.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI)
      ctx.fillStyle = tower.id === selectedTower ? 'rgba(99, 102, 241, 0.2)' : 'rgba(59, 130, 246, 0.1)'
      ctx.fill()
      ctx.strokeStyle = tower.id === selectedTower ? '#6366f1' : '#3b82f6'
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
      
      // Draw tower
      ctx.beginPath()
      ctx.arc(tower.x, tower.y, 25, 0, 2 * Math.PI)
      ctx.fillStyle = tower.active ? '#6366f1' : '#64748b'
      ctx.fill()
      ctx.strokeStyle = tower.id === selectedTower ? '#fbbf24' : '#1e293b'
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Tower icon
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('📡', tower.x, tower.y + 5)
    })
    
    // Draw users
    users.forEach(user => {
      ctx.beginPath()
      ctx.arc(user.x, user.y, 12, 0, 2 * Math.PI)
      ctx.fillStyle = user.connected ? '#10b981' : '#ef4444'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // User icon
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('📱', user.x, user.y + 4)
    })
  }

  const completeGame = () => {
    setGamePhase('complete')
    const coveragePercent = connectedUsers / users.length
    const finalScore = Math.floor(score + (coveragePercent * 500))
    const perfect = coveragePercent >= 0.9
    onComplete(activity.id, finalScore, perfect)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <div>
          <h2 className="text-xl font-bold text-white">📡 {activity.title}</h2>
          <p className="text-blue-200">Connect users with signal towers</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/10">
        <div className="flex items-center space-x-4">
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white font-bold">{timeLeft}s</span>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white font-bold">{score} pts</span>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg px-3 py-1">
          <span className="text-white">{connectedUsers}/{users.length} connected</span>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 p-4">
        <div className="bg-black/20 rounded-2xl p-4 h-full">
          <canvas
            ref={canvasRef}
            width={400}
            height={500}
            onClick={handleCanvasClick}
            className="w-full h-full rounded-xl cursor-pointer"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-white text-sm">Tap to place towers</span>
          </div>
          {selectedTower && (
            <button
              onClick={upgradeTower}
              disabled={score < 100}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Upgrade (100pts)
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center space-x-4 text-xs text-white/70">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Disconnected</span>
          </div>
        </div>
      </div>
    </div>
  )
}