import express from 'express';
import db from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, userUpdateSchema, badgeSchema, activitySchema, perkSchema } from '../middleware/validation.js';

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, validate(userUpdateSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Check if email is being updated and if it's already taken
    if (updates.email && updates.email !== req.user.email) {
      const existingUser = await db.getUserByEmail(updates.email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    await db.updateUser(userId, updates);
    
    // Get updated user data
    const updatedUser = await db.getUserById(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add badge to user
router.post('/badges', authenticateToken, validate(badgeSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const badgeData = req.body;

    // Check if user already has this badge
    const existingBadges = await db.getUserBadges(userId);
    const hasBadge = existingBadges.some(badge => badge.badge_id === badgeData.badge_id);
    
    if (hasBadge) {
      return res.status(409).json({ error: 'User already has this badge' });
    }

    await db.addUserBadge(userId, badgeData);
    
    res.status(201).json({
      message: 'Badge added successfully',
      badge: {
        id: badgeData.badge_id,
        name: badgeData.badge_name,
        description: badgeData.badge_description,
        icon: badgeData.badge_icon,
        rarity: badgeData.badge_rarity,
        earned: true,
        earnedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({ error: 'Failed to add badge' });
  }
});

// Get user badges
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const badges = await db.getUserBadges(userId);
    
    const formattedBadges = badges.map(badge => ({
      id: badge.badge_id,
      name: badge.badge_name,
      description: badge.badge_description,
      icon: badge.badge_icon,
      rarity: badge.badge_rarity,
      earned: true,
      earnedAt: badge.earned_at
    }));
    
    res.json({ badges: formattedBadges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

// Complete activity
router.post('/activities', authenticateToken, validate(activitySchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { activity_id, tokens_earned, xp_earned } = req.body;

    // Check if user already completed this activity
    const completedActivityIds = await db.getUserCompletedActivityIds(userId);
    if (completedActivityIds.includes(activity_id)) {
      return res.status(409).json({ error: 'Activity already completed' });
    }

    // Add activity completion
    await db.addUserActivity(userId, { activity_id, tokens_earned, xp_earned });

    // Update user tokens and XP
    const currentUser = await db.getUserById(userId);
    const newTokens = currentUser.tokens + tokens_earned;
    const newXP = currentUser.xp + xp_earned;
    
    // Calculate new level (every 100 XP = 1 level)
    const newLevel = Math.floor(newXP / 100) + 1;
    
    await db.updateUser(userId, {
      tokens: newTokens,
      xp: newXP,
      level: newLevel
    });

    // Get updated user data
    const updatedUser = await db.getUserById(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    
    res.status(201).json({
      message: 'Activity completed successfully',
      user: userWithoutPassword,
      activity: {
        activity_id,
        tokens_earned,
        xp_earned
      }
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    res.status(500).json({ error: 'Failed to complete activity' });
  }
});

// Get user activities
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await db.getUserActivities(userId);
    
    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

// Redeem perk
router.post('/perks', authenticateToken, validate(perkSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { perk_id, perk_name, cost } = req.body;

    // Check if user has enough tokens
    const currentUser = await db.getUserById(userId);
    if (currentUser.tokens < cost) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Add perk redemption
    await db.addUserPerk(userId, { perk_id, perk_name, cost });

    // Update user tokens
    const newTokens = currentUser.tokens - cost;
    await db.updateUser(userId, { tokens: newTokens });

    // Get updated user data
    const updatedUser = await db.getUserById(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    
    res.status(201).json({
      message: 'Perk redeemed successfully',
      user: userWithoutPassword,
      perk: {
        perk_id,
        perk_name,
        cost,
        redeemedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Redeem perk error:', error);
    res.status(500).json({ error: 'Failed to redeem perk' });
  }
});

// Get user perks
router.get('/perks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const perks = await db.getUserPerks(userId);
    
    res.json({ perks });
  } catch (error) {
    console.error('Get perks error:', error);
    res.status(500).json({ error: 'Failed to get perks' });
  }
});

// Update user streak
router.put('/streak', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await db.getUserById(userId);
    
    const lastLogin = new Date(currentUser.last_login);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
    
    let newStreak = currentUser.streak;
    
    if (daysDiff === 1) {
      // Consecutive day
      newStreak = currentUser.streak + 1;
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }
    // If daysDiff === 0, it's the same day, keep current streak
    
    await db.updateUser(userId, {
      streak: newStreak,
      last_login: today.toISOString()
    });

    // Get updated user data
    const updatedUser = await db.getUserById(userId);
    const { password_hash, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'Streak updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete user (cascade will handle related records)
    await db.deleteUser(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
