/**
 * Address Parser Utility
 * Handles parsing of wine label addresses in various European formats
 * Supports French, Italian, Spanish, German, and other European address formats
 */

/**
 * European country configurations with their postal code patterns and common formats
 */
const COUNTRY_CONFIGS = {
  FR: {
    name: 'France',
    postalCodePattern: /\b\d{5}\b/,
    addressPattern: /(\d+[\w\s,-]*(?:rue|avenue|av\.|boulevard|bd|chemin|route|place|impasse|allée)[^,\n]*)/i,
    regions: ['Alsace', 'Bordeaux', 'Bourgogne', 'Burgundy', 'Champagne', 'Loire', 'Rhône', 'Provence', 'Languedoc', 'Roussillon']
  },
  IT: {
    name: 'Italy',
    postalCodePattern: /\b\d{5}\b/,
    addressPattern: /(\d+[\w\s,-]*(?:via|viale|piazza|corso|strada|vicolo|largo)[^,\n]*)/i,
    regions: ['Piemonte', 'Piedmont', 'Toscana', 'Tuscany', 'Veneto', 'Friuli', 'Sicilia', 'Sicily', 'Puglia']
  },
  ES: {
    name: 'Spain',
    postalCodePattern: /\b\d{5}\b/,
    addressPattern: /(\d+[\w\s,-]*(?:calle|c\/|avenida|av\.|plaza|pl\.|paseo|camino)[^,\n]*)/i,
    regions: ['Rioja', 'Ribera del Duero', 'Priorat', 'Penedès', 'Rías Baixas', 'Catalonia', 'Galicia']
  },
  DE: {
    name: 'Germany',
    postalCodePattern: /\b\d{5}\b/,
    addressPattern: /((?:Strasse|Straße|str\.|weg|platz|allee|gasse)[^,\n]*\d+)/i,
    regions: ['Mosel', 'Rheingau', 'Pfalz', 'Baden', 'Franken', 'Württemberg']
  },
  AT: {
    name: 'Austria',
    postalCodePattern: /\b\d{4}\b/,
    addressPattern: /((?:Strasse|Straße|str\.|weg|platz|gasse)[^,\n]*\d+)/i,
    regions: ['Wachau', 'Burgenland', 'Steiermark', 'Styria']
  },
  PT: {
    name: 'Portugal',
    postalCodePattern: /\b\d{4}-\d{3}\b/,
    addressPattern: /(\d+[\w\s,-]*(?:rua|avenida|av\.|praça|largo|travessa)[^,\n]*)/i,
    regions: ['Douro', 'Alentejo', 'Vinho Verde', 'Dão']
  },
  GR: {
    name: 'Greece',
    postalCodePattern: /\b\d{5}\b/,
    addressPattern: /(\d+[\w\s,-]*(?:οδός|leoforos|plateia)[^,\n]*)/i,
    regions: ['Santorini', 'Nemea', 'Macedonia', 'Peloponnese']
  }
};

/**
 * Common wine region keywords that might appear in addresses
 */
const WINE_REGION_KEYWORDS = [
  'AOC', 'AOP', 'DOC', 'DOCG', 'IGP', 'IGT', 'DO', 'DOCa', 'VdP',
  'appellation', 'denominazione', 'denominación'
];

/**
 * Parse a raw address string from a wine label
 * @param {string} rawAddress - Raw address text extracted from label
 * @param {string} hint - Optional country hint (ISO 2-letter code)
 * @returns {Object} Parsed address components
 */
function parseAddress(rawAddress, hint = null) {
  if (!rawAddress || typeof rawAddress !== 'string') {
    throw new Error('Invalid address input');
  }

  const address = rawAddress.trim();

  // Initialize result object
  const result = {
    raw: address,
    street: null,
    city: null,
    postalCode: null,
    region: null,
    country: null,
    countryCode: null,
    coordinates: null,
    confidence: 0,
    parsed: false
  };

  try {
    // Step 1: Detect country
    const detectedCountry = detectCountry(address, hint);
    if (detectedCountry) {
      result.country = detectedCountry.name;
      result.countryCode = detectedCountry.code;
      result.confidence += 25;
    }

    // Step 2: Extract postal code
    const postalCode = extractPostalCode(address, detectedCountry?.code);
    if (postalCode) {
      result.postalCode = postalCode;
      result.confidence += 20;
    }

    // Step 3: Extract street address
    const street = extractStreet(address, detectedCountry?.code);
    if (street) {
      result.street = street;
      result.confidence += 20;
    }

    // Step 4: Extract city
    const city = extractCity(address, postalCode);
    if (city) {
      result.city = city;
      result.confidence += 20;
    }

    // Step 5: Extract wine region
    const region = extractWineRegion(address, detectedCountry?.code);
    if (region) {
      result.region = region;
      result.confidence += 15;
    }

    // Mark as successfully parsed if we have at least city or street
    if (result.city || result.street) {
      result.parsed = true;
    }

    return result;
  } catch (error) {
    console.error('Address parsing error:', error);
    return {
      ...result,
      error: error.message
    };
  }
}

/**
 * Detect country from address text
 * @param {string} address - Address text
 * @param {string} hint - Country code hint
 * @returns {Object|null} Country info
 */
function detectCountry(address, hint = null) {
  // Check hint first
  if (hint && COUNTRY_CONFIGS[hint.toUpperCase()]) {
    const code = hint.toUpperCase();
    return { code, name: COUNTRY_CONFIGS[code].name };
  }

  // Look for explicit country mentions
  const addressLower = address.toLowerCase();

  for (const [code, config] of Object.entries(COUNTRY_CONFIGS)) {
    const countryName = config.name.toLowerCase();

    // Check for country name or code
    if (addressLower.includes(countryName) ||
        addressLower.includes(code.toLowerCase())) {
      return { code, name: config.name };
    }

    // Check for region names specific to this country
    if (config.regions) {
      for (const region of config.regions) {
        if (addressLower.includes(region.toLowerCase())) {
          return { code, name: config.name };
        }
      }
    }
  }

  // Try to detect by postal code pattern
  for (const [code, config] of Object.entries(COUNTRY_CONFIGS)) {
    if (config.postalCodePattern.test(address)) {
      return { code, name: config.name };
    }
  }

  return null;
}

/**
 * Extract postal code from address
 * @param {string} address - Address text
 * @param {string} countryCode - Country code
 * @returns {string|null} Postal code
 */
function extractPostalCode(address, countryCode = null) {
  if (!countryCode) {
    // Try common European postal code patterns
    const genericPattern = /\b\d{4,5}(?:-\d{3})?\b/;
    const match = address.match(genericPattern);
    return match ? match[0].trim() : null;
  }

  const config = COUNTRY_CONFIGS[countryCode];
  if (!config || !config.postalCodePattern) {
    return null;
  }

  const match = address.match(config.postalCodePattern);
  return match ? match[0].trim() : null;
}

/**
 * Extract street address
 * @param {string} address - Address text
 * @param {string} countryCode - Country code
 * @returns {string|null} Street address
 */
function extractStreet(address, countryCode = null) {
  if (!countryCode) {
    // Generic street extraction for common patterns
    const genericPattern = /(\d+[\w\s,-]*(?:street|st\.|road|rd\.|avenue|ave\.|drive|dr\.)[^,\n]*)/i;
    const match = address.match(genericPattern);
    return match ? match[1].trim() : null;
  }

  const config = COUNTRY_CONFIGS[countryCode];
  if (!config || !config.addressPattern) {
    return null;
  }

  const match = address.match(config.addressPattern);
  return match ? match[1].trim() : null;
}

/**
 * Extract city name from address
 * @param {string} address - Address text
 * @param {string} postalCode - Postal code (helps identify city)
 * @returns {string|null} City name
 */
function extractCity(address, postalCode = null) {
  // Split address into lines
  const lines = address.split(/[\n,]/).map(l => l.trim()).filter(l => l);

  // If we have a postal code, city is usually on the same line or adjacent
  if (postalCode) {
    for (const line of lines) {
      if (line.includes(postalCode)) {
        // Extract text after postal code
        const parts = line.split(postalCode);
        if (parts[1]) {
          const city = parts[1].trim().split(/[,\n]/)[0];
          if (city && city.length > 1) {
            return cleanCityName(city);
          }
        }
        // Or before postal code
        if (parts[0]) {
          const city = parts[0].trim().split(/[,\n]/).pop();
          if (city && city.length > 1 && !city.match(/\d+/)) {
            return cleanCityName(city);
          }
        }
      }
    }
  }

  // Look for capitalized words that might be city names
  for (const line of lines) {
    // Skip lines with street indicators
    if (/rue|via|calle|strasse|street|avenue|road/i.test(line)) {
      continue;
    }

    // Look for capitalized words (cities are usually capitalized)
    const cityMatch = line.match(/\b([A-ZÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜ][a-zàáâäçèéêëìíîïñòóôöùúûü]{2,}(?:\s+[A-ZÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜ][a-zàáâäçèéêëìíîïñòóôöùúûü]+)?)\b/);
    if (cityMatch) {
      return cleanCityName(cityMatch[1]);
    }
  }

  return null;
}

/**
 * Clean city name (remove extra characters)
 * @param {string} city - Raw city name
 * @returns {string} Cleaned city name
 */
function cleanCityName(city) {
  return city
    .replace(/[()[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract wine region from address
 * @param {string} address - Address text
 * @param {string} countryCode - Country code
 * @returns {string|null} Wine region
 */
function extractWineRegion(address, countryCode = null) {
  const addressLower = address.toLowerCase();

  // Check country-specific regions
  if (countryCode && COUNTRY_CONFIGS[countryCode]?.regions) {
    for (const region of COUNTRY_CONFIGS[countryCode].regions) {
      if (addressLower.includes(region.toLowerCase())) {
        return region;
      }
    }
  }

  // Check all regions across countries
  for (const config of Object.values(COUNTRY_CONFIGS)) {
    if (config.regions) {
      for (const region of config.regions) {
        if (addressLower.includes(region.toLowerCase())) {
          return region;
        }
      }
    }
  }

  return null;
}

/**
 * Validate parsed address
 * @param {Object} parsedAddress - Parsed address object
 * @returns {Object} Validation result
 */
function validateAddress(parsedAddress) {
  const errors = [];
  const warnings = [];

  if (!parsedAddress) {
    errors.push('Address object is null or undefined');
    return { valid: false, errors, warnings };
  }

  // Check if address was successfully parsed
  if (!parsedAddress.parsed) {
    warnings.push('Address could not be fully parsed');
  }

  // Check for minimum required fields
  if (!parsedAddress.city && !parsedAddress.street) {
    errors.push('Address must have at least a city or street');
  }

  // Check confidence level
  if (parsedAddress.confidence < 40) {
    warnings.push('Low confidence in address parsing (< 40%)');
  }

  // Check country
  if (!parsedAddress.country && !parsedAddress.countryCode) {
    warnings.push('Country could not be determined');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    confidence: parsedAddress.confidence
  };
}

/**
 * Format address for geocoding API
 * @param {Object} parsedAddress - Parsed address object
 * @returns {string} Formatted address string
 */
function formatForGeocoding(parsedAddress) {
  const parts = [];

  if (parsedAddress.street) {
    parts.push(parsedAddress.street);
  }

  if (parsedAddress.postalCode && parsedAddress.city) {
    parts.push(`${parsedAddress.postalCode} ${parsedAddress.city}`);
  } else if (parsedAddress.city) {
    parts.push(parsedAddress.city);
  } else if (parsedAddress.postalCode) {
    parts.push(parsedAddress.postalCode);
  }

  if (parsedAddress.region) {
    parts.push(parsedAddress.region);
  }

  if (parsedAddress.country) {
    parts.push(parsedAddress.country);
  }

  return parts.join(', ');
}

/**
 * Extract producer name from OCR text
 * @param {string} text - OCR extracted text
 * @returns {string|null} Producer name
 */
function extractProducerName(text) {
  if (!text) return null;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Producer name is typically at the top and capitalized
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];

    // Skip very short lines or lines with only numbers
    if (line.length < 3 || /^\d+$/.test(line)) {
      continue;
    }

    // Look for lines that are mostly uppercase or title case
    if (line === line.toUpperCase() || /^[A-ZÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜ]/.test(line)) {
      // Remove common prefixes
      const cleaned = line
        .replace(/^(DOMAINE|CHÂTEAU|CHATEAU|ESTATE|WINERY|VIGNOBLE|BODEGA|CANTINA|WEINGUT)\s+/i, '')
        .trim();

      if (cleaned.length >= 3) {
        return cleaned;
      }
    }
  }

  return null;
}

/**
 * Parse multiple address formats from text
 * @param {string} text - OCR text containing potential addresses
 * @param {string} countryHint - Optional country hint
 * @returns {Array} Array of parsed addresses
 */
function parseMultipleAddresses(text, countryHint = null) {
  if (!text) return [];

  const addresses = [];

  // Split by common delimiters
  const chunks = text.split(/\n\n+/);

  for (const chunk of chunks) {
    if (chunk.trim().length < 10) continue;

    try {
      const parsed = parseAddress(chunk, countryHint);
      if (parsed.parsed && parsed.confidence > 30) {
        addresses.push(parsed);
      }
    } catch (error) {
      // Continue with next chunk
      console.error('Error parsing address chunk:', error);
    }
  }

  return addresses;
}

module.exports = {
  parseAddress,
  validateAddress,
  formatForGeocoding,
  extractProducerName,
  parseMultipleAddresses,
  detectCountry,
  extractPostalCode,
  extractCity,
  extractWineRegion,
  COUNTRY_CONFIGS,
  WINE_REGION_KEYWORDS
};
