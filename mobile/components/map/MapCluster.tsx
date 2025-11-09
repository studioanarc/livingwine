/**
 * MapCluster Component
 * Custom cluster marker showing count and expanding on tap
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import { ClusterMarker } from '../../types/map';

interface MapClusterProps {
  cluster: ClusterMarker;
  onPress: (cluster: ClusterMarker) => void;
}

export const MapCluster: React.FC<MapClusterProps> = ({ cluster, onPress }) => {
  const { coordinates, pointCount } = cluster;

  // Calculate cluster size based on point count
  const getClusterSize = (count: number): number => {
    if (count < 10) return 40;
    if (count < 50) return 50;
    if (count < 100) return 60;
    return 70;
  };

  // Get cluster color based on point count
  const getClusterColor = (count: number): string => {
    if (count < 10) return '#6B8E23'; // Olive green
    if (count < 50) return '#0055AA'; // Mondrian blue
    if (count < 100) return '#F4D03F'; // Yellow
    return '#C1272D'; // Red
  };

  const size = getClusterSize(pointCount);
  const backgroundColor = getClusterColor(pointCount);

  return (
    <Marker
      coordinate={coordinates}
      onPress={() => onPress(cluster)}
      tracksViewChanges={false}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(cluster)}
        style={[
          styles.clusterContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}
      >
        <View style={styles.clusterInner}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </TouchableOpacity>
    </Marker>
  );
};

const styles = StyleSheet.create({
  clusterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  clusterInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    // Text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default MapCluster;
