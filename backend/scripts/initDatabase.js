import Database from '../database/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../config.env' });

async function initializeDatabase() {
  const db = new Database();
  
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to database
    await db.connect();
    
    // Create some sample data
    console.log('📝 Creating sample data...');
    
    // Create sample users
    const sampleUsers = [
      {
        id: 'user-1',
        name: 'Alex Chen',
        email: 'alex@example.com',
        password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', // password: "password123"
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        level: 15,
        xp: 1450,
        tokens: 2450,
        streak: 21,
        language: 'en',
        tts_enabled: true
      },
      {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', // password: "password123"
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        level: 14,
        xp: 1380,
        tokens: 2280,
        streak: 18,
        language: 'en',
        tts_enabled: false
      },
      {
        id: 'user-3',
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', // password: "password123"
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        level: 13,
        xp: 1250,
        tokens: 2150,
        streak: 15,
        language: 'en',
        tts_enabled: true
      }
    ];

    // Insert sample users
    for (const user of sampleUsers) {
      try {
        await db.createUser(user);
        console.log(`✅ Created user: ${user.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  User ${user.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    // Add some sample badges
    const sampleBadges = [
      {
        user_id: 'user-1',
        badge_id: 'welcome',
        badge_name: 'Welcome Badge',
        badge_description: 'Completed your first activity',
        badge_icon: '👋',
        badge_rarity: 'common'
      },
      {
        user_id: 'user-1',
        badge_id: 'streak-7',
        badge_name: 'Week Warrior',
        badge_description: '7-day login streak',
        badge_icon: '🔥',
        badge_rarity: 'rare'
      },
      {
        user_id: 'user-1',
        badge_id: 'quiz-master',
        badge_name: 'Quiz Master',
        badge_description: 'Completed 10 quizzes',
        badge_icon: '🧠',
        badge_rarity: 'epic'
      },
      {
        user_id: 'user-2',
        badge_id: 'welcome',
        badge_name: 'Welcome Badge',
        badge_description: 'Completed your first activity',
        badge_icon: '👋',
        badge_rarity: 'common'
      },
      {
        user_id: 'user-2',
        badge_id: 'streak-7',
        badge_name: 'Week Warrior',
        badge_description: '7-day login streak',
        badge_icon: '🔥',
        badge_rarity: 'rare'
      }
    ];

    for (const badge of sampleBadges) {
      try {
        await db.addUserBadge(badge.user_id, badge);
        console.log(`✅ Added badge ${badge.badge_name} to user ${badge.user_id}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Badge ${badge.badge_name} already exists for user ${badge.user_id}, skipping...`);
        } else {
          throw error;
        }
      }
    }

    // Add some sample activities
    const sampleActivities = [
      {
        user_id: 'user-1',
        activity_id: 'quiz-1',
        tokens_earned: 50,
        xp_earned: 25
      },
      {
        user_id: 'user-1',
        activity_id: 'game-1',
        tokens_earned: 75,
        xp_earned: 40
      },
      {
        user_id: 'user-2',
        activity_id: 'quiz-1',
        tokens_earned: 50,
        xp_earned: 25
      }
    ];

    for (const activity of sampleActivities) {
      try {
        await db.addUserActivity(activity.user_id, activity);
        console.log(`✅ Added activity ${activity.activity_id} for user ${activity.user_id}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Activity ${activity.activity_id} already completed by user ${activity.user_id}, skipping...`);
        } else {
          throw error;
        }
      }
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📊 Sample data created:');
    console.log('- 3 sample users');
    console.log('- 5 sample badges');
    console.log('- 3 sample activities');
    console.log('\n🔑 Test credentials:');
    console.log('Email: alex@example.com, Password: password123');
    console.log('Email: sarah@example.com, Password: password123');
    console.log('Email: mike@example.com, Password: password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run initialization
initializeDatabase();
