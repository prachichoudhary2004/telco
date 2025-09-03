import React, { useState } from 'react'
import { ArrowLeft, Wallet, Gift, Clock, CheckCircle, X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'

export default function WalletPage() {
  const navigate = useNavigate()
  const { state, redeemPerk, speak } = useApp()
  const [selectedPerk, setSelectedPerk] = useState<string | null>(null)
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)
  const { t } = useI18n()

  const handleRedeemPerk = (perkId: string, cost: number) => {
    if (!state.user || state.user.tokens < cost) return
    
    redeemPerk(perkId, cost)
    setSelectedPerk(null)
    setRedeemSuccess(perkId)
    
    setTimeout(() => {
      setRedeemSuccess(null)
    }, 3000)
  }

  const selectedPerkData = state.telcoPerks.find(p => p.id === selectedPerk)

  return (
    <div className="mobile-nav-height bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from_green-600 to-emerald-600 px-6 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('wallet.title')}</h1>
            <p className="text-green-200">{t('wallet.subtitle')}</p>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">{t('wallet.balance')}</p>
              <div className="flex items-center space-x-2">
                <Wallet className="text-white" size={24} />
                <span className="text-3xl font-bold text-white">{state.user?.tokens || 0}</span>
                <span className="text-green-200">{t('wallet.tokens')}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">{t('wallet.total_earned')}</p>
              <p className="text-xl font-semibold text-white">
                {(state.user?.tokens || 0) + 500}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {redeemSuccess && (
        <div className="mx-6 mt-4 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-400" size={20} />
            <p className="text-green-200">{t('wallet.perk_success')}</p>
          </div>
        </div>
      )}

      {/* Available Perks */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-semibold text-white mb-4">{t('wallet.available_perks')}</h2>
        
        <div className="space-y-4">
          {state.telcoPerks.map((perk) => {
            const canAfford = (state.user?.tokens || 0) >= perk.cost
            const isLimited = perk.availability === 'limited'
            const isSoldOut = perk.availability === 'sold_out'
            
            return (
              <div
                key={perk.id}
                className={`bg-slate-800 rounded-2xl overflow-hidden ${
                  isSoldOut ? 'opacity-50' : ''
                }`}
              >
                <div className="flex">
                  <div className="w-24 h-24 bg-slate-700">
                    <img
                      src={perk.image}
                      alt={perk.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${perk.name}`
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify_between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{perk.name}</h3>
                        <p className="text-sm text-slate-400 mb-2">{perk.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>Category: {perk.category}</span>
                          <span>Valid until: {new Date(perk.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-lg font-bold text-yellow-400">{perk.cost}</span>
                          <span className="text-sm text-slate-400">{t('wallet.tokens')}</span>
                        </div>
                        
                        {isLimited && (
                          <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                            {t('wallet.limited')}
                          </span>
                        )}
                        
                        {isSoldOut && (
                          <span className="inline-block px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                            {t('wallet.sold_out')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        speak(t('wallet.redeem'))
                        setSelectedPerk(perk.id)
                      }}
                      disabled={!canAfford || isSoldOut}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        canAfford && !isSoldOut
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isSoldOut ? t('wallet.sold_out') : canAfford ? t('wallet.redeem') : t('wallet.insufficient')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {state.telcoPerks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('wallet.empty_title')}</h3>
            <p className="text-slate-400">{t('wallet.empty_desc')}</p>
          </div>
        )}
      </div>

      {/* How to Earn More */}
      <div className="px-6 py-6">
        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('wallet.how_to_earn')}</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-sm">📚</span>
              </div>
              <div>
                <p className="text-white font-medium">{t('wallet.complete_activities')}</p>
                <p className="text-sm text-slate-400">Earn 30-100 tokens per activity</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items_center justify_center">
                <span className="text-orange-400 text-sm">🔥</span>
              </div>
              <div>
                <p className="text-white font_medium">{t('wallet.bonus_streaks')}</p>
                <p className="text-sm text-slate-400">Bonus tokens for daily login</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-sm">🏆</span>
              </div>
              <div>
                <p className="text-white font-medium">{t('wallet.perfect_scores')}</p>
                <p className="text-sm text-slate-400">Double rewards for excellence</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/activities')}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
          >
            {t('wallet.start_earning')}
          </button>
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      {selectedPerkData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">{t('wallet.confirm_redemption')}</h3>
              <button
                onClick={() => setSelectedPerk(null)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={selectedPerkData.image}
                  alt={selectedPerkData.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedPerkData.name}`
                  }}
                />
                <div>
                  <h4 className="font-semibold text-white">{selectedPerkData.name}</h4>
                  <p className="text-sm text-slate-400">{selectedPerkData.description}</p>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">{t('wallet.cost')}</span>
                  <span className="font-semibold text-yellow-400">{selectedPerkData.cost} {t('wallet.tokens')}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">{t('wallet.your_balance')}</span>
                  <span className="font-semibold text-white">{state.user?.tokens || 0} {t('wallet.tokens')}</span>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">{t('wallet.after_redemption')}</span>
                    <span className="font-semibold text-green-400">
                      {(state.user?.tokens || 0) - selectedPerkData.cost} {t('wallet.tokens')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPerk(null)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl font-medium transition-colors hover:bg-slate-700"
                >
                  {t('wallet.cancel')}
                </button>
                <button
                  onClick={() => {
                    speak(t('wallet.redeem_now'))
                    handleRedeemPerk(selectedPerkData.id, selectedPerkData.cost)
                  }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  {t('wallet.redeem_now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}