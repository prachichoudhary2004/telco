// Mock data for the dApp

export const mockBadges = [
  {
    id: 'welcome',
    name: 'Welcome Badge',
    description: 'Completed your first activity',
    icon: '👋',
    earned: false,
    rarity: 'common' as const
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7-day login streak',
    icon: '🔥',
    earned: false,
    rarity: 'rare' as const
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Completed 10 quizzes',
    icon: '🧠',
    earned: false,
    rarity: 'epic' as const
  },
  {
    id: 'token-collector',
    name: 'Token Collector',
    description: 'Earned 1000 tokens',
    icon: '💰',
    earned: false,
    rarity: 'legendary' as const
  }
]

export const mockTelcoPerks = [
  {
    id: 'data-1gb',
    name: '1GB Free Data',
    description: 'Extra 1GB data for your mobile plan',
    cost: 100,
    category: 'Data',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=300&h=200&fit=crop',
    availability: 'available' as const,
    validUntil: '2024-12-31'
  },
  {
    id: 'minutes-100',
    name: '100 Free Minutes',
    description: 'Free calling minutes for local calls',
    cost: 150,
    category: 'Voice',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
    availability: 'available' as const,
    validUntil: '2024-12-31'
  },
  {
    id: 'sms-500',
    name: '500 Free SMS',
    description: 'Free text messages',
    cost: 75,
    category: 'SMS',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&h=200&fit=crop',
    availability: 'limited' as const,
    validUntil: '2024-11-30'
  },
  {
    id: 'premium-subscription',
    name: 'Premium Subscription',
    description: '30-day premium features access',
    cost: 500,
    category: 'Premium',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
    availability: 'available' as const,
    validUntil: '2024-12-31'
  }
]

export const mockLeaderboard = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    tokens: 2450,
    level: 15,
    badges: 8,
    streak: 21
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    tokens: 2280,
    level: 14,
    badges: 7,
    streak: 18
  },
  {
    id: 'user-3',
    name: 'Mike Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    tokens: 2150,
    level: 13,
    badges: 6,
    streak: 15
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    tokens: 1980,
    level: 12,
    badges: 5,
    streak: 12
  },
  {
    id: 'user-5',
    name: 'James Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    tokens: 1850,
    level: 11,
    badges: 4,
    streak: 9
  }
]

export const mockAIResponses = {
  captions: [
    "Just earned some tokens! 🎉 The future of loyalty is here! #TelcoRewards #Web3 #Blockchain",
    "Level up! 📱💫 Gaming my way to better mobile perks. Who else is on this journey? #GamifiedLoyalty",
    "Another day, another reward! 🏆 Love how easy it is to earn with @TelcoRewards #EarnWhileYouLearn",
    "Crushing these challenges! 💪 My streak is on fire! 🔥 #DailyStreak #TelcoTokens"
  ],
  hashtags: [
    "#TelcoRewards #Web3Loyalty #BlockchainRewards #GamifiedExperience",
    "#EarnTokens #MobileLoyalty #DigitalRewards #FutureOfTelecom",
    "#TelcoGaming #RewardProgram #TokenEconomy #Web3dApp",
    "#LoyaltyProgram #CryptoRewards #MobileFirst #TelecomInnovation"
  ],
  templates: [
    "🎉 Achievement Unlocked! Just earned [TOKENS] tokens by completing [ACTIVITY]! Join me on this Web3 loyalty journey! #TelcoRewards",
    "📱 Level [LEVEL] reached! My daily streak is now [STREAK] days strong! Who's challenging me? #GamifiedLoyalty",
    "🏆 New badge earned: [BADGE_NAME]! The grind never stops in the world of telco rewards! #BadgeCollector",
    "💫 Just redeemed [PERK_NAME] with my earned tokens! This is the future of customer loyalty! #Web3Rewards"
  ]
}

export const additionalGames = [
  {
    id: 'word-puzzle',
    title: 'Telecom Word Puzzle',
    description: 'Find hidden telecom terms',
    type: 'puzzle',
    category: 'Word Games',
    tokens: 45,
    xp: 25,
    duration: 8,
    difficulty: 'easy' as const,
    icon: '🔤'
  },
  {
    id: 'speed-typing',
    title: 'Speed Typing Challenge',
    description: 'Type telecom terms as fast as you can',
    type: 'arcade',
    category: 'Skills',
    tokens: 65,
    xp: 35,
    duration: 5,
    difficulty: 'medium' as const,
    icon: '⌨️'
  },
  {
    id: 'color-match',
    title: 'Signal Color Match',
    description: 'Match signal strength colors',
    type: 'memory',
    category: 'Memory',
    tokens: 50,
    xp: 30,
    duration: 6,
    difficulty: 'medium' as const,
    icon: '🌈'
  }
]