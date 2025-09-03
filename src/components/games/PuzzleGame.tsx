import React, { useState, useEffect } from 'react'
import { X, RotateCcw, Lightbulb, CheckCircle } from 'lucide-react'

interface PuzzleGameProps {
  activity: any
  onComplete: (activityId: string, score: number, perfect?: boolean) => void
  onClose: () => void
}

interface Connection {
  from: string
  to: string
}

const networkNodes = [
  { id: 'user1', type: 'user', label: 'User A', x: 50, y: 100 },
  { id: 'user2', type: 'user', label: 'User B', x: 50, y: 200 },
  { id: 'user3', type: 'user', label: 'User C', x: 50, y: 300 },
  { id: 'router1', type: 'router', label: 'Router 1', x: 200, y: 150 },
  { id: 'router2', type: 'router', label: 'Router 2', x: 200, y: 250 },
  { id: 'server', type: 'server', label: 'Server', x: 350, y: 200 },
]

const correctConnections: Connection[] = [
  { from: 'user1', to: 'router1' },
  { from: 'user2', to: 'router1' },
  { from: 'user3', to: 'router2' },
  { from: 'router1', to: 'server' },
  { from: 'router2', to: 'server' },
]

export default function PuzzleGame({ activity, onComplete, onClose }: PuzzleGameProps) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [gamePhase, setGamePhase] = useState<'playing' | 'complete'>('playing')
  const [hints, setHints] = useState(3)
  const [showHint, setShowHint] = useState(false)

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

  // Check win condition
  useEffect(() => {
    checkWinCondition()
  }, [connections])

  const handleNodeClick = (nodeId: string) => {
    if (gamePhase !== 'playing') return
    
    if (selectedNode === null) {
      setSelectedNode(nodeId)
    } else if (selectedNode === nodeId) {
      setSelectedNode(null)
    } else {
      // Create connection
      const newConnection = { from: selectedNode, to: nodeId }
      const reverseConnection = { from: nodeId, to: selectedNode }
      
      // Check if connection already exists
      const exists = connections.some(conn => 
        (conn.from === selectedNode && conn.to === nodeId) ||
        (conn.from === nodeId && conn.to === selectedNode)
      )
      
      if (!exists) {
        setConnections(prev => [...prev, newConnection])
      }
      
      setSelectedNode(null)
    }
  }

  const removeConnection = (from: string, to: string) => {
    setConnections(prev => prev.filter(conn => 
      !(conn.from === from && conn.to === to) && 
      !(conn.from === to && conn.to === from)
    ))
  }

  const checkWinCondition = () => {
    if (connections.length !== correctConnections.length) return
    
    const isCorrect = correctConnections.every(correctConn => 
      connections.some(conn => 
        (conn.from === correctConn.from && conn.to === correctConn.to) ||
        (conn.from === correctConn.to && conn.to === correctConn.from)
      )
    )
    
    if (isCorrect) {
      setTimeout(() => {
        completeGame(true)
      }, 1000)
    }
  }

  const resetGame = () => {
    setConnections([])
    setSelectedNode(null)
    setScore(0)
    setTimeLeft(120)
    setGamePhase('playing')
    setHints(3)
    setShowHint(false)
  }

  const useHint = () => {
    if (hints <= 0) return
    
    setHints(prev => prev - 1)
    setShowHint(true)
    
    setTimeout(() => {
      setShowHint(false)
    }, 3000)
  }

  const completeGame = (won = false) => {
    setGamePhase('complete')
    let finalScore = connections.length * 50
    
    if (won) {
      finalScore += timeLeft * 2 // Time bonus
      finalScore += hints * 100 // Hint bonus
      finalScore += 500 // Completion bonus
    }
    
    setScore(finalScore)
    const perfect = won && hints === 3 && timeLeft > 60
    onComplete(activity.id, finalScore, perfect)
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤'
      case 'router': return '📡'
      case 'server': return '🖥️'
      default: return '⚪'
    }
  }

  const getNodeColor = (type: string, nodeId: string) => {
    const isSelected = selectedNode === nodeId
    const baseColors = {
      user: isSelected ? 'bg-blue-500' : 'bg-blue-600',
      router: isSelected ? 'bg-green-500' : 'bg-green-600',
      server: isSelected ? 'bg-purple-500' : 'bg-purple-600'
    }
    return baseColors[type as keyof typeof baseColors] || 'bg-gray-600'
  }

  const isConnectionCorrect = (from: string, to: string) => {
    return correctConnections.some(conn => 
      (conn.from === from && conn.to === to) ||
      (conn.from === to && conn.to === from)
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 to-purple-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <div>
          <h2 className="text-xl font-bold text-white">🧩 {activity.title}</h2>
          <p className="text-indigo-200">Connect network components correctly</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={useHint}
            disabled={hints <= 0}
            className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 rounded-lg text-white text-sm transition-colors"
          >
            <Lightbulb size={16} />
            <span>{hints}</span>
          </button>
          <button
            onClick={resetGame}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="text-white" size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="text-white" size={24} />
          </button>
        </div>
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
          <span className="text-white">{connections.length}/{correctConnections.length} connections</span>
        </div>
      </div>

      {/* Hint Display */}
      {showHint && (
        <div className="mx-4 my-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="text-yellow-400" size={16} />
            <p className="text-yellow-200 text-sm">
              💡 Connect users to routers, then routers to the server. Each user needs network access!
            </p>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="flex-1 p-4">
        <div className="bg-black/20 rounded-2xl p-6 h-full relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {/* Draw connections */}
            {connections.map((connection, index) => {
              const fromNode = networkNodes.find(n => n.id === connection.from)
              const toNode = networkNodes.find(n => n.id === connection.to)
              
              if (!fromNode || !toNode) return null
              
              const isCorrect = isConnectionCorrect(connection.from, connection.to)
              
              return (
                <line
                  key={index}
                  x1={fromNode.x + 30}
                  y1={fromNode.y + 30}
                  x2={toNode.x + 30}
                  y2={toNode.y + 30}
                  stroke={isCorrect ? '#10b981' : '#ef4444'}
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-opacity-80"
                  onClick={() => removeConnection(connection.from, connection.to)}
                />
              )
            })}
            
            {/* Draw hint connections */}
            {showHint && correctConnections.map((connection, index) => {
              const fromNode = networkNodes.find(n => n.id === connection.from)
              const toNode = networkNodes.find(n => n.id === connection.to)
              
              if (!fromNode || !toNode) return null
              
              const exists = connections.some(conn => 
                (conn.from === connection.from && conn.to === connection.to) ||
                (conn.from === connection.to && conn.to === connection.from)
              )
              
              if (exists) return null
              
              return (
                <line
                  key={`hint-${index}`}
                  x1={fromNode.x + 30}
                  y1={fromNode.y + 30}
                  x2={toNode.x + 30}
                  y2={toNode.y + 30}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.7"
                />
              )
            })}
          </svg>
          
          {/* Network Nodes */}
          {networkNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={`absolute w-16 h-16 rounded-full cursor-pointer transition-all transform hover:scale-110 ${
                getNodeColor(node.type, node.id)
              } flex items-center justify-center shadow-lg ${
                selectedNode === node.id ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
              }`}
              style={{ left: node.x, top: node.y }}
            >
              <div className="text-center">
                <div className="text-xl">{getNodeIcon(node.type)}</div>
              </div>
            </div>
          ))}
          
          {/* Node Labels */}
          {networkNodes.map((node) => (
            <div
              key={`${node.id}-label`}
              className="absolute text-white text-xs font-medium text-center pointer-events-none"
              style={{ 
                left: node.x - 10, 
                top: node.y + 70,
                width: 80
              }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/10">
        <div className="text-center text-white/70 text-sm space-y-1">
          <p>🎯 Click nodes to select, then click another to connect</p>
          <p>💡 Create a network path from users to server through routers</p>
          <p>🔗 Click connections to remove them</p>
        </div>
      </div>
    </div>
  )
}