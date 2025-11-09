/**
 * Map Example Component
 * Demonstrates how to use the map components and hook
 */

import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMap } from '../../hooks/useMap';
import { MapCluster, VenueMarker, ProducerMarker, EventMarker, MarkerDetails } from './index';

/**
 * Example: Simple Map Implementation
 */
export const SimpleMapExample: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    markers,
    clusters,
    selectedMarker,
    region,
    isLoading,
    setSelectedMarker,
    zoomToMarker,
    zoomToCluster,
  } = useMap();

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    bottomSheetRef.current?.expand();
    zoomToMarker(marker);
  };

  const handleClusterPress = (cluster: any) => {
    zoomToCluster(cluster);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
      >
        {clusters.map((cluster) => (
          <MapCluster
            key={cluster.id}
            cluster={cluster}
            onPress={handleClusterPress}
          />
        ))}

        {markers.map((marker) => {
          switch (marker.type) {
            case 'producer':
              return (
                <ProducerMarker
                  key={marker.id}
                  producer={marker}
                  onPress={handleMarkerPress}
                />
              );
            case 'venue':
              return (
                <VenueMarker
                  key={marker.id}
                  venue={marker}
                  onPress={handleMarkerPress}
                />
              );
            case 'event':
              return (
                <EventMarker
                  key={marker.id}
                  event={marker}
                  onPress={handleMarkerPress}
                />
              );
            default:
              return null;
          }
        })}
      </MapView>

      {isLoading && (
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '90%']}
        enablePanDownToClose
        onClose={() => setSelectedMarker(null)}
      >
        {selectedMarker && (
          <MarkerDetails
            marker={selectedMarker}
            onNavigate={() => Alert.alert('Navigate', 'Opening maps...')}
            onViewDetails={() => Alert.alert('Details', 'Showing details...')}
          />
        )}
      </BottomSheet>
    </View>
  );
};

/**
 * Example: Map with Custom Controls
 */
export const MapWithControlsExample: React.FC = () => {
  const {
    filters,
    toggleFilter,
    getVisibleMarkersCount,
    refresh,
    resetFilters,
  } = useMap();

  return (
    <View style={styles.controlsContainer}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showProducers && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showProducers')}
        >
          <Text style={styles.filterText}>Producers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showVenues && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showVenues')}
        >
          <Text style={styles.filterText}>Venues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.showEvents && styles.filterButtonActive,
          ]}
          onPress={() => toggleFilter('showEvents')}
        >
          <Text style={styles.filterText}>Events</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <Text style={styles.countText}>
          {getVisibleMarkersCount()} visible locations
        </Text>

        <TouchableOpacity onPress={refresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Example: Programmatic Map Control
 */
export const ProgrammaticMapExample: React.FC = () => {
  const {
    markers,
    getMarkersByType,
    zoomToMarker,
    search,
    setRegion,
  } = useMap();

  const zoomToFirstProducer = () => {
    const producers = getMarkersByType('producer');
    if (producers.length > 0) {
      zoomToMarker(producers[0]);
    } else {
      Alert.alert('No Producers', 'No producers found on the map');
    }
  };

  const searchParis = () => {
    search('Paris');
  };

  const goToFrance = () => {
    setRegion({
      latitude: 46.2276,
      longitude: 2.2137,
      latitudeDelta: 10,
      longitudeDelta: 10,
    });
  };

  return (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={zoomToFirstProducer} style={styles.actionButton}>
        <Text>Zoom to First Producer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={searchParis} style={styles.actionButton}>
        <Text>Search Paris</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToFrance} style={styles.actionButton}>
        <Text>Go to France</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        Total markers: {markers.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3E4DB',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#0055AA',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2416',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    color: '#5C4A3A',
  },
  refreshButton: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0055AA',
    borderRadius: 6,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3E4DB',
    borderRadius: 6,
  },
  resetText: {
    color: '#2C2416',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    padding: 12,
    backgroundColor: '#0055AA',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#5C4A3A',
    textAlign: 'center',
    marginTop: 12,
  },
});
