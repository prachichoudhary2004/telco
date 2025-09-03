// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('telco-token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('telco-token', token);
    } else {
      localStorage.removeItem('telco-token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // User profile endpoints
  async updateProfile(updates) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async addBadge(badgeData) {
    return this.request('/users/badges', {
      method: 'POST',
      body: JSON.stringify(badgeData),
    });
  }

  async getUserBadges() {
    return this.request('/users/badges');
  }

  async completeActivity(activityData) {
    return this.request('/users/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async getUserActivities() {
    return this.request('/users/activities');
  }

  async redeemPerk(perkData) {
    return this.request('/users/perks', {
      method: 'POST',
      body: JSON.stringify(perkData),
    });
  }

  async getUserPerks() {
    return this.request('/users/perks');
  }

  async updateStreak() {
    return this.request('/users/streak', {
      method: 'PUT',
    });
  }

  async deleteAccount() {
    return this.request('/users/account', {
      method: 'DELETE',
    });
  }

  // Leaderboard endpoints
  async getLeaderboard(limit = 10, offset = 0) {
    return this.request(`/leaderboard?limit=${limit}&offset=${offset}`);
  }

  async getUserPosition(userId) {
    return this.request(`/leaderboard/position?userId=${userId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
