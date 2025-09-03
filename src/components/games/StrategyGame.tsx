import React, { useState, useEffect, useCallback } from 'react'
import { X, Play, Pause, Shield, Zap, Settings } from 'lucide-react'

interface StrategyGameProps {
  activity: any
  onComplete: (activityId: string, score: number, perfect?: boolean) => void
  onClose: () => void
}

interface Tower {
  id: number
  x: number
  y: number
  type: 'basic' | 'advanced' | 'super'
  damage: number
  range: number
  cost: number
  level: number
}

interface Enemy {
  id: number
  x: number
  y: number
  health: number
  maxHealth: number
  speed: number
  reward: number
  pathIndex: number
}

const towerTypes = {
  basic: { damage: 20, range: 80, cost: 100, color: '#3b82f6' },
  advanced: { damage: 40, range: 100, cost: 200, color: '#10b981' },
  super: { damage: 80, range: 120, cost: 400, color: '#f59e0b' }
}

const path = [
  { x: 0, y: 250 },
  { x: 100, y: 250 },
  { x: 100, y: 150 },
  { x: 200, y: 150 },
  { x: 200, y: 350 },
  { x: 300, y: 350 },
  { x: 300, y: 100 },
  { x: 400, y: 100 }
]

export default function StrategyGame({ activity, onComplete, onClose }: StrategyGameProps) {
  const [towers, setTowers] = useState<Tower[]>([])
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [score, setScore] = useState(0)
  const [money, setMoney] = useState(500)
  const [lives, setLives] = useState(10)
  const [wave, setWave] = useState(1)
  const [gamePhase, setGamePhase] = useState<'playing' | 'paused' | 'complete'>('playing')
  const [selectedTowerType, setSelectedTowerType] = useState<'basic' | 'advanced' | 'super'>('basic')
  const [waveInProgress, setWaveInProgress] = useState(false)

  // Game loop
  useEffect(() => {
    if (gamePhase !== 'playing') return
    
    const gameLoop = setInterval(() => {
      updateGame()
    }, 100)
    
    return () => clearInterval(gameLoop)
  }, [gamePhase, enemies, towers])

  // Wave spawning
  useEffect(() => {
    if (gamePhase === 'playing' && !waveInProgress && enemies.length === 0) {
      startWave()
    }
  }, [gamePhase, enemies.length, waveInProgress])

  const updateGame = useCallback(() => {
    // Move enemies
    setEnemies(prev => prev.map(enemy => {
      const nextPathIndex = Math.min(enemy.pathIndex + 1, path.length - 1)
      const target = path[nextPathIndex]
      
      const dx = target.x - enemy.x
      const dy = target.y - enemy.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < enemy.speed) {
        if (nextPathIndex >= path.length - 1) {
          // Enemy reached end
          setLives(prev => prev - 1)
          return null
        }
        return { ...enemy, x: target.x, y: target.y, pathIndex: nextPathIndex }
      }
      
      const moveX = (dx / distance) * enemy.speed
      const moveY = (dy / distance) * enemy.speed
      
      return { ...enemy, x: enemy.x + moveX, y: enemy.y + moveY }
    }).filter(Boolean) as Enemy[])
    
    // Tower shooting
    setTowers(prev => prev.map(tower => {
      const enemiesInRange = enemies.filter(enemy => {
        const dx = enemy.x - tower.x
        const dy = enemy.y - tower.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= tower.range && enemy.health > 0
      })
      
      if (enemiesInRange.length > 0) {
        const target = enemiesInRange[0]
        setEnemies(prev => prev.map(enemy => 
          enemy.id === target.id 
            ? { ...enemy, health: Math.max(0, enemy.health - tower.damage) }
            : enemy
        ))
      }
      
      return tower
    }))
    
    // Remove dead enemies and award money
    setEnemies(prev => {
      const deadEnemies = prev.filter(enemy => enemy.health <= 0)
      if (deadEnemies.length > 0) {
        setMoney(prev => prev + deadEnemies.reduce((sum, enemy) => sum + enemy.reward, 0))
        setScore(prev => prev + deadEnemies.length * 10)
      }
      return prev.filter(enemy => enemy.health > 0)
    })
  }, [enemies, towers])

  const startWave = () => {
    setWaveInProgress(true)
    const enemyCount = 5 + wave * 2
    const enemyHealth = 50 + wave * 20
    
    let spawnCount = 0
    const spawnInterval = setInterval(() => {
      if (spawnCount >= enemyCount) {
        clearInterval(spawnInterval)
        setWaveInProgress(false)
        return
      }
      
      setEnemies(prev => [...prev, {
        id: Date.now() + spawnCount,
        x: path[0].x,
        y: path[0].y,
        health: enemyHealth,
        maxHealth: enemyHealth,
        speed: 1 + wave * 0.2,
        reward: 20 + wave * 5,
        pathIndex: 0
      }])
      
      spawnCount++
    }, 1000)
  }

  const placeTower = (x: number, y: number) => {
    const towerType = towerTypes[selectedTowerType]
    
    if (money < towerType.cost) return
    if (gamePhase !== 'playing') return
    
    // Check if position is on path
    const onPath = path.some(point => {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
      return distance < 40
    })
    
    if (onPath) return
    
    // Check if position conflicts with existing tower
    const conflict = towers.some(tower => {
      const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2)
      return distance < 50
    })
    
    if (conflict) return
    
    setTowers(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      type: selectedTowerType,
      damage: towerType.damage,
      range: towerType.range,
      cost: towerType.cost,
      level: 1
    }])
    
    setMoney(prev => prev - towerType.cost)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    placeTower(x, y)
  }

  const nextWave = () => {
    if (enemies.length === 0 && !waveInProgress) {
      setWave(prev => prev + 1)
      setMoney(prev => prev + 100) // Wave bonus
    }
  }

  const completeGame = () => {
    setGamePhase('complete')
    const survivalBonus = lives * 100
    const waveBonus = (wave - 1) * 200
    const finalScore = score + survivalBonus + waveBonus
    const perfect = lives >= 8 && wave >= 5
    onComplete(activity.id, finalScore, perfect)
  }

  // Check game over
  useEffect(() => {
    if (lives <= 0) {
      completeGame()
    }
  }, [lives])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <div>
          <h2 className="text-xl font-bold text-white">🏗️ {activity.title}</h2>
          <p className="text-gray-200">Defend your network infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setGamePhase(gamePhase === 'playing' ? 'paused' : 'playing')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {gamePhase === 'playing' ? <Pause className="text-white" size={20} /> : <Play className="text-white" size={20} />}
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
          <div className="flex items-center space-x-1">
            <Shield className="text-red-400" size={16} />
            <span className="text-white font-bold">{lives}</span>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white font-bold">${money}</span>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white font-bold">{score} pts</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white">Wave {wave}</span>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white">{enemies.length} enemies</span>
          </div>
        </div>
      </div>

      {/* Tower Selection */}
      <div className="px-4 py-2 bg-black/5">
        <div className="flex space-x-2">
          {Object.entries(towerTypes).map(([type, stats]) => (
            <button
              key={type}
              onClick={() => setSelectedTowerType(type as any)}
              disabled={money < stats.cost}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTowerType === type
                  ? 'bg-blue-600 text-white'
                  : money >= stats.cost
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stats.color }}
              />
              <span>{type} (${stats.cost})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 p-4">
        <div 
          className="bg-black/20 rounded-2xl relative w-full h-full overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ minHeight: '400px' }}
        >
          {/* Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {path.map((point, index) => {
              if (index === 0) return null
              const prevPoint = path[index - 1]
              return (
                <line
                  key={index}
                  x1={prevPoint.x}
                  y1={prevPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke="#475569"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>
          
          {/* Towers */}
          {towers.map((tower) => (
            <div key={tower.id}>
              {/* Range circle */}
              <div
                className="absolute border border-white/20 rounded-full pointer-events-none"
                style={{
                  left: tower.x - tower.range,
                  top: tower.y - tower.range,
                  width: tower.range * 2,
                  height: tower.range * 2,
                }}
              />
              {/* Tower */}
              <div
                className="absolute w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-white pointer-events-none"
                style={{
                  left: tower.x - 20,
                  top: tower.y - 20,
                  backgroundColor: towerTypes[tower.type].color,
                }}
              >
                🏗️
              </div>
            </div>
          ))}
          
          {/* Enemies */}
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              className="absolute w-6 h-6 rounded-full bg-red-500 border-2 border-red-300 flex items-center justify-center text-xs font-bold text-white pointer-events-none"
              style={{
                left: enemy.x - 12,
                top: enemy.y - 12,
              }}
            >
              💀
              {/* Health bar */}
              <div 
                className="absolute -top-2 left-0 h-1 bg-green-500 rounded-full"
                style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-sm">
            💡 Click empty areas to build towers • Defend against data breaches!
          </div>
          {!waveInProgress && enemies.length === 0 && (
            <button
              onClick={nextWave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Next Wave
            </button>
          )}
        </div>
      </div>
    </div>
  )
}