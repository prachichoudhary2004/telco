import React, { createContext, useContext, useState } from 'react'

interface ConfettiContextType {
  celebrate: (type?: 'complete' | 'perfect' | 'badge' | 'streak') => void
  showConfetti: boolean
}

const ConfettiContext = createContext<ConfettiContextType | null>(null)

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  const celebrate = (type: 'complete' | 'perfect' | 'badge' | 'streak' = 'complete') => {
    setShowConfetti(true)
    
    // Auto-hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }
  
  return (
    <ConfettiContext.Provider value={{ celebrate, showConfetti }}>
      {children}
      {showConfetti && <ConfettiEffect />}
    </ConfettiContext.Provider>
  )
}

function ConfettiEffect() {
  const particles = Array.from({ length: 50 }, (_, i) => i)
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle}
          className="absolute animate-bounce-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <div 
            className="w-3 h-3 rounded-full opacity-80"
            style={{
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function useConfetti() {
  const context = useContext(ConfettiContext)
  if (!context) {
    throw new Error('useConfetti must be used within ConfettiProvider')
  }
  return context
}