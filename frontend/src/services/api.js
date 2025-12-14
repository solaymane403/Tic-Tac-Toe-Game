import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL || 'https://vsrwljl6-8081.uks1.devtunnels.ms';


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('gamehub_user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

const api = {
  // Authentication
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Mock login for development / testing without backend
  // Usage: call `api.mockLogin(username)` from the UI when you want a local-only login flow.
  mockLogin: async (username) => {
    return new Promise((resolve, reject) => {
      // simulate network latency
      setTimeout(() => {
        if (!username || username.trim().length === 0) {
          reject(new Error('Username is required for mock login'));
          return;
        }

        const user = {
          userId: `mock_${username.toLowerCase()}_${Date.now()}`,
          username,
          token: 'mock-token',
        };
        resolve(user);
      }, 600);
    });
  },

  register: async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Game
  submitScore: async (userId, score) => {
    try {
      const response = await axiosInstance.post('/game/submit', {
        userId,
        score,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Score submission failed');
    }
  },

  // Leaderboard
  getLeaderboard: async () => {
    try {
      const response = await axiosInstance.get('/game/leaderboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  },

  // Profile
  getUserProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  updatePassword: async (userId, oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.put(`/user/${userId}/password`, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password update failed');
    }
  },
};

export default api;