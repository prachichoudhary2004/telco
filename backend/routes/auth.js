import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, userRegistrationSchema, userLoginSchema } from '../middleware/validation.js';

const router = express.Router();

// Register new user
router.post('/register', validate(userRegistrationSchema), async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = uuidv4();

    // Create user
    const userData = {
      id: userId,
      name,
      email,
      password_hash,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      level: 1,
      xp: 0,
      tokens: 100, // Welcome bonus
      streak: 1,
      language: 'en',
      tts_enabled: false
    };

    await db.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Store session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    await db.createUserSession(userId, token, expiresAt);

    // Return user data (without password)
    const { password_hash: _, ...userWithoutPassword } = userData;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validate(userLoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.updateUser(user.id, { last_login: new Date().toISOString() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Store session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    await db.createUserSession(user.id, token, expiresAt);

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    await db.deleteUserSession(token);
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's badges
    const badges = await db.getUserBadges(user.id);
    
    // Get user's completed activities
    const completedActivityIds = await db.getUserCompletedActivityIds(user.id);
    
    // Get user's redeemed perks
    const perks = await db.getUserPerks(user.id);

    // Return complete user profile
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      user: {
        ...userWithoutPassword,
        badges: badges.map(badge => ({
          id: badge.badge_id,
          name: badge.badge_name,
          description: badge.badge_description,
          icon: badge.badge_icon,
          rarity: badge.badge_rarity,
          earned: true,
          earnedAt: badge.earned_at
        })),
        completedActivities: completedActivityIds,
        redeemedPerks: perks
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Generate new token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Delete old session
    const oldToken = req.headers['authorization'].split(' ')[1];
    await db.deleteUserSession(oldToken);

    // Store new session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.createUserSession(user.id, token, expiresAt);

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
