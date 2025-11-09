/**
 * Custom Hook for Map Functionality
 * Simplifies map interactions and data fetching
 */

import { useEffect, useCallback } from 'react';
import { useMapStore } from '../store/mapStore';
import { mapService } from '../services/mapService';
import { Marker, ClusterMarker, Region } from '../types/map';

export const useMap = () => {
  const store = useMapStore();

  // Fetch markers based on current state
  const fetchMarkers = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);

      const data = await mapService.fetchClusteredMarkers(
        store.region,
        store.filters,
        store.searchQuery || undefined
      );

      store.setMarkers(data.markers);
      store.setClusters(data.clusters);
    } catch (err) {
      console.error('Error fetching markers:', err);
      store.setError(err instanceof Error ? err.message : 'Failed to load map data');
    } finally {
      store.setLoading(false);
    }
  }, [store.region, store.filters, store.searchQuery]);

  // Refresh markers
  const refresh = useCallback(() => {
    mapService.clearCache();
    fetchMarkers();
  }, [fetchMarkers]);

  // Search for location
  const search = useCallback(async (query: string) => {
    store.setSearchQuery(query);
    if (query.length === 0) return;

    try {
      const results = await mapService.searchLocations(query);
      if (results.length > 0) {
        // Optionally zoom to first result
        const firstResult = results[0];
        store.setRegion({
          latitude: firstResult.coordinates.latitude,
          longitude: firstResult.coordinates.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    } catch (err) {
      console.error('Error searching:', err);
    }
  }, []);

  // Zoom to marker
  const zoomToMarker = useCallback((marker: Marker, delta: number = 0.05) => {
    store.setRegion({
      latitude: marker.coordinates.latitude,
      longitude: marker.coordinates.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
    store.setSelectedMarker(marker);
  }, []);

  // Zoom to cluster
  const zoomToCluster = useCallback((cluster: ClusterMarker) => {
    const currentDelta = store.region.latitudeDelta;
    store.setRegion({
      latitude: cluster.coordinates.latitude,
      longitude: cluster.coordinates.longitude,
      latitudeDelta: currentDelta / 2,
      longitudeDelta: currentDelta / 2,
    });
  }, [store.region]);

  // Get markers by type
  const getMarkersByType = useCallback((type: 'producer' | 'venue' | 'event') => {
    return store.markers.filter(marker => marker.type === type);
  }, [store.markers]);

  // Get visible markers count
  const getVisibleMarkersCount = useCallback(() => {
    let count = 0;
    if (store.filters.showProducers) {
      count += store.markers.filter(m => m.type === 'producer').length;
    }
    if (store.filters.showVenues) {
      count += store.markers.filter(m => m.type === 'venue').length;
    }
    if (store.filters.showEvents) {
      count += store.markers.filter(m => m.type === 'event').length;
    }
    return count;
  }, [store.markers, store.filters]);

  return {
    // State
    markers: store.markers,
    clusters: store.clusters,
    selectedMarker: store.selectedMarker,
    filters: store.filters,
    searchQuery: store.searchQuery,
    region: store.region,
    isLoading: store.isLoading,
    error: store.error,
    bottomSheetOpen: store.bottomSheetOpen,

    // Actions
    setSelectedMarker: store.setSelectedMarker,
    setFilters: store.setFilters,
    toggleFilter: store.toggleFilter,
    setSearchQuery: store.setSearchQuery,
    setRegion: store.setRegion,
    setBottomSheetOpen: store.setBottomSheetOpen,
    resetFilters: store.resetFilters,
    clearSearch: store.clearSearch,

    // Custom actions
    fetchMarkers,
    refresh,
    search,
    zoomToMarker,
    zoomToCluster,
    getMarkersByType,
    getVisibleMarkersCount,
  };
};

export default useMap;
