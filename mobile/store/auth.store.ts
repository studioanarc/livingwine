import { create } from 'zustand';
import { authService, LoginCredentials, RegisterData } from '../services/auth.service';
import { getAuthToken, getUserData, clearAuthData } from '../utils/storage';
import type { User } from '../types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

/**
 * Auth Store - Manages authentication state
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { user } = await authService.login(credentials);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Register action
  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const { user } = await authService.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Logout action
  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear state even if API call fails
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  // Load user from storage
  loadUser: async () => {
    try {
      set({ isLoading: true });
      const [token, userData] = await Promise.all([
        getAuthToken(),
        getUserData<User>(),
      ]);

      if (token && userData) {
        // Verify token is still valid by fetching current user
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          // Token is invalid, clear auth data
          await clearAuthData();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Set user directly
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

export default useAuthStore;
