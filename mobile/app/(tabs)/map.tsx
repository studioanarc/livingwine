/**
 * Map Screen
 * Interactive map with clustering, search, filters, and bottom sheet
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region as MapRegion } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Svg, { Path } from 'react-native-svg';

// Components
import { MapCluster } from '../../components/map/MapCluster';
import { VenueMarker } from '../../components/map/VenueMarker';
import { ProducerMarker } from '../../components/map/ProducerMarker';
import { EventMarker } from '../../components/map/EventMarker';
import { MarkerDetails } from '../../components/map/MarkerDetails';

// Store and services
import { useMapStore } from '../../store/mapStore';
import { mapService } from '../../services/mapService';

// Types
import {
  Marker,
  ClusterMarker as ClusterMarkerType,
  ProducerMarker as ProducerMarkerType,
  VenueMarker as VenueMarkerType,
  EventMarker as EventMarkerType,
} from '../../types/map';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Zustand store
  const {
    markers,
    clusters,
    selectedMarker,
    filters,
    searchQuery,
    region,
    isLoading,
    error,
    setMarkers,
    setClusters,
    setSelectedMarker,
    toggleFilter,
    setSearchQuery,
    setRegion,
    setLoading,
    setError,
  } = useMapStore();

  const [searchFocused, setSearchFocused] = useState(false);

  // Fetch markers when region or filters change
  useEffect(() => {
    fetchMarkers();
  }, [region, filters]);

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchQuery.length === 0) return;

    const timeoutId = setTimeout(() => {
      fetchMarkers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch markers from API
  const fetchMarkers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await mapService.fetchClusteredMarkers(
        region,
        filters,
        searchQuery || undefined
      );

      setMarkers(data.markers);
      setClusters(data.clusters);
    } catch (err) {
      console.error('Error fetching markers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  // Handle region change (when user moves/zooms map)
  const handleRegionChangeComplete = useCallback((newRegion: MapRegion) => {
    setRegion(newRegion);
  }, []);

  // Handle cluster press - zoom in
  const handleClusterPress = useCallback((cluster: ClusterMarkerType) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: cluster.coordinates.latitude,
        longitude: cluster.coordinates.longitude,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      });
    }
  }, [region]);

  // Handle marker press - open bottom sheet
  const handleMarkerPress = useCallback((marker: Marker) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();

    // Animate map to center marker
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: marker.coordinates.latitude,
        longitude: marker.coordinates.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
  }, [region]);

  // Handle navigation button
  const handleNavigate = useCallback(() => {
    if (!selectedMarker) return;
    // TODO: Open navigation app
    console.log('Navigate to:', selectedMarker.coordinates);
  }, [selectedMarker]);

  // Handle view details button
  const handleViewDetails = useCallback(() => {
    if (!selectedMarker) return;
    // TODO: Navigate to detail screen
    console.log('View details for:', selectedMarker.id);
  }, [selectedMarker]);

  // Render individual marker based on type
  const renderMarker = (marker: Marker) => {
    const isSelected = selectedMarker?.id === marker.id;

    switch (marker.type) {
      case 'producer':
        return (
          <ProducerMarker
            key={marker.id}
            producer={marker as ProducerMarkerType}
            onPress={handleMarkerPress}
            isSelected={isSelected}
          />
        );
      case 'venue':
        return (
          <VenueMarker
            key={marker.id}
            venue={marker as VenueMarkerType}
            onPress={handleMarkerPress}
            isSelected={isSelected}
          />
        );
      case 'event':
        return (
          <EventMarker
            key={marker.id}
            event={marker as EventMarkerType}
            onPress={handleMarkerPress}
            isSelected={isSelected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Render clusters */}
        {clusters.map((cluster) => (
          <MapCluster
            key={cluster.id}
            cluster={cluster}
            onPress={handleClusterPress}
          />
        ))}

        {/* Render individual markers */}
        {markers.map(renderMarker)}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.searchIcon}>
            <Path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="#5C4A3A"
            />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor="#8C7A6A"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  fill="#8C7A6A"
                />
              </Svg>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showProducers && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showProducers')}
        >
          <Text
            style={[
              styles.filterText,
              filters.showProducers && styles.filterTextActive,
            ]}
          >
            Producers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showVenues && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showVenues')}
        >
          <Text
            style={[
              styles.filterText,
              filters.showVenues && styles.filterTextActive,
            ]}
          >
            Venues
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showEvents && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showEvents')}
        >
          <Text
            style={[
              styles.filterText,
              filters.showEvents && styles.filterTextActive,
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          // TODO: Get user location and animate to it
          console.log('Get my location');
        }}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
            fill="#2C2416"
          />
        </Svg>
      </TouchableOpacity>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0055AA" />
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchMarkers} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '90%']}
        enablePanDownToClose
        onClose={() => setSelectedMarker(null)}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedMarker && (
            <MarkerDetails
              marker={selectedMarker}
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchBarFocused: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C2416',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0D5CB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#0055AA',
    borderColor: '#0055AA',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2416',
    textAlign: 'center',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 180 : 160,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 180 : 160,
    left: 16,
    right: 16,
    backgroundColor: '#C1272D',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  errorText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#C1272D',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: '#FCF8F2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetIndicator: {
    backgroundColor: '#8C7A6A',
    width: 40,
  },
  bottomSheetContent: {
    flex: 1,
  },
});
