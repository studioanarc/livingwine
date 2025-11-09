/**
 * Map Utility Functions
 */

import { Coordinates, Region } from '../types/map';

/**
 * Calculate distance between two coordinates in kilometers
 * Using the Haversine formula
 */
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (kilometers: number): string => {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)}m`;
  }
  return `${kilometers.toFixed(1)}km`;
};

/**
 * Calculate zoom level from region delta
 */
export const calculateZoomLevel = (latitudeDelta: number): number => {
  return Math.round(Math.log2(360 / latitudeDelta));
};

/**
 * Get region delta from zoom level
 */
export const getRegionDeltaFromZoom = (zoom: number): number => {
  return 360 / Math.pow(2, zoom);
};

/**
 * Check if a coordinate is within a region
 */
export const isCoordinateInRegion = (
  coordinate: Coordinates,
  region: Region
): boolean => {
  const latMin = region.latitude - region.latitudeDelta / 2;
  const latMax = region.latitude + region.latitudeDelta / 2;
  const lonMin = region.longitude - region.longitudeDelta / 2;
  const lonMax = region.longitude + region.longitudeDelta / 2;

  return (
    coordinate.latitude >= latMin &&
    coordinate.latitude <= latMax &&
    coordinate.longitude >= lonMin &&
    coordinate.longitude <= lonMax
  );
};

/**
 * Get bounding box from region
 */
export const getBoundingBox = (
  region: Region
): {
  northEast: Coordinates;
  southWest: Coordinates;
} => {
  return {
    northEast: {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    },
    southWest: {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    },
  };
};

/**
 * Calculate center point from multiple coordinates
 */
export const getCenterPoint = (coordinates: Coordinates[]): Coordinates => {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty array');
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      latitude: acc.latitude + coord.latitude,
      longitude: acc.longitude + coord.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: sum.latitude / coordinates.length,
    longitude: sum.longitude / coordinates.length,
  };
};

/**
 * Calculate region that fits all coordinates
 */
export const getRegionForCoordinates = (
  coordinates: Coordinates[],
  padding: number = 0.1
): Region => {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate region for empty array');
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach((coord) => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  const latDelta = (maxLat - minLat) * (1 + padding);
  const lngDelta = (maxLng - minLng) * (1 + padding);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum delta
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

/**
 * Interpolate between two coordinates
 */
export const interpolateCoordinates = (
  start: Coordinates,
  end: Coordinates,
  fraction: number
): Coordinates => {
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * fraction,
    longitude: start.longitude + (end.longitude - start.longitude) * fraction,
  };
};

/**
 * Generate URL for Google Maps directions
 */
export const getDirectionsUrl = (
  destination: Coordinates,
  origin?: Coordinates
): string => {
  const baseUrl = 'https://www.google.com/maps/dir/';

  if (origin) {
    return `${baseUrl}${origin.latitude},${origin.longitude}/${destination.latitude},${destination.longitude}`;
  }

  return `${baseUrl}/${destination.latitude},${destination.longitude}`;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (coordinates: Coordinates): string => {
  const lat = coordinates.latitude.toFixed(6);
  const lng = coordinates.longitude.toFixed(6);
  const latDir = coordinates.latitude >= 0 ? 'N' : 'S';
  const lngDir = coordinates.longitude >= 0 ? 'E' : 'W';

  return `${Math.abs(parseFloat(lat))}°${latDir}, ${Math.abs(parseFloat(lng))}°${lngDir}`;
};

/**
 * Parse coordinates from string
 */
export const parseCoordinates = (str: string): Coordinates | null => {
  // Support formats: "lat,lng" or "lat, lng"
  const parts = str.split(',').map((s) => s.trim());

  if (parts.length !== 2) return null;

  const latitude = parseFloat(parts[0]);
  const longitude = parseFloat(parts[1]);

  if (isNaN(latitude) || isNaN(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;

  return { latitude, longitude };
};

/**
 * Validate coordinates
 */
export const isValidCoordinate = (coordinates: Coordinates): boolean => {
  return (
    typeof coordinates.latitude === 'number' &&
    typeof coordinates.longitude === 'number' &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
};

/**
 * Generate random coordinates within a region (for testing)
 */
export const generateRandomCoordinate = (region: Region): Coordinates => {
  const latOffset = (Math.random() - 0.5) * region.latitudeDelta;
  const lngOffset = (Math.random() - 0.5) * region.longitudeDelta;

  return {
    latitude: region.latitude + latOffset,
    longitude: region.longitude + lngOffset,
  };
};

/**
 * Get map style URL for different themes
 */
export const getMapStyleUrl = (theme: 'light' | 'dark' | 'natural'): string => {
  const styles = {
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11',
    natural: 'mapbox://styles/mapbox/outdoors-v12',
  };

  return styles[theme];
};
