import express from 'express';
import db from '../database/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get leaderboard
router.get('/', optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    // Get leaderboard data
    const leaderboard = await db.getLeaderboard(limit + offset);
    
    // Apply pagination
    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);
    
    // Add user's position if authenticated
    let userPosition = null;
    if (req.user) {
      const allUsers = await db.getLeaderboard(1000); // Get a large number to find user position
      const userIndex = allUsers.findIndex(user => user.id === req.user.id);
      if (userIndex !== -1) {
        userPosition = {
          position: userIndex + 1,
          user: allUsers[userIndex]
        };
      }
    }
    
    res.json({
      leaderboard: paginatedLeaderboard,
      userPosition,
      pagination: {
        limit,
        offset,
        total: leaderboard.length,
        hasMore: offset + limit < leaderboard.length
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get user's position in leaderboard
router.get('/position', async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const allUsers = await db.getLeaderboard(1000);
    const userIndex = allUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found in leaderboard' });
    }
    
    const user = allUsers[userIndex];
    const position = userIndex + 1;
    
    // Get surrounding users for context
    const start = Math.max(0, userIndex - 2);
    const end = Math.min(allUsers.length, userIndex + 3);
    const surroundingUsers = allUsers.slice(start, end);
    
    res.json({
      position,
      user,
      surroundingUsers: surroundingUsers.map((u, index) => ({
        ...u,
        position: start + index + 1
      }))
    });
  } catch (error) {
    console.error('Get user position error:', error);
    res.status(500).json({ error: 'Failed to get user position' });
  }
});

export default router;
