import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Smartphone, Coins, Trophy, Sparkles, Play, ArrowRight, Gift, Zap, Shield } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Coins,
      title: 'Earn Tokens',
      description: 'Complete activities and earn tokens for real telco perks'
    },
    {
      icon: Trophy,
      title: 'Badges & Achievements',
      description: 'Unlock badges and climb the leaderboard'
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Generate social content for your achievements'
    },
    {
      icon: Gift,
      title: 'Real Rewards',
      description: 'Redeem tokens for data, minutes, and premium features'
    }
  ]

  const steps = [
    {
      icon: Play,
      title: 'Play Games',
      description: 'Complete quizzes, puzzles, and mini-games'
    },
    {
      icon: Coins,
      title: 'Earn Tokens',
      description: 'Get rewarded for every activity you complete'
    },
    {
      icon: Gift,
      title: 'Redeem Perks',
      description: 'Exchange tokens for real telco benefits'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative px-6 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                <Smartphone className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white">TelcoRewards</h1>
            </div>

            {/* Hero Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gamified Loyalty
              <br />
              <span className="text-yellow-300">Rewards</span>
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Earn tokens through fun activities and redeem them for real telco perks. 
              The future of customer loyalty is here!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Earning</span>
                <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-white/70">Tokens Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-white/70">Available Perks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">Why Choose TelcoRewards?</h3>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Experience the next generation of customer loyalty with gamified experiences 
              and real rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="p-3 bg-indigo-500/20 rounded-xl w-fit mb-4 group-hover:bg-indigo-500/30 transition-colors">
                    <Icon className="text-indigo-400" size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-slate-400 text-lg">
              Three simple steps to start earning rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="p-6 bg-indigo-600 rounded-full w-fit mx-auto mb-6">
                      <Icon className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="text-green-400" size={32} />
            <h3 className="text-2xl font-bold text-white">Secure & Transparent</h3>
          </div>
          <p className="text-slate-400 text-lg mb-8">
            Built with Web3 principles for transparency and security. 
            Your rewards are tracked on blockchain-inspired technology.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Zap className="text-yellow-400" size={16} />
              <span>Instant Rewards</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Shield className="text-green-400" size={16} />
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Sparkles className="text-indigo-400" size={16} />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h3>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of users already earning tokens and redeeming amazing perks
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}