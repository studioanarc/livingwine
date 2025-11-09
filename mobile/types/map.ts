/**
 * Map-related TypeScript type definitions
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Region extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export type MarkerType = 'producer' | 'venue' | 'event';

export type VenueType = 'wine_bar' | 'restaurant' | 'wine_shop' | 'tasting_room';

export interface BaseMarker {
  id: string;
  type: MarkerType;
  name: string;
  coordinates: Coordinates;
  address?: string;
}

export interface ProducerMarker extends BaseMarker {
  type: 'producer';
  producerName: string;
  region: string;
  certifications?: string[];
  photoUrl?: string;
  wineCount?: number;
  rating?: number;
  isVerified?: boolean;
}

export interface VenueMarker extends BaseMarker {
  type: 'venue';
  venueName: string;
  venueType: VenueType;
  description?: string;
  photoUrl?: string;
  rating?: number;
  priceRange?: number;
  naturalWineFocus?: boolean;
  currentWineCount?: number;
}

export interface EventMarker extends BaseMarker {
  type: 'event';
  eventName: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  photoUrl?: string;
  attendeeCount?: number;
}

export type Marker = ProducerMarker | VenueMarker | EventMarker;

export interface ClusterMarker {
  id: string;
  coordinates: Coordinates;
  pointCount: number;
  markers: Marker[];
}

export interface MapFilters {
  showProducers: boolean;
  showVenues: boolean;
  showEvents: boolean;
  venueTypes?: VenueType[];
  certifications?: string[];
  region?: string;
}

export interface MapState {
  markers: Marker[];
  clusters: ClusterMarker[];
  selectedMarker: Marker | null;
  filters: MapFilters;
  searchQuery: string;
  region: Region;
  isLoading: boolean;
  error: string | null;
}

export interface MapClusterData {
  type: 'Feature';
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    marker?: Marker;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}
