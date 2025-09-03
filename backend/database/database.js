import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'telco.db');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });

      // Enable foreign keys
      this.db.run('PRAGMA foreign_keys = ON');
    });
  }

  async initializeTables() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      this.db.exec(schema, (err) => {
        if (err) {
          console.error('Error initializing database schema:', err);
          reject(err);
        } else {
          console.log('Database schema initialized successfully');
          resolve();
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // User-specific methods
  async createUser(userData) {
    const {
      id,
      name,
      email,
      password_hash,
      avatar,
      level = 1,
      xp = 0,
      tokens = 100,
      streak = 1,
      language = 'en',
      tts_enabled = false
    } = userData;

    const sql = `
      INSERT INTO users (id, name, email, password_hash, avatar, level, xp, tokens, streak, language, tts_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return this.run(sql, [id, name, email, password_hash, avatar, level, xp, tokens, streak, language, tts_enabled]);
  }

  async getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return this.get(sql, [id]);
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return this.get(sql, [email]);
  }

  async updateUser(id, updates) {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const sql = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    return this.run(sql, [...values, id]);
  }

  async deleteUser(id) {
    const sql = 'DELETE FROM users WHERE id = ?';
    return this.run(sql, [id]);
  }

  // Badge methods
  async addUserBadge(userId, badgeData) {
    const { badge_id, badge_name, badge_description, badge_icon, badge_rarity } = badgeData;
    const sql = `
      INSERT INTO user_badges (user_id, badge_id, badge_name, badge_description, badge_icon, badge_rarity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return this.run(sql, [userId, badge_id, badge_name, badge_description, badge_icon, badge_rarity]);
  }

  async getUserBadges(userId) {
    const sql = 'SELECT * FROM user_badges WHERE user_id = ? ORDER BY earned_at DESC';
    return this.all(sql, [userId]);
  }

  // Activity methods
  async addUserActivity(userId, activityData) {
    const { activity_id, tokens_earned, xp_earned } = activityData;
    const sql = `
      INSERT INTO user_activities (user_id, activity_id, tokens_earned, xp_earned)
      VALUES (?, ?, ?, ?)
    `;
    return this.run(sql, [userId, activity_id, tokens_earned, xp_earned]);
  }

  async getUserActivities(userId) {
    const sql = 'SELECT * FROM user_activities WHERE user_id = ? ORDER BY completed_at DESC';
    return this.all(sql, [userId]);
  }

  async getUserCompletedActivityIds(userId) {
    const sql = 'SELECT activity_id FROM user_activities WHERE user_id = ?';
    const activities = await this.all(sql, [userId]);
    return activities.map(activity => activity.activity_id);
  }

  // Perk methods
  async addUserPerk(userId, perkData) {
    const { perk_id, perk_name, cost } = perkData;
    const sql = `
      INSERT INTO user_perks (user_id, perk_id, perk_name, cost)
      VALUES (?, ?, ?, ?)
    `;
    return this.run(sql, [userId, perk_id, perk_name, cost]);
  }

  async getUserPerks(userId) {
    const sql = 'SELECT * FROM user_perks WHERE user_id = ? ORDER BY redeemed_at DESC';
    return this.all(sql, [userId]);
  }

  // Session methods
  async createUserSession(userId, tokenHash, expiresAt) {
    const sql = `
      INSERT INTO user_sessions (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `;
    return this.run(sql, [userId, tokenHash, expiresAt]);
  }

  async getUserSession(tokenHash) {
    const sql = 'SELECT * FROM user_sessions WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP';
    return this.get(sql, [tokenHash]);
  }

  async deleteUserSession(tokenHash) {
    const sql = 'DELETE FROM user_sessions WHERE token_hash = ?';
    return this.run(sql, [tokenHash]);
  }

  async deleteExpiredSessions() {
    const sql = 'DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP';
    return this.run(sql);
  }

  // Leaderboard methods
  async getLeaderboard(limit = 10) {
    const sql = `
      SELECT 
        u.id,
        u.name,
        u.avatar,
        u.tokens,
        u.level,
        u.streak,
        COUNT(DISTINCT ub.id) as badges_count
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      GROUP BY u.id
      ORDER BY u.tokens DESC, u.level DESC
      LIMIT ?
    `;
    return this.all(sql, [limit]);
  }
}

export default Database;
