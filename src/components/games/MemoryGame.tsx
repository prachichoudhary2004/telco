import React, { useState, useEffect } from 'react'
import { X, RotateCcw, Trophy } from 'lucide-react'

interface MemoryGameProps {
  activity: any
  onComplete: (activityId: string, score: number, perfect?: boolean) => void
  onClose: () => void
}

interface Card {
  id: number
  icon: string
  name: string
  flipped: boolean
  matched: boolean
}

const cardPairs = [
  { icon: '📱', name: 'Mobile' },
  { icon: '📡', name: 'Tower' },
  { icon: '🌐', name: 'Internet' },
  { icon: '📶', name: 'Signal' },
  { icon: '💬', name: 'Message' },
  { icon: '📞', name: 'Call' },
  { icon: '📊', name: 'Data' },
  { icon: '🔒', name: 'Security' },
]

export default function MemoryGame({ activity, onComplete, onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gamePhase, setGamePhase] = useState<'playing' | 'complete'>('playing')

  // Initialize game
  useEffect(() => {
    initializeCards()
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

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)
      
      if (firstCard && secondCard && firstCard.name === secondCard.name) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, matched: true } 
              : card
          ))
          setMatchedPairs(prev => prev + 1)
          setScore(prev => prev + Math.max(50, timeLeft))
          setFlippedCards([])
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, flipped: false } 
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, cards, timeLeft])

  // Check win condition
  useEffect(() => {
    if (matchedPairs === cardPairs.length) {
      setTimeout(() => {
        completeGame(true)
      }, 500)
    }
  }, [matchedPairs])

  const initializeCards = () => {
    const shuffledCards = [...cardPairs, ...cardPairs]
      .map((pair, index) => ({
        id: index,
        icon: pair.icon,
        name: pair.name,
        flipped: false,
        matched: false
      }))
      .sort(() => Math.random() - 0.5)
    
    setCards(shuffledCards)
  }

  const handleCardClick = (cardId: number) => {
    if (gamePhase !== 'playing') return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.matched) return

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ))
    setFlippedCards(prev => [...prev, cardId])
  }

  const resetGame = () => {
    setCards([])
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setScore(0)
    setTimeLeft(90)
    setGamePhase('playing')
    initializeCards()
  }

  const completeGame = (won = false) => {
    setGamePhase('complete')
    let finalScore = score
    if (won) {
      finalScore += timeLeft * 5 // Time bonus
      finalScore += Math.max(0, (50 - moves) * 10) // Efficiency bonus
    }
    
    const perfect = won && moves <= cardPairs.length + 3
    onComplete(activity.id, finalScore, perfect)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 to-pink-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        <div>
          <h2 className="text-xl font-bold text-white">🧠 {activity.title}</h2>
          <p className="text-purple-200">Match telecom-related pairs</p>
        </div>
        <div className="flex items-center space-x-2">
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
        <div className="flex items-center space-x-4">
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white">Moves: {moves}</span>
          </div>
          <div className="bg-black/30 rounded-lg px-3 py-1">
            <span className="text-white">{matchedPairs}/{cardPairs.length}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 p-4">
        <div className="bg-black/20 rounded-2xl p-4 h-full">
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  card.flipped || card.matched
                    ? card.matched
                      ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg'
                      : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg'
                    : 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {card.flipped || card.matched ? (
                    <div className="text-center">
                      <div className="text-3xl mb-1">{card.icon}</div>
                      <div className="text-xs text-white font-medium">{card.name}</div>
                    </div>
                  ) : (
                    <div className="text-2xl">❓</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-sm mx-auto">
            <div className="bg-black/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-3 transition-all duration-300"
                style={{ width: `${(matchedPairs / cardPairs.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-center mt-2">
              <Trophy className="text-yellow-400 mr-2" size={16} />
              <span className="text-white text-sm">
                {matchedPairs === cardPairs.length ? 'Perfect! All pairs matched!' : `${matchedPairs} of ${cardPairs.length} pairs found`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/10">
        <div className="text-center text-white/70 text-sm">
          <p>💡 Tap cards to flip them. Match pairs of telecom icons!</p>
          <p>Bonus points for speed and fewer moves.</p>
        </div>
      </div>
    </div>
  )
}