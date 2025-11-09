/**
 * ProducerMarker Component
 * Custom marker for wine producers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { ProducerMarker as ProducerMarkerType } from '../../types/map';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface ProducerMarkerProps {
  producer: ProducerMarkerType;
  onPress: (producer: ProducerMarkerType) => void;
  isSelected?: boolean;
}

export const ProducerMarker: React.FC<ProducerMarkerProps> = ({
  producer,
  onPress,
  isSelected = false,
}) => {
  const size = isSelected ? 40 : 32;
  const color = '#6B8E23'; // Olive green for producers

  // Get certification badge color
  const getCertificationBadgeColor = (): string | null => {
    if (!producer.certifications || producer.certifications.length === 0) {
      return null;
    }

    // Priority order for certifications
    if (producer.certifications.includes('Biodynamic') ||
        producer.certifications.includes('Demeter')) {
      return '#9B59B6'; // Purple for biodynamic
    }
    if (producer.certifications.includes('Organic') ||
        producer.certifications.includes('EU Organic')) {
      return '#27AE60'; // Green for organic
    }
    return '#3498DB'; // Blue for other certifications
  };

  const certificationColor = getCertificationBadgeColor();

  // Grape vine/vineyard icon
  const ProducerIcon = () => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G>
        {/* Vine leaves */}
        <Path
          d="M12 2C9.79 2 8 3.79 8 6c0 1.11.45 2.11 1.18 2.83L8 10l-1.18-1.17C7.45 8.11 8 7.11 8 6c0-2.21-1.79-4-4-4v2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.73v12.27c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7.73c-.6-.35-1-.99-1-1.73 0-1.1.9-2 2-2V2c-2.21 0-4 1.79-4 4 0 1.11.55 2.11 1.18 2.83L16 10l-1.18-1.17C15.55 8.11 16 7.11 16 6c0-2.21-1.79-4-4-4z"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        {/* Grapes */}
        <Circle cx="10" cy="14" r="1.5" fill="#8B4513" stroke="#FFFFFF" strokeWidth="0.5" />
        <Circle cx="14" cy="14" r="1.5" fill="#8B4513" stroke="#FFFFFF" strokeWidth="0.5" />
        <Circle cx="12" cy="16" r="1.5" fill="#8B4513" stroke="#FFFFFF" strokeWidth="0.5" />
        <Circle cx="10" cy="18" r="1.5" fill="#8B4513" stroke="#FFFFFF" strokeWidth="0.5" />
        <Circle cx="14" cy="18" r="1.5" fill="#8B4513" stroke="#FFFFFF" strokeWidth="0.5" />
      </G>
    </Svg>
  );

  return (
    <Marker
      coordinate={producer.coordinates}
      onPress={() => onPress(producer)}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.markerContainer,
          isSelected && styles.markerSelected,
        ]}
      >
        <ProducerIcon />

        {/* Verification badge */}
        {producer.isVerified && (
          <View style={[styles.badge, styles.verifiedBadge]}>
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="#0055AA"
              />
            </Svg>
          </View>
        )}

        {/* Certification badge */}
        {certificationColor && (
          <View style={[styles.badge, styles.certificationBadge]}>
            <View
              style={[
                styles.certificationDot,
                { backgroundColor: certificationColor },
              ]}
            />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  verifiedBadge: {
    top: -4,
    right: -4,
    borderColor: '#0055AA',
  },
  certificationBadge: {
    bottom: -4,
    left: -4,
    borderColor: '#27AE60',
  },
  certificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});

export default ProducerMarker;
