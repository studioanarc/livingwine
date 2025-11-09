import apiClient, { API } from './api';
import { setAuthToken, setRefreshToken, setUserData, clearAuthData } from '../utils/storage';
import type { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API.auth.login, credentials);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      await Promise.all([
        setAuthToken(accessToken),
        setRefreshToken(refreshToken),
        setUserData(user),
      ]);

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API.auth.register, data);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      await Promise.all([
        setAuthToken(accessToken),
        setRefreshToken(refreshToken),
        setUserData(user),
      ]);

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local auth data regardless of API response
      await clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>(API.auth.me);
      const user = response.data.user;

      // Update stored user data
      await setUserData(user);

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await apiClient.post<{ accessToken: string }>(API.auth.refresh, {
        refreshToken,
      });
      const { accessToken } = response.data;

      // Store new access token
      await setAuthToken(accessToken);

      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * OAuth login (Google, Apple, etc.)
   */
  async oauthLogin(provider: 'google' | 'apple', token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(`/auth/oauth/${provider}`, {
        token,
      });
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens and user data
      await Promise.all([
        setAuthToken(accessToken),
        setRefreshToken(refreshToken),
        setUserData(user),
      ]);

      return response.data;
    } catch (error) {
      console.error('OAuth login error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
