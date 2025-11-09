/**
 * Geocoding Service
 * Handles address-to-coordinates conversion and reverse geocoding
 * Supports both Mapbox and Google Maps Geocoding APIs
 */

const axios = require('axios');
const addressParser = require('../utils/addressParser');

/**
 * Geocoding provider configuration
 */
const PROVIDERS = {
  MAPBOX: 'mapbox',
  GOOGLE: 'google'
};

/**
 * Get the configured geocoding provider
 * @returns {string} Provider name
 */
function getProvider() {
  if (process.env.MAPBOX_ACCESS_TOKEN) {
    return PROVIDERS.MAPBOX;
  } else if (process.env.GOOGLE_MAPS_API_KEY) {
    return PROVIDERS.GOOGLE;
  }

  throw new Error('No geocoding provider configured. Set MAPBOX_ACCESS_TOKEN or GOOGLE_MAPS_API_KEY');
}

/**
 * Forward geocoding - Convert address to coordinates
 * @param {string|Object} address - Address string or parsed address object
 * @param {Object} options - Geocoding options
 * @returns {Promise<Object>} Geocoding result with coordinates
 */
async function geocodeAddress(address, options = {}) {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    // Convert parsed address object to string if needed
    let addressString;
    if (typeof address === 'object') {
      addressString = addressParser.formatForGeocoding(address);
    } else {
      addressString = address;
    }

    const provider = options.provider || getProvider();

    let result;
    if (provider === PROVIDERS.MAPBOX) {
      result = await geocodeWithMapbox(addressString, options);
    } else if (provider === PROVIDERS.GOOGLE) {
      result = await geocodeWithGoogle(addressString, options);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      success: true,
      ...result,
      provider,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Geocode using Mapbox Geocoding API
 * @param {string} address - Address string
 * @param {Object} options - Options
 * @returns {Promise<Object>} Geocoding result
 */
async function geocodeWithMapbox(address, options = {}) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MAPBOX_ACCESS_TOKEN not configured');
  }

  const params = {
    access_token: token,
    limit: options.limit || 1,
    language: options.language || 'en',
    autocomplete: false
  };

  // Add country filter if provided
  if (options.country) {
    params.country = options.country.toLowerCase();
  }

  // Add type filter (place, address, region, etc.)
  if (options.types) {
    params.types = Array.isArray(options.types) ? options.types.join(',') : options.types;
  } else {
    // Default to address and place for wine venues
    params.types = 'address,place';
  }

  // Add proximity bias if provided
  if (options.proximity) {
    params.proximity = `${options.proximity.longitude},${options.proximity.latitude}`;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`;

    const response = await axios.get(url, {
      params,
      timeout: 10000
    });

    if (!response.data || !response.data.features || response.data.features.length === 0) {
      throw new Error('No results found for address');
    }

    const features = response.data.features;
    const results = features.map(feature => ({
      coordinates: {
        longitude: feature.center[0],
        latitude: feature.center[1]
      },
      formattedAddress: feature.place_name,
      accuracy: feature.relevance,
      placeType: feature.place_type[0],
      context: parseMapboxContext(feature.context),
      bbox: feature.bbox,
      raw: feature
    }));

    return {
      results,
      query: address,
      resultsCount: results.length
    };
  } catch (error) {
    if (error.response) {
      // API error
      throw new Error(`Mapbox API error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error connecting to Mapbox API');
    } else {
      throw error;
    }
  }
}

/**
 * Parse Mapbox context array into structured location data
 * @param {Array} context - Mapbox context array
 * @returns {Object} Structured context
 */
function parseMapboxContext(context) {
  if (!context) return {};

  const parsed = {};

  for (const item of context) {
    const id = item.id.split('.')[0];
    parsed[id] = {
      name: item.text,
      shortCode: item.short_code
    };
  }

  return {
    postcode: parsed.postcode?.name || null,
    place: parsed.place?.name || null,
    region: parsed.region?.name || null,
    country: parsed.country?.name || null,
    countryCode: parsed.country?.shortCode?.replace('country.', '') || null
  };
}

/**
 * Geocode using Google Maps Geocoding API
 * @param {string} address - Address string
 * @param {Object} options - Options
 * @returns {Promise<Object>} Geocoding result
 */
async function geocodeWithGoogle(address, options = {}) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  const params = {
    address,
    key: apiKey,
    language: options.language || 'en'
  };

  // Add region bias if provided
  if (options.country) {
    params.region = options.country.toLowerCase();
  }

  // Add component filters
  if (options.components) {
    params.components = options.components;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params,
      timeout: 10000
    });

    if (response.data.status !== 'OK') {
      if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('No results found for address');
      } else if (response.data.status === 'REQUEST_DENIED') {
        throw new Error('API request denied - check API key');
      } else if (response.data.status === 'OVER_QUERY_LIMIT') {
        throw new Error('API quota exceeded');
      } else {
        throw new Error(`Google API error: ${response.data.status}`);
      }
    }

    const results = response.data.results.map(result => ({
      coordinates: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      },
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      locationType: result.geometry.location_type,
      types: result.types,
      addressComponents: parseGoogleAddressComponents(result.address_components),
      viewport: result.geometry.viewport,
      raw: result
    }));

    return {
      results,
      query: address,
      resultsCount: results.length
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Google API error: ${error.response.data.error_message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error connecting to Google Maps API');
    } else {
      throw error;
    }
  }
}

/**
 * Parse Google address components into structured data
 * @param {Array} components - Google address components
 * @returns {Object} Structured address
 */
function parseGoogleAddressComponents(components) {
  if (!components) return {};

  const parsed = {};

  const componentMap = {
    street_number: 'streetNumber',
    route: 'street',
    locality: 'city',
    postal_town: 'city',
    administrative_area_level_1: 'region',
    administrative_area_level_2: 'region2',
    country: 'country',
    postal_code: 'postalCode'
  };

  for (const component of components) {
    for (const type of component.types) {
      if (componentMap[type]) {
        const key = componentMap[type];
        parsed[key] = component.long_name;

        if (type === 'country') {
          parsed.countryCode = component.short_name;
        }
      }
    }
  }

  return parsed;
}

/**
 * Reverse geocoding - Convert coordinates to address
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {Object} options - Options
 * @returns {Promise<Object>} Reverse geocoding result
 */
async function reverseGeocode(latitude, longitude, options = {}) {
  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required');
  }

  // Validate coordinates
  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude (must be between -90 and 90)');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude (must be between -180 and 180)');
  }

  try {
    const provider = options.provider || getProvider();

    let result;
    if (provider === PROVIDERS.MAPBOX) {
      result = await reverseGeocodeWithMapbox(longitude, latitude, options);
    } else if (provider === PROVIDERS.GOOGLE) {
      result = await reverseGeocodeWithGoogle(latitude, longitude, options);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    return {
      success: true,
      ...result,
      provider,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Reverse geocode using Mapbox
 * @param {number} longitude - Longitude
 * @param {number} latitude - Latitude
 * @param {Object} options - Options
 * @returns {Promise<Object>} Result
 */
async function reverseGeocodeWithMapbox(longitude, latitude, options = {}) {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MAPBOX_ACCESS_TOKEN not configured');
  }

  const params = {
    access_token: token,
    limit: options.limit || 1,
    language: options.language || 'en'
  };

  // Add type filter
  if (options.types) {
    params.types = Array.isArray(options.types) ? options.types.join(',') : options.types;
  } else {
    params.types = 'address,place,locality';
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`;

    const response = await axios.get(url, {
      params,
      timeout: 10000
    });

    if (!response.data || !response.data.features || response.data.features.length === 0) {
      throw new Error('No results found for coordinates');
    }

    const features = response.data.features;
    const results = features.map(feature => ({
      formattedAddress: feature.place_name,
      placeType: feature.place_type[0],
      context: parseMapboxContext(feature.context),
      raw: feature
    }));

    return {
      results,
      coordinates: { latitude, longitude },
      resultsCount: results.length
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Mapbox API error: ${error.response.data.message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error connecting to Mapbox API');
    } else {
      throw error;
    }
  }
}

/**
 * Reverse geocode using Google Maps
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {Object} options - Options
 * @returns {Promise<Object>} Result
 */
async function reverseGeocodeWithGoogle(latitude, longitude, options = {}) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  const params = {
    latlng: `${latitude},${longitude}`,
    key: apiKey,
    language: options.language || 'en'
  };

  // Add result type filter if provided
  if (options.resultType) {
    params.result_type = options.resultType;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params,
      timeout: 10000
    });

    if (response.data.status !== 'OK') {
      if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('No results found for coordinates');
      } else {
        throw new Error(`Google API error: ${response.data.status}`);
      }
    }

    const results = response.data.results.map(result => ({
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
      types: result.types,
      addressComponents: parseGoogleAddressComponents(result.address_components),
      raw: result
    }));

    return {
      results,
      coordinates: { latitude, longitude },
      resultsCount: results.length
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Google API error: ${error.response.data.error_message || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error connecting to Google Maps API');
    } else {
      throw error;
    }
  }
}

/**
 * Batch geocode multiple addresses
 * @param {Array<string>} addresses - Array of addresses
 * @param {Object} options - Options
 * @returns {Promise<Array>} Array of geocoding results
 */
async function batchGeocode(addresses, options = {}) {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    throw new Error('Addresses array is required');
  }

  const maxBatchSize = options.maxBatchSize || 10;
  if (addresses.length > maxBatchSize) {
    throw new Error(`Batch size exceeds maximum (${maxBatchSize})`);
  }

  const results = [];
  const delay = options.delay || 100; // Delay between requests to avoid rate limits

  for (let i = 0; i < addresses.length; i++) {
    try {
      const result = await geocodeAddress(addresses[i], options);
      results.push(result);

      // Add delay between requests (except for last one)
      if (i < addresses.length - 1) {
        await sleep(delay);
      }
    } catch (error) {
      results.push({
        success: false,
        address: addresses[i],
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Object} coord1 - First coordinate {latitude, longitude}
 * @param {Object} coord2 - Second coordinate {latitude, longitude}
 * @param {string} unit - Unit of measurement ('km' or 'miles')
 * @returns {number} Distance
 */
function calculateDistance(coord1, coord2, unit = 'km') {
  const R = unit === 'miles' ? 3959 : 6371; // Earth's radius

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Sleep utility for rate limiting
 * @param {number} ms - Milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if geocoding service is properly configured
 * @returns {Object} Configuration status
 */
function checkConfiguration() {
  const status = {
    configured: false,
    provider: null,
    errors: []
  };

  if (process.env.MAPBOX_ACCESS_TOKEN) {
    status.configured = true;
    status.provider = PROVIDERS.MAPBOX;
  } else if (process.env.GOOGLE_MAPS_API_KEY) {
    status.configured = true;
    status.provider = PROVIDERS.GOOGLE;
  } else {
    status.errors.push('No geocoding provider configured');
    status.errors.push('Set MAPBOX_ACCESS_TOKEN or GOOGLE_MAPS_API_KEY');
  }

  return status;
}

/**
 * Validate and normalize coordinates
 * @param {Object} coordinates - Coordinates object
 * @returns {Object} Validated coordinates
 */
function validateCoordinates(coordinates) {
  if (!coordinates || typeof coordinates !== 'object') {
    throw new Error('Coordinates must be an object');
  }

  const { latitude, longitude } = coordinates;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  return {
    latitude: parseFloat(latitude.toFixed(7)),
    longitude: parseFloat(longitude.toFixed(7))
  };
}

module.exports = {
  geocodeAddress,
  reverseGeocode,
  batchGeocode,
  calculateDistance,
  validateCoordinates,
  checkConfiguration,
  PROVIDERS
};
