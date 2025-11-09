/**
 * Map Constants and Configuration
 */

import { Region } from '../types/map';

// Default regions for different wine-producing areas
export const DEFAULT_REGIONS: Record<string, Region> = {
  FRANCE: {
    latitude: 46.2276,
    longitude: 2.2137,
    latitudeDelta: 15,
    longitudeDelta: 15,
  },
  BURGUNDY: {
    latitude: 47.0503,
    longitude: 4.8613,
    latitudeDelta: 2,
    longitudeDelta: 2,
  },
  LOIRE_VALLEY: {
    latitude: 47.3516,
    longitude: 0.6891,
    latitudeDelta: 2,
    longitudeDelta: 2,
  },
  JURA: {
    latitude: 46.7516,
    longitude: 5.7781,
    latitudeDelta: 1,
    longitudeDelta: 1,
  },
  BEAUJOLAIS: {
    latitude: 46.1561,
    longitude: 4.6419,
    latitudeDelta: 1,
    longitudeDelta: 1,
  },
  ALSACE: {
    latitude: 48.3181,
    longitude: 7.4416,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  },
  ITALY: {
    latitude: 42.8333,
    longitude: 12.8333,
    latitudeDelta: 12,
    longitudeDelta: 12,
  },
  PIEDMONT: {
    latitude: 44.8015,
    longitude: 8.0346,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  },
  TUSCANY: {
    latitude: 43.7711,
    longitude: 11.2486,
    latitudeDelta: 2,
    longitudeDelta: 2,
  },
  SICILY: {
    latitude: 37.5999,
    longitude: 14.0154,
    latitudeDelta: 3,
    longitudeDelta: 3,
  },
  SPAIN: {
    latitude: 40.4637,
    longitude: -3.7492,
    latitudeDelta: 12,
    longitudeDelta: 12,
  },
  CATALONIA: {
    latitude: 41.5912,
    longitude: 1.5209,
    latitudeDelta: 2,
    longitudeDelta: 2,
  },
  GEORGIA: {
    latitude: 42.3154,
    longitude: 43.3569,
    latitudeDelta: 4,
    longitudeDelta: 4,
  },
  AUSTRIA: {
    latitude: 47.5162,
    longitude: 14.5501,
    latitudeDelta: 4,
    longitudeDelta: 4,
  },
  GERMANY: {
    latitude: 51.1657,
    longitude: 10.4515,
    latitudeDelta: 8,
    longitudeDelta: 8,
  },
  SLOVENIA: {
    latitude: 46.1512,
    longitude: 14.9955,
    latitudeDelta: 2,
    longitudeDelta: 2,
  },
};

// Cluster size breakpoints
export const CLUSTER_SIZES = {
  SMALL: { min: 0, max: 10, size: 40, color: '#6B8E23' },
  MEDIUM: { min: 10, max: 50, size: 50, color: '#0055AA' },
  LARGE: { min: 50, max: 100, size: 60, color: '#F4D03F' },
  XLARGE: { min: 100, max: Infinity, size: 70, color: '#C1272D' },
};

// Marker colors by type
export const MARKER_COLORS = {
  PRODUCER: '#6B8E23', // Olive green
  VENUE: {
    WINE_BAR: '#C1272D', // Red
    RESTAURANT: '#F4D03F', // Yellow
    WINE_SHOP: '#0055AA', // Blue
    TASTING_ROOM: '#8B4513', // Brown
  },
  EVENT: '#F4D03F', // Yellow
};

// Certification badge colors
export const CERTIFICATION_COLORS = {
  BIODYNAMIC: '#9B59B6', // Purple
  DEMETER: '#9B59B6', // Purple
  ORGANIC: '#27AE60', // Green
  EU_ORGANIC: '#27AE60', // Green
  OTHER: '#3498DB', // Blue
};

// Map animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  ZOOM: 300,
  PAN: 500,
  MARKER_SELECT: 200,
};

// Zoom levels
export const ZOOM_LEVELS = {
  WORLD: 15,
  COUNTRY: 10,
  REGION: 5,
  CITY: 2,
  NEIGHBORHOOD: 0.5,
  STREET: 0.05,
};

// Map padding
export const MAP_PADDING = {
  TOP: 100,
  BOTTOM: 200, // Extra space for bottom sheet
  LEFT: 20,
  RIGHT: 20,
};

// Cache settings
export const CACHE_SETTINGS = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100, // Maximum number of cached entries
};

// Search settings
export const SEARCH_SETTINGS = {
  DEBOUNCE_DELAY: 500, // milliseconds
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 20,
};

// API endpoints
export const MAP_ENDPOINTS = {
  CLUSTERS: '/map/clusters',
  MARKERS: '/map/markers',
  SEARCH: '/map/search',
  GEOCODE: '/map/geocode',
  MARKER_DETAILS: '/map/markers/:type/:id',
};

// Map style URLs (for custom styling)
export const MAP_STYLES = {
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  NATURAL: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12',
};

// Feature flags
export const FEATURES = {
  CLUSTERING_ENABLED: true,
  HEATMAP_ENABLED: false,
  OFFLINE_MAPS_ENABLED: false,
  ROUTE_PLANNING_ENABLED: false,
  CUSTOM_MAP_STYLE: false,
};

// Performance settings
export const PERFORMANCE = {
  MAX_MARKERS_BEFORE_CLUSTERING: 50,
  MARKER_RENDER_BATCH_SIZE: 20,
  DEBOUNCE_REGION_CHANGE: 300,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to load map data. Please check your connection.',
  LOCATION_PERMISSION_DENIED: 'Location permission denied. Please enable it in settings.',
  GEOCODING_FAILED: 'Unable to find this location.',
  NO_RESULTS: 'No locations found.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOCATION_FOUND: 'Location found!',
  MARKERS_LOADED: 'Locations loaded successfully.',
};

// Map controls configuration
export const MAP_CONTROLS = {
  SHOW_USER_LOCATION: true,
  SHOW_COMPASS: true,
  SHOW_SCALE: false,
  SHOW_TRAFFIC: false,
  SHOW_BUILDINGS: true,
  ENABLE_ROTATION: true,
  ENABLE_TILT: false,
};

// Bottom sheet configuration
export const BOTTOM_SHEET_CONFIG = {
  SNAP_POINTS: ['50%', '90%'],
  INITIAL_INDEX: -1, // Closed
  ENABLE_PAN_DOWN_TO_CLOSE: true,
  ENABLE_CONTENT_PANNING_GESTURE: true,
  ENABLE_HANDLE_PANNING_GESTURE: true,
};

// Accessible name mappings
export const VENUE_TYPE_LABELS: Record<string, string> = {
  wine_bar: 'Wine Bar',
  restaurant: 'Restaurant',
  wine_shop: 'Wine Shop',
  tasting_room: 'Tasting Room',
};

export const MARKER_TYPE_LABELS: Record<string, string> = {
  producer: 'Wine Producer',
  venue: 'Venue',
  event: 'Event',
};

// Filter presets
export const FILTER_PRESETS = {
  ALL: {
    showProducers: true,
    showVenues: true,
    showEvents: true,
  },
  PRODUCERS_ONLY: {
    showProducers: true,
    showVenues: false,
    showEvents: false,
  },
  VENUES_ONLY: {
    showProducers: false,
    showVenues: true,
    showEvents: false,
  },
  EVENTS_ONLY: {
    showProducers: false,
    showVenues: false,
    showEvents: true,
  },
  NATURAL_WINE_BARS: {
    showProducers: false,
    showVenues: true,
    showEvents: false,
    venueTypes: ['wine_bar'],
  },
};
