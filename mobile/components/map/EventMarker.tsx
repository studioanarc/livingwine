/**
 * EventMarker Component
 * Custom marker for wine events
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { EventMarker as EventMarkerType } from '../../types/map';
import Svg, { Path, Rect } from 'react-native-svg';

interface EventMarkerProps {
  event: EventMarkerType;
  onPress: (event: EventMarkerType) => void;
  isSelected?: boolean;
}

export const EventMarker: React.FC<EventMarkerProps> = ({
  event,
  onPress,
  isSelected = false,
}) => {
  const size = isSelected ? 40 : 32;
  const color = '#F4D03F'; // Yellow for events

  // Calendar/event icon
  const EventIcon = () => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Calendar background */}
      <Rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      {/* Calendar header */}
      <Rect
        x="3"
        y="4"
        width="18"
        height="4"
        fill="#C1272D"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
      {/* Calendar dots/dates */}
      <Path
        d="M7 12h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"
        fill="#2C2416"
      />
    </Svg>
  );

  return (
    <Marker
      coordinate={event.coordinates}
      onPress={() => onPress(event)}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.markerContainer,
          isSelected && styles.markerSelected,
        ]}
      >
        <EventIcon />
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
});

export default EventMarker;
