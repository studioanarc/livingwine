import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn, CheckInFormData, Wine, VenueSuggestion, ApiResponse } from '../types';
import ocrService from './ocrService';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * Check-In Service for creating and managing wine check-ins
 */
class CheckInService {
  /**
   * Get auth token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Create a new check-in
   * @param formData - Check-in form data
   * @returns Created check-in object
   */
  async createCheckIn(formData: CheckInFormData): Promise<ApiResponse<CheckIn>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return {
          error: 'Authentication required',
        };
      }

      // Upload photos first if any
      let photoUrls: string[] = [];
      if (formData.photoUrls && formData.photoUrls.length > 0) {
        photoUrls = await ocrService.uploadPhotos(formData.photoUrls);
      }

      // Prepare check-in data
      const checkInData = {
        wineId: formData.wineId,
        rating: formData.rating,
        tastingNotes: formData.tastingNotes,
        contextTags: formData.contextTags || [],
        foodPairings: formData.foodPairings,
        venueId: formData.venueId,
        photoUrls,
        isPublic: formData.isPublic !== false, // Default to true
      };

      const response = await fetch(`${API_BASE_URL}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(checkInData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to create check-in',
        };
      }

      const result = await response.json();

      return {
        data: result.checkin,
        message: result.message,
      };
    } catch (error) {
      console.error('Create check-in error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create check-in',
      };
    }
  }

  /**
   * Update an existing check-in
   * @param checkInId - Check-in ID
   * @param updates - Fields to update
   * @returns Updated check-in object
   */
  async updateCheckIn(
    checkInId: string,
    updates: Partial<CheckInFormData>
  ): Promise<ApiResponse<CheckIn>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return {
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to update check-in',
        };
      }

      const result = await response.json();

      return {
        data: result.checkin,
        message: result.message,
      };
    } catch (error) {
      console.error('Update check-in error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to update check-in',
      };
    }
  }

  /**
   * Get check-in by ID
   * @param checkInId - Check-in ID
   * @returns Check-in object
   */
  async getCheckIn(checkInId: string): Promise<ApiResponse<CheckIn>> {
    try {
      const token = await this.getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to fetch check-in',
        };
      }

      const result = await response.json();

      return {
        data: result.checkin,
      };
    } catch (error) {
      console.error('Get check-in error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch check-in',
      };
    }
  }

  /**
   * Search for wines
   * @param query - Search query
   * @returns Array of wines
   */
  async searchWines(query: string): Promise<ApiResponse<Wine[]>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wines?search=${encodeURIComponent(query)}&limit=20`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to search wines',
        };
      }

      const result = await response.json();

      return {
        data: result.wines || [],
      };
    } catch (error) {
      console.error('Search wines error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to search wines',
        data: [],
      };
    }
  }

  /**
   * Get venue suggestions based on partial name
   * @param query - Partial venue name
   * @returns Array of venue suggestions
   */
  async getVenueSuggestions(query: string): Promise<ApiResponse<VenueSuggestion[]>> {
    try {
      if (!query || query.trim().length < 2) {
        return { data: [] };
      }

      const response = await fetch(
        `${API_BASE_URL}/venues/suggest?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to fetch venue suggestions',
          data: [],
        };
      }

      const result = await response.json();

      return {
        data: result.suggestions || [],
      };
    } catch (error) {
      console.error('Get venue suggestions error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch suggestions',
        data: [],
      };
    }
  }

  /**
   * Create a new wine entry
   * @param wineData - Wine information
   * @returns Created wine object
   */
  async createWine(wineData: Partial<Wine>): Promise<ApiResponse<Wine>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return {
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_BASE_URL}/wines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(wineData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to create wine',
        };
      }

      const result = await response.json();

      return {
        data: result.wine,
        message: result.message,
      };
    } catch (error) {
      console.error('Create wine error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create wine',
      };
    }
  }

  /**
   * Delete a check-in
   * @param checkInId - Check-in ID
   * @returns Success status
   */
  async deleteCheckIn(checkInId: string): Promise<ApiResponse<void>> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        return {
          error: 'Authentication required',
        };
      }

      const response = await fetch(`${API_BASE_URL}/checkins/${checkInId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || 'Failed to delete check-in',
        };
      }

      const result = await response.json();

      return {
        message: result.message,
      };
    } catch (error) {
      console.error('Delete check-in error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete check-in',
      };
    }
  }
}

export default new CheckInService();
