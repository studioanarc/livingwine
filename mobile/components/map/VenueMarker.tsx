/**
 * VenueMarker Component
 * Custom marker for wine venues with different colors by type
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { VenueMarker as VenueMarkerType, VenueType } from '../../types/map';
import Svg, { Path, Circle } from 'react-native-svg';

interface VenueMarkerProps {
  venue: VenueMarkerType;
  onPress: (venue: VenueMarkerType) => void;
  isSelected?: boolean;
}

export const VenueMarker: React.FC<VenueMarkerProps> = ({
  venue,
  onPress,
  isSelected = false,
}) => {
  // Get color based on venue type
  const getVenueColor = (type: VenueType): string => {
    switch (type) {
      case 'wine_bar':
        return '#C1272D'; // Red
      case 'restaurant':
        return '#F4D03F'; // Yellow
      case 'wine_shop':
        return '#0055AA'; // Blue
      case 'tasting_room':
        return '#8B4513'; // Brown
      default:
        return '#6B8E23'; // Olive green
    }
  };

  // Get icon based on venue type
  const getVenueIcon = (type: VenueType): JSX.Element => {
    const color = getVenueColor(type);
    const size = isSelected ? 40 : 32;

    switch (type) {
      case 'wine_bar':
        // Wine glass icon
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M6 3v6c0 2.97 2.16 5.43 5 5.91V19H8v2h8v-2h-3v-4.09c2.84-.48 5-2.94 5-5.91V3H6zm10 5H8V5h8v3z"
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </Svg>
        );

      case 'restaurant':
        // Fork and knife icon
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </Svg>
        );

      case 'wine_shop':
        // Shop/store icon
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </Svg>
        );

      case 'tasting_room':
        // Wine bottle icon
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
              d="M9 2v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1V2H9zm6 5h-1.5v2h-3V7H9c-.55 0-1 .45-1 1v12c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V8c0-.55-.45-1-1-1z"
              fill={color}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </Svg>
        );

      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="8" fill={color} stroke="#FFFFFF" strokeWidth="2" />
          </Svg>
        );
    }
  };

  return (
    <Marker
      coordinate={venue.coordinates}
      onPress={() => onPress(venue)}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.markerContainer,
          isSelected && styles.markerSelected,
        ]}
      >
        {getVenueIcon(venue.venueType)}
        {venue.naturalWineFocus && (
          <View style={styles.badge}>
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Path
                d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
                fill="#6B8E23"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </Svg>
          </View>
        )}
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  markerSelected: {
    transform: [{ scale: 1.2 }],
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6B8E23',
  },
});

export default VenueMarker;
