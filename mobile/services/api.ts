import axios from 'axios';
import { getAuthToken } from '../utils/storage';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      // Clear auth state and redirect to login
      // This will be implemented when we have the auth store
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Wine endpoints
  wines: {
    list: '/wines',
    search: '/wines/search',
    details: (id: string) => `/wines/${id}`,
    create: '/wines',
  },

  // Check-in endpoints
  checkins: {
    list: '/checkins',
    create: '/checkins',
    details: (id: string) => `/checkins/${id}`,
    delete: (id: string) => `/checkins/${id}`,
  },

  // Venue endpoints
  venues: {
    list: '/venues',
    nearby: '/venues/nearby',
    details: (id: string) => `/venues/${id}`,
  },

  // Producer endpoints
  producers: {
    list: '/producers',
    details: (id: string) => `/producers/${id}`,
  },

  // User endpoints
  users: {
    profile: (id: string) => `/users/${id}`,
    update: '/users/me',
    friends: '/users/friends',
  },
};

export default apiClient;
