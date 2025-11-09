/**
 * Map Service - API calls and data management
 */

import { Marker, Region, MapFilters, ClusterMarker } from '../types/map';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: any;
  timestamp: number;
}

class MapService {
  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Generate cache key from parameters
   */
  private getCacheKey(
    region: Region,
    filters: MapFilters,
    searchQuery?: string
  ): string {
    return JSON.stringify({
      lat: region.latitude.toFixed(2),
      lng: region.longitude.toFixed(2),
      delta: region.latitudeDelta.toFixed(2),
      filters,
      search: searchQuery,
    });
  }

  /**
   * Get cached data if still valid
   */
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Save data to cache
   */
  private saveToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Calculate zoom level from region delta
   */
  private getZoomLevel(latitudeDelta: number): number {
    // Approximate zoom level calculation
    // zoom = log2(360 / latitudeDelta)
    return Math.round(Math.log2(360 / latitudeDelta));
  }

  /**
   * Fetch markers with clustering based on zoom level
   */
  async fetchClusteredMarkers(
    region: Region,
    filters: MapFilters,
    searchQuery?: string
  ): Promise<{ markers: Marker[]; clusters: ClusterMarker[] }> {
    try {
      const cacheKey = this.getCacheKey(region, filters, searchQuery);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      const zoomLevel = this.getZoomLevel(region.latitudeDelta);

      const params = new URLSearchParams({
        latitude: region.latitude.toString(),
        longitude: region.longitude.toString(),
        latitudeDelta: region.latitudeDelta.toString(),
        longitudeDelta: region.longitudeDelta.toString(),
        zoom: zoomLevel.toString(),
        showProducers: filters.showProducers.toString(),
        showVenues: filters.showVenues.toString(),
        showEvents: filters.showEvents.toString(),
      });

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (filters.venueTypes?.length) {
        params.append('venueTypes', filters.venueTypes.join(','));
      }

      if (filters.certifications?.length) {
        params.append('certifications', filters.certifications.join(','));
      }

      if (filters.region) {
        params.append('region', filters.region);
      }

      const response = await fetch(`${API_BASE_URL}/map/clusters?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Process the data
      const result = {
        markers: data.markers || [],
        clusters: data.clusters || [],
      };

      this.saveToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching clustered markers:', error);
      throw error;
    }
  }

  /**
   * Fetch individual markers (no clustering) for small areas
   */
  async fetchMarkers(
    region: Region,
    filters: MapFilters,
    searchQuery?: string
  ): Promise<Marker[]> {
    try {
      const { markers } = await this.fetchClusteredMarkers(region, filters, searchQuery);
      return markers;
    } catch (error) {
      console.error('Error fetching markers:', error);
      throw error;
    }
  }

  /**
   * Fetch details for a specific marker
   */
  async fetchMarkerDetails(markerId: string, markerType: string): Promise<Marker> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/map/markers/${markerType}/${markerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching marker details:', error);
      throw error;
    }
  }

  /**
   * Search locations by name
   */
  async searchLocations(query: string): Promise<Marker[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/map/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(address: string): Promise<Region | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/map/geocode?address=${encodeURIComponent(address)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.region || null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
}

export const mapService = new MapService();
export default mapService;
