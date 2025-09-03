import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Trophy, Coins, Smartphone, Gamepad2, Sparkles, Users, Shield } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/dashboard')
  }

  const features = [
    {
      icon: <Gamepad2 className="text-indigo-400" size={32} />,
      title: "Interactive Games",
      description: "Play engaging mini-games and earn tokens while learning about telecom"
    },
    {
      icon: <Coins className="text-yellow-400" size={32} />,
      title: "Token Rewards",
      description: "Collect tokens for completing activities and redeem them for real telco perks"
    },
    {
      icon: <Trophy className="text-orange-400" size={32} />,
      title: "Achievements",
      description: "Unlock badges and climb the leaderboard by completing challenges"
    },
    {
      icon: <Sparkles className="text-purple-400" size={32} />,
      title: "AI Assistant",
      description: "Generate social content to share your achievements with AI-powered tools"
    },
    {
      icon: <Users className="text-green-400" size={32} />,
      title: "Community",
      description: "Compete with friends and see who can earn the most rewards"
    },
    {
      icon: <Shield className="text-blue-400" size={32} />,
      title: "Web3 Secure",
      description: "Your rewards are secured with blockchain technology"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Mobile User",
      content: "I've earned over 1000 tokens just by playing games! Got free data for a month.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      name: "Mike Rodriguez", 
      role: "Power User",
      content: "The games are actually fun and educational. Love the tower defense strategy game!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    },
    {
      name: "Emily Davis",
      role: "Student",
      content: "Perfect way to learn about 5G and networking while earning rewards. Highly recommended!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        <div className="relative px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
                <Sparkles size={16} />
                <span>Web3 Gamified Loyalty Platform</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                TelcoRewards
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Play games, earn tokens, and unlock exclusive telco perks. 
              The future of customer loyalty is here.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start Playing</span>
              </button>
              
              <div className="flex items-center space-x-4 text-slate-300">
                <div className="flex items-center space-x-1">
                  <Smartphone size={16} />
                  <span className="text-sm">Mobile First</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield size={16} />
                  <span className="text-sm">Web3 Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-slate-400">Active Players</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-slate-400">Tokens Earned</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-slate-400">Available Perks</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-slate-400">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose TelcoRewards?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Experience the next generation of customer loyalty programs with gamification, 
              AI assistance, and blockchain rewards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-800/50 transition-all transform hover:scale-105"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-6 bg-slate-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Players Are Saying
            </h2>
            <p className="text-xl text-slate-400">
              Join thousands of satisfied users earning rewards daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-slate-300 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join the revolution in customer loyalty. Play games, earn tokens, get rewards.
          </p>
          
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl transition-all transform hover:scale-105"
          >
            Get Started Now
          </button>
          
          <p className="mt-4 text-sm text-slate-500">
            No sign-up required • Start playing immediately
          </p>
        </div>
      </div>
    </div>
  )
}