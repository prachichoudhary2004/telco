import React, { useState, useEffect } from 'react'
import { X, Clock, Check, AlertCircle } from 'lucide-react'

interface QuizGameProps {
  activity: any
  onComplete: (activityId: string, score: number, perfect?: boolean) => void
  onClose: () => void
}

const quizQuestions = [
  {
    id: 1,
    question: "What does 5G stand for?",
    options: [
      "5th Generation", 
      "5 Gigabytes", 
      "5 Gigahertz", 
      "5 Games"
    ],
    correct: 0,
    explanation: "5G stands for 5th Generation mobile network technology."
  },
  {
    id: 2,
    question: "Which frequency range is primarily used for 5G?",
    options: [
      "1-10 MHz", 
      "100-1000 MHz", 
      "1-100 GHz", 
      "Over 100 GHz"
    ],
    correct: 2,
    explanation: "5G operates in multiple frequency ranges, with millimeter waves (1-100 GHz) being key for high speeds."
  },
  {
    id: 3,
    question: "What is the main advantage of fiber optic cables?",
    options: [
      "Cheaper than copper", 
      "Higher data transmission speed", 
      "Easier to install", 
      "Works without electricity"
    ],
    correct: 1,
    explanation: "Fiber optic cables transmit data using light, allowing for much higher speeds than traditional copper cables."
  },
  {
    id: 4,
    question: "What does VoIP stand for?",
    options: [
      "Voice over Internet Protocol", 
      "Video over IP", 
      "Virtual Online IP", 
      "Voice of Internet People"
    ],
    correct: 0,
    explanation: "VoIP allows voice calls to be made over internet connections rather than traditional phone lines."
  },
  {
    id: 5,
    question: "Which technology enables phone calls without cell towers?",
    options: [
      "Bluetooth", 
      "WiFi Calling", 
      "Satellite Communication", 
      "Radio Waves"
    ],
    correct: 2,
    explanation: "Satellite communication allows calls in remote areas without traditional cell tower infrastructure."
  }
]

export default function QuizGame({ activity, onComplete, onClose }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gamePhase, setGamePhase] = useState<'playing' | 'feedback' | 'complete'>('playing')
  const [showExplanation, setShowExplanation] = useState(false)

  // Timer effect
  useEffect(() => {
    if (gamePhase !== 'playing' || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, gamePhase])

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setGamePhase('feedback')
      setShowExplanation(true)
      setTimeout(nextQuestion, 2500)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (gamePhase !== 'playing') return
    
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct
    
    if (isCorrect) {
      setScore(prev => prev + Math.max(100, timeLeft * 3))
    }
    
    setGamePhase('feedback')
    setShowExplanation(true)
    
    setTimeout(nextQuestion, 2500)
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
      setGamePhase('playing')
      setShowExplanation(false)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setGamePhase('complete')
    const maxScore = quizQuestions.length * 100
    const perfect = score >= maxScore * 0.8
    onComplete(activity.id, score, perfect)
  }

  const question = quizQuestions[currentQuestion]
  const isCorrect = selectedAnswer === question.correct

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 to-purple-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-black/20">
        <div>
          <h2 className="text-xl font-bold text-white">📚 {activity.title}</h2>
          <p className="text-indigo-200">Question {currentQuestion + 1} of {quizQuestions.length}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Timer and Score */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/10">
        <div className="flex items-center space-x-3">
          <Clock className="text-white" size={20} />
          <div className="bg-black/30 rounded-full px-4 py-2">
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-300' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <div className="bg-black/30 rounded-full px-4 py-2">
          <span className="text-white font-bold">{score} pts</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {question.question}
          </h3>
          
          {/* Progress Bar */}
          <div className="bg-black/20 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full p-4 rounded-xl text-left font-medium transition-all transform hover:scale-105 "
            
            if (gamePhase === 'playing') {
              buttonClass += "bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 hover:border-white/40"
            } else if (showExplanation) {
              if (index === question.correct) {
                buttonClass += "bg-green-500/30 border-2 border-green-400 text-green-100"
              } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
                buttonClass += "bg-red-500/30 border-2 border-red-400 text-red-100"
              } else {
                buttonClass += "bg-white/5 border-2 border-white/10 text-white/60"
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={gamePhase !== 'playing'}
                className={buttonClass}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    gamePhase === 'playing' ? 'bg-white/20 text-white' :
                    index === question.correct ? 'bg-green-400 text-white' :
                    index === selectedAnswer ? 'bg-red-400 text-white' : 'bg-white/10 text-white/60'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showExplanation && index === question.correct && (
                    <Check className="text-green-400" size={20} />
                  )}
                  {showExplanation && index === selectedAnswer && selectedAnswer !== question.correct && (
                    <AlertCircle className="text-red-400" size={20} />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 bg-black/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? <Check size={16} className="text-white" /> : <AlertCircle size={16} className="text-white" />}
              </div>
              <div>
                <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-white/80">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}