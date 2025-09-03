import React, { createContext, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext'

type LanguageCode = 'en' | 'hi'

type Translations = Record<string, { en: string; hi: string }>

const translations: Translations = {
  'nav.home': { en: 'Home', hi: 'घर' },
  'nav.activities': { en: 'Activities', hi: 'गतिविधियाँ' },
  'nav.wallet': { en: 'Wallet', hi: 'वॉलेट' },
  'nav.leaderboard': { en: 'Ranking', hi: 'रैंकिंग' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल' },

  'dashboard.welcome': { en: 'Welcome back!', hi: 'वापसी पर स्वागत है!' },
  'dashboard.level': { en: 'Level', hi: 'स्तर' },
  'dashboard.tokens': { en: 'Tokens', hi: 'टोकन' },
  'dashboard.day_streak': { en: 'Day Streak', hi: 'दिन की श्रृंखला' },
  'dashboard.badges': { en: 'Badges', hi: 'बैज' },
  'dashboard.daily_challenge': { en: 'Daily Challenge', hi: 'दैनिक चुनौती' },
  'dashboard.complete_3': { en: 'Complete 3 Activities', hi: '3 गतिविधियाँ पूरी करें' },
  'dashboard.earn_100': { en: 'Earn 100 bonus tokens', hi: '100 बोनस टोकन कमाएँ' },
  'dashboard.completed': { en: 'Completed', hi: 'पूर्ण' },
  'dashboard.celebrate': { en: 'Celebrate!', hi: 'जश्न मनाएँ!' },
  'dashboard.quick_actions': { en: 'Quick Actions', hi: 'त्वरित क्रियाएँ' },
  'dashboard.start_activity': { en: 'Start Activity', hi: 'गतिविधि शुरू करें' },
  'dashboard.earn_tokens': { en: 'Earn tokens', hi: 'टोकन कमाएँ' },
  'dashboard.ai_assistant': { en: 'AI Assistant', hi: 'एआई सहायक' },
  'dashboard.create_content': { en: 'Create content', hi: 'सामग्री बनाएँ' },
  'dashboard.recent_activity': { en: 'Recent Activity', hi: 'हाल की गतिविधि' },
  'dashboard.view_all': { en: 'View All', hi: 'सभी देखें' },
  'dashboard.no_activities': { en: 'No activities completed yet', hi: 'अभी तक कोई गतिविधि पूरी नहीं हुई' },
  'dashboard.start_first': { en: 'Start Your First Activity', hi: 'अपनी पहली गतिविधि शुरू करें' },
  'dashboard.latest_badges': { en: 'Latest Badges', hi: 'नवीनतम बैज' },
  'dashboard.weekly_insight': { en: 'Weekly Insight', hi: 'साप्ताहिक अंतर्दृष्टि' },
  'dashboard.insight_text': { en: "You've earned 25% more tokens this week compared to last week!\n            Keep up the great work!", hi: 'आपने इस सप्ताह पिछले सप्ताह की तुलना में 25% अधिक टोकन अर्जित किए हैं!\n            अच्छा काम जारी रखें!' },
  'dashboard.more_tokens': { en: '+180 tokens', hi: '+180 टोकन' },
  'dashboard.activities_count': { en: '5 activities', hi: '5 गतिविधियाँ' },

  'activities.title': { en: 'Activities', hi: 'गतिविधियाँ' },
  'activities.subtitle': { en: 'Play games and earn rewards', hi: 'गेम खेलें और पुरस्कार कमाएँ' },
  'activities.search_placeholder': { en: 'Search activities...', hi: 'गतिविधियाँ खोजें...' },
  'activities.completed': { en: 'Completed', hi: 'पूर्ण' },
  'activities.tokens': { en: 'Tokens', hi: 'टोकन' },
  'activities.xp': { en: 'XP', hi: 'एक्सपी' },
  'activities.min': { en: 'min', hi: 'मिनट' },
  'activities.play_again': { en: 'Play Again', hi: 'फिर से खेलें' },
  'activities.start': { en: 'Start', hi: 'शुरू करें' },
  'activities.empty_title': { en: 'No activities found', hi: 'कोई गतिविधि नहीं मिली' },
  'activities.empty_desc': { en: 'Try adjusting your search or filters', hi: 'अपनी खोज या फ़िल्टर समायोजित करें' },

  'wallet.title': { en: 'Token Wallet', hi: 'टोकन वॉलेट' },
  'wallet.subtitle': { en: 'Redeem tokens for telco perks', hi: 'टेल्को लाभों के लिए टोकन रिडीम करें' },
  'wallet.balance': { en: 'Available Balance', hi: 'उपलब्ध शेष राशि' },
  'wallet.tokens': { en: 'tokens', hi: 'टोकन' },
  'wallet.total_earned': { en: 'Total Earned', hi: 'कुल अर्जित' },
  'wallet.perk_success': { en: 'Perk redeemed successfully! Check your account.', hi: 'लाभ सफलतापूर्वक रिडीम हुआ! अपना खाता देखें।' },
  'wallet.available_perks': { en: 'Available Perks', hi: 'उपलब्ध लाभ' },
  'wallet.limited': { en: 'Limited', hi: 'सीमित' },
  'wallet.sold_out': { en: 'Sold Out', hi: 'स्टॉक ख़त्म' },
  'wallet.redeem': { en: 'Redeem', hi: 'रिडीम करें' },
  'wallet.insufficient': { en: 'Insufficient Tokens', hi: 'टोकन अपर्याप्त' },
  'wallet.empty_title': { en: 'No perks available', hi: 'कोई लाभ उपलब्ध नहीं' },
  'wallet.empty_desc': { en: 'Check back later for new rewards!', hi: 'नए पुरस्कारों के लिए बाद में देखें!' },
  'wallet.how_to_earn': { en: 'How to Earn More Tokens', hi: 'अधिक टोकन कैसे कमाएँ' },
  'wallet.complete_activities': { en: 'Complete Activities', hi: 'गतिविधियाँ पूरी करें' },
  'wallet.bonus_streaks': { en: 'Maintain Streaks', hi: 'श्रृंखला बनाए रखें' },
  'wallet.perfect_scores': { en: 'Perfect Scores', hi: 'परफेक्ट स्कोर' },
  'wallet.start_earning': { en: 'Start Earning Now', hi: 'अभी कमाना शुरू करें' },
  'wallet.confirm_redemption': { en: 'Confirm Redemption', hi: 'रिडेम्पशन की पुष्टि करें' },
  'wallet.cost': { en: 'Cost:', hi: 'लागत:' },
  'wallet.your_balance': { en: 'Your Balance:', hi: 'आपका बैलेंस:' },
  'wallet.after_redemption': { en: 'After Redemption:', hi: 'रिडेम्पशन के बाद:' },
  'wallet.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'wallet.redeem_now': { en: 'Redeem Now', hi: 'अभी रिडीम करें' },

  'leaderboard.title': { en: 'Leaderboard', hi: 'लीडरबोर्ड' },
  'leaderboard.subtitle': { en: 'Compete with players worldwide', hi: 'दुनिया भर के खिलाड़ियों से प्रतिस्पर्धा करें' },
  'leaderboard.your_rank': { en: 'Your current rank', hi: 'आपकी वर्तमान रैंक' },
  'leaderboard.top_performers': { en: 'Top Performers', hi: 'शीर्ष प्रदर्शनकर्ता' },
  'leaderboard.all_rankings': { en: 'All Rankings', hi: 'सभी रैंकिंग' },
  'leaderboard.you': { en: 'You', hi: 'आप' },
  'leaderboard.level': { en: 'Level', hi: 'स्तर' },
  'leaderboard.climb_title': { en: 'Climb the Ranks!', hi: 'रैंक बढ़ाएँ!' },
  'leaderboard.climb_desc': { en: 'Complete more activities to earn tokens and move up the leaderboard', hi: 'अधिक गतिविधियाँ पूरी करें, टोकन कमाएँ और रैंकिंग में ऊपर जाएँ' },
  'leaderboard.play_more': { en: 'Play More Games', hi: 'और गेम खेलें' },
}

const I18nContext = createContext<{ t: (key: string) => string } | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAuth()
  const lang: LanguageCode = state.user?.language || 'en'

  const t = useMemo(() => {
    return (key: string) => {
      const entry = translations[key]
      if (!entry) return key
      return entry[lang]
    }
  }, [lang])

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}


