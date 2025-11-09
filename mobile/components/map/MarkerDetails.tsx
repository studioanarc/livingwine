/**
 * MarkerDetails Component
 * Display marker details in bottom sheet
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Marker,
  ProducerMarker,
  VenueMarker,
  EventMarker,
} from '../../types/map';
import Svg, { Path } from 'react-native-svg';

interface MarkerDetailsProps {
  marker: Marker;
  onNavigate?: () => void;
  onViewDetails?: () => void;
}

export const MarkerDetails: React.FC<MarkerDetailsProps> = ({
  marker,
  onNavigate,
  onViewDetails,
}) => {
  const renderProducerDetails = (producer: ProducerMarker) => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.type}>Wine Producer</Text>
          <Text style={styles.name}>{producer.producerName}</Text>
          <Text style={styles.region}>{producer.region}</Text>
        </View>
        {producer.photoUrl && (
          <Image source={{ uri: producer.photoUrl }} style={styles.photo} />
        )}
      </View>

      {producer.certifications && producer.certifications.length > 0 && (
        <View style={styles.badges}>
          {producer.certifications.map((cert, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.stats}>
        {producer.wineCount !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{producer.wineCount}</Text>
            <Text style={styles.statLabel}>Wines</Text>
          </View>
        )}
        {producer.rating !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>★ {producer.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        )}
      </View>

      {producer.address && (
        <Text style={styles.address}>{producer.address}</Text>
      )}
    </View>
  );

  const renderVenueDetails = (venue: VenueMarker) => (
    <View style={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.type}>
            {venue.venueType.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.name}>{venue.venueName}</Text>
          {venue.naturalWineFocus && (
            <View style={styles.naturalBadge}>
              <Text style={styles.naturalBadgeText}>Natural Wine Focus</Text>
            </View>
          )}
        </View>
        {venue.photoUrl && (
          <Image source={{ uri: venue.photoUrl }} style={styles.photo} />
        )}
      </View>

      {venue.description && (
        <Text style={styles.description}>{venue.description}</Text>
      )}

      <View style={styles.stats}>
        {venue.currentWineCount !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{venue.currentWineCount}</Text>
            <Text style={styles.statLabel}>Natural Wines</Text>
          </View>
        )}
        {venue.rating !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>★ {venue.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        )}
        {venue.priceRange !== undefined && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{'€'.repeat(venue.priceRange)}</Text>
            <Text style={styles.statLabel}>Price</Text>
          </View>
        )}
      </View>

      {venue.address && (
        <Text style={styles.address}>{venue.address}</Text>
      )}
    </View>
  );

  const renderEventDetails = (event: EventMarker) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    return (
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.type}>{event.eventType}</Text>
            <Text style={styles.name}>{event.eventName}</Text>
            <Text style={styles.date}>
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </Text>
          </View>
          {event.photoUrl && (
            <Image source={{ uri: event.photoUrl }} style={styles.photo} />
          )}
        </View>

        {event.attendeeCount !== undefined && (
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{event.attendeeCount}</Text>
              <Text style={styles.statLabel}>Interested</Text>
            </View>
          </View>
        )}

        {event.address && (
          <Text style={styles.address}>{event.address}</Text>
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (marker.type) {
      case 'producer':
        return renderProducerDetails(marker);
      case 'venue':
        return renderVenueDetails(marker);
      case 'event':
        return renderEventDetails(marker);
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderContent()}

      <View style={styles.actions}>
        {onNavigate && (
          <TouchableOpacity style={styles.button} onPress={onNavigate}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"
                fill="#FFFFFF"
              />
            </Svg>
            <Text style={styles.buttonText}>Directions</Text>
          </TouchableOpacity>
        )}

        {onViewDetails && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onViewDetails}
          >
            <Text style={styles.buttonTextSecondary}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C7A6A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2416',
    marginBottom: 4,
  },
  region: {
    fontSize: 16,
    color: '#5C4A3A',
  },
  date: {
    fontSize: 14,
    color: '#5C4A3A',
    marginTop: 4,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3E4DB',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  badge: {
    backgroundColor: '#6B8E23',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  naturalBadge: {
    backgroundColor: '#6B8E23',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  naturalBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#5C4A3A',
    lineHeight: 20,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2416',
  },
  statLabel: {
    fontSize: 12,
    color: '#8C7A6A',
    marginTop: 2,
  },
  address: {
    fontSize: 14,
    color: '#5C4A3A',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  button: {
    flex: 1,
    backgroundColor: '#0055AA',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonSecondary: {
    backgroundColor: '#F3E4DB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#2C2416',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MarkerDetails;
