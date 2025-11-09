import Constants from 'expo-constants';

/**
 * App Configuration
 * Centralizes environment variables and app constants
 */

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    googleMapsApiKey: '',
  },
  staging: {
    apiUrl: 'https://staging-api.tipsy.com/api',
    googleMapsApiKey: '',
  },
  prod: {
    apiUrl: 'https://api.tipsy.com/api',
    googleMapsApiKey: '',
  },
};

const getEnvVars = (env = Constants.expoConfig?.extra?.environment || 'dev') => {
  if (env === 'prod') return ENV.prod;
  if (env === 'staging') return ENV.staging;
  return ENV.dev;
};

const envVars = getEnvVars();

export const Config = {
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || envVars.apiUrl,
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || envVars.googleMapsApiKey,

  // OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  APPLE_CLIENT_ID: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || '',

  // Feature Flags
  ENABLE_OCR: true,
  ENABLE_MAPS: true,
  ENABLE_SOCIAL: true,

  // App Constants
  APP_NAME: 'Tipsy',
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Image Upload
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],

  // Map Configuration
  DEFAULT_MAP_ZOOM: 12,
  CLUSTER_RADIUS: 50,
  MAX_ZOOM_LEVEL: 18,

  // Cache Configuration
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  OFFLINE_CACHE_SIZE: 100, // Number of items to cache offline
} as const;

export default Config;
