/**
 * OCR Service
 * Handles wine label text extraction using Google Cloud Vision API
 * Extracts producer name, wine name, region, vintage, and address information
 */

const vision = require('@google-cloud/vision');
const addressParser = require('../utils/addressParser');

/**
 * Initialize Google Cloud Vision client
 * Supports both API key and service account authentication
 */
let visionClient;

function getVisionClient() {
  if (visionClient) {
    return visionClient;
  }

  try {
    const config = {};

    // Option 1: Use API Key (simpler, less secure)
    if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
      config.keyFilename = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    }
    // Option 2: Use Service Account JSON (recommended)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Google Cloud SDK will automatically use this environment variable
      // Just create the client without config
    }
    // Option 3: Use inline credentials
    else if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      config.credentials = {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n')
      };
      config.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    }

    visionClient = new vision.ImageAnnotatorClient(config);
    return visionClient;
  } catch (error) {
    console.error('Failed to initialize Google Cloud Vision client:', error);
    throw new Error('OCR service configuration error');
  }
}

/**
 * Extract text from wine label image using Google Cloud Vision
 * @param {Buffer|string} image - Image buffer or base64 string or file path
 * @returns {Promise<Object>} Extracted text and metadata
 */
async function extractTextFromImage(image) {
  if (!image) {
    throw new Error('Image is required');
  }

  try {
    const client = getVisionClient();

    // Prepare image for Vision API
    let imageRequest;

    if (Buffer.isBuffer(image)) {
      imageRequest = { content: image };
    } else if (typeof image === 'string') {
      // Check if it's a URL, base64, or file path
      if (image.startsWith('http://') || image.startsWith('https://')) {
        imageRequest = { source: { imageUri: image } };
      } else if (image.startsWith('data:image')) {
        // Extract base64 data
        const base64Data = image.split(',')[1];
        imageRequest = { content: Buffer.from(base64Data, 'base64') };
      } else {
        // Assume it's a file path
        imageRequest = { source: { filename: image } };
      }
    } else {
      throw new Error('Invalid image format');
    }

    // Perform text detection
    const [result] = await client.textDetection(imageRequest);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return {
        success: false,
        text: '',
        fullText: '',
        error: 'No text detected in image'
      };
    }

    // First annotation contains the full text
    const fullText = detections[0].description;

    // Individual text blocks
    const textBlocks = detections.slice(1).map(text => ({
      text: text.description,
      bounds: text.boundingPoly,
      confidence: text.confidence
    }));

    return {
      success: true,
      fullText,
      textBlocks,
      language: detectLanguage(fullText),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OCR extraction error:', error);

    // Handle specific Google Cloud Vision errors
    if (error.code === 3) {
      throw new Error('Invalid image format or corrupted image');
    } else if (error.code === 7) {
      throw new Error('Permission denied - check API credentials');
    } else if (error.code === 8) {
      throw new Error('API quota exceeded');
    } else if (error.code === 16) {
      throw new Error('Authentication failed - check API credentials');
    }

    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Detect primary language in text
 * @param {string} text - Text to analyze
 * @returns {string} Detected language code
 */
function detectLanguage(text) {
  if (!text) return 'unknown';

  const text_lower = text.toLowerCase();

  // Simple language detection based on common wine-related words
  const languagePatterns = {
    'fr': ['appellation', 'château', 'domaine', 'vignoble', 'mis en bouteille', 'vin de', 'cuvée'],
    'it': ['denominazione', 'vino', 'cantina', 'imbottigliato', 'prodotto', 'tenuta'],
    'es': ['denominación', 'bodega', 'vino', 'embotellado', 'viñedo', 'cosecha'],
    'de': ['weingut', 'winzer', 'qualitätswein', 'erzeugerabfüllung', 'jahrgang'],
    'pt': ['vinho', 'quinta', 'produtor', 'engarrafado', 'denominação'],
    'en': ['estate', 'winery', 'vineyard', 'bottled', 'produced', 'wine']
  };

  let maxMatches = 0;
  let detectedLanguage = 'unknown';

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    let matches = 0;
    for (const pattern of patterns) {
      if (text_lower.includes(pattern)) {
        matches++;
      }
    }

    if (matches > maxMatches) {
      maxMatches = matches;
      detectedLanguage = lang;
    }
  }

  return detectedLanguage;
}

/**
 * Parse wine label information from extracted text
 * @param {string} text - Extracted text from OCR
 * @param {string} language - Detected or provided language
 * @returns {Object} Structured wine information
 */
function parseWineLabelInfo(text, language = null) {
  if (!text) {
    throw new Error('Text is required for parsing');
  }

  const lang = language || detectLanguage(text);
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  const result = {
    producer: null,
    wineName: null,
    vintage: null,
    region: null,
    appellation: null,
    wineType: null,
    grapeVarietals: [],
    alcoholPercentage: null,
    volume: null,
    address: null,
    rawText: text,
    language: lang,
    confidence: 0
  };

  try {
    // Extract producer name (usually at the top)
    result.producer = addressParser.extractProducerName(text);
    if (result.producer) result.confidence += 20;

    // Extract vintage year
    const vintageMatch = text.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (vintageMatch) {
      result.vintage = parseInt(vintageMatch[1]);
      result.confidence += 15;
    }

    // Extract alcohol percentage
    const alcoholMatch = text.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*%(?:\s*vol\.?)?/i);
    if (alcoholMatch) {
      result.alcoholPercentage = parseFloat(alcoholMatch[1].replace(',', '.'));
      result.confidence += 10;
    }

    // Extract volume
    const volumeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(ml|cl|l)/i);
    if (volumeMatch) {
      let volume = parseFloat(volumeMatch[1].replace(',', '.'));
      const unit = volumeMatch[2].toLowerCase();

      // Convert to ml
      if (unit === 'cl') volume *= 10;
      if (unit === 'l') volume *= 1000;

      result.volume = volume;
      result.confidence += 5;
    }

    // Extract appellation and region
    const appellationInfo = extractAppellation(text, lang);
    if (appellationInfo.appellation) {
      result.appellation = appellationInfo.appellation;
      result.confidence += 15;
    }
    if (appellationInfo.region) {
      result.region = appellationInfo.region;
      result.confidence += 10;
    }

    // Extract grape varietals
    const grapes = extractGrapeVarietals(text);
    if (grapes.length > 0) {
      result.grapeVarietals = grapes;
      result.confidence += 10;
    }

    // Detect wine type
    const wineType = detectWineType(text);
    if (wineType) {
      result.wineType = wineType;
      result.confidence += 10;
    }

    // Extract and parse address
    const addressText = extractAddressFromLabel(text);
    if (addressText) {
      const countryHint = detectCountryFromLanguage(lang);
      const parsedAddress = addressParser.parseAddress(addressText, countryHint);

      if (parsedAddress.parsed) {
        result.address = parsedAddress;
        result.confidence += parsedAddress.confidence * 0.15; // Scale down address confidence
      }
    }

    // Extract wine name (usually prominent text that's not producer or appellation)
    result.wineName = extractWineName(text, result.producer, result.appellation);
    if (result.wineName) result.confidence += 10;

  } catch (error) {
    console.error('Label parsing error:', error);
    result.error = error.message;
  }

  return result;
}

/**
 * Extract wine appellation and region
 * @param {string} text - Label text
 * @param {string} language - Language code
 * @returns {Object} Appellation and region info
 */
function extractAppellation(text, language) {
  const result = { appellation: null, region: null };

  const appellationPatterns = {
    fr: /(?:Appellation|AOC|AOP)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜ][a-zàâäéèêëïîôöùûü\s-]+?)(?:\s+(?:Contrôlée|Protégée))?/i,
    it: /(?:Denominazione|DOC|DOCG)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜ][a-zàâäéèêëïîôöùûü\s-]+?)(?:\s+(?:Controllata|Garantita))?/i,
    es: /(?:Denominación|DO|DOCa)\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜ][a-zàâäéèêëïîôöùûü\s-]+?)/i,
    de: /(?:Qualitätswein|QbA|Prädikatswein)\s+([A-ZÄÖÜ][a-zäöü\s-]+)/i,
    pt: /(?:Denominação|DOC|VQPRD)\s+([A-ZÀÂÃÇÉÊÍÓÔÕÚ][a-zàâãçéêíóôõú\s-]+)/i
  };

  const pattern = appellationPatterns[language];
  if (pattern) {
    const match = text.match(pattern);
    if (match) {
      result.appellation = match[1].trim();
    }
  }

  // Extract region from country configs
  result.region = addressParser.extractWineRegion(text);

  return result;
}

/**
 * Extract grape varietals from text
 * @param {string} text - Label text
 * @returns {Array} Array of grape varietals
 */
function extractGrapeVarietals(text) {
  const commonGrapes = [
    'Chardonnay', 'Sauvignon Blanc', 'Riesling', 'Pinot Gris', 'Pinot Grigio',
    'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah', 'Shiraz', 'Grenache',
    'Tempranillo', 'Sangiovese', 'Nebbiolo', 'Barbera', 'Gamay',
    'Chenin Blanc', 'Viognier', 'Gewürztraminer', 'Albariño', 'Verdejo',
    'Grüner Veltliner', 'Garganega', 'Vermentino', 'Glera'
  ];

  const found = [];
  const textLower = text.toLowerCase();

  for (const grape of commonGrapes) {
    if (textLower.includes(grape.toLowerCase())) {
      found.push(grape);
    }
  }

  return found;
}

/**
 * Detect wine type (red, white, rosé, etc.)
 * @param {string} text - Label text
 * @returns {string|null} Wine type
 */
function detectWineType(text) {
  const textLower = text.toLowerCase();

  const typePatterns = {
    'sparkling': ['sparkling', 'spumante', 'espumoso', 'sekt', 'champagne', 'crémant', 'cava', 'prosecco'],
    'pet-nat': ['pétillant naturel', 'pet nat', 'pet-nat', 'pétnat'],
    'orange': ['orange wine', 'skin contact', 'amber wine', 'vin orange'],
    'rosé': ['rosé', 'rosato', 'rosado', 'rosa', 'rose wine'],
    'white': ['blanc', 'white', 'bianco', 'blanco', 'weiss', 'branco'],
    'red': ['rouge', 'red', 'rosso', 'tinto', 'rot', 'tinto']
  };

  for (const [type, patterns] of Object.entries(typePatterns)) {
    for (const pattern of patterns) {
      if (textLower.includes(pattern)) {
        return type === 'rosé' ? 'rose' : type;
      }
    }
  }

  return null;
}

/**
 * Extract address portion from label text
 * @param {string} text - Full label text
 * @returns {string|null} Address text
 */
function extractAddressFromLabel(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Address is usually in the bottom third of the label
  const bottomThird = lines.slice(Math.floor(lines.length * 2 / 3));

  // Look for lines with postal codes, street indicators, or country names
  const addressLines = bottomThird.filter(line => {
    return /\d{4,5}/.test(line) || // Has postal code
           /rue|via|calle|strasse|street|avenue/i.test(line) || // Has street indicator
           /france|italy|spain|germany|portugal/i.test(line); // Has country
  });

  if (addressLines.length > 0) {
    return addressLines.join('\n');
  }

  return null;
}

/**
 * Extract wine name from text
 * @param {string} text - Full text
 * @param {string} producer - Producer name (to exclude)
 * @param {string} appellation - Appellation (to exclude)
 * @returns {string|null} Wine name
 */
function extractWineName(text, producer, appellation) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);

  // Wine name is typically one of the first few prominent lines
  for (let i = 0; i < Math.min(7, lines.length); i++) {
    const line = lines[i];

    // Skip producer name
    if (producer && line.includes(producer)) {
      continue;
    }

    // Skip appellation
    if (appellation && line.includes(appellation)) {
      continue;
    }

    // Skip very short lines
    if (line.length < 3) {
      continue;
    }

    // Skip lines that are just numbers (vintage, etc.)
    if (/^\d+$/.test(line)) {
      continue;
    }

    // Skip common label text
    if (/appellation|denominazione|bottled|mise en bouteille/i.test(line)) {
      continue;
    }

    // This is likely the wine name
    if (line.length >= 3 && line.length <= 50) {
      return line;
    }
  }

  return null;
}

/**
 * Detect country from language code
 * @param {string} language - Language code
 * @returns {string|null} Country code
 */
function detectCountryFromLanguage(language) {
  const langToCountry = {
    'fr': 'FR',
    'it': 'IT',
    'es': 'ES',
    'de': 'DE',
    'pt': 'PT',
    'en': null
  };

  return langToCountry[language] || null;
}

/**
 * Process wine label image end-to-end
 * @param {Buffer|string} image - Image to process
 * @returns {Promise<Object>} Complete wine label information
 */
async function processWineLabel(image) {
  try {
    // Step 1: Extract text using OCR
    const ocrResult = await extractTextFromImage(image);

    if (!ocrResult.success) {
      return {
        success: false,
        error: ocrResult.error || 'Failed to extract text from image'
      };
    }

    // Step 2: Parse wine information
    const wineInfo = parseWineLabelInfo(ocrResult.fullText, ocrResult.language);

    // Step 3: Combine results
    return {
      success: true,
      wine: wineInfo,
      ocr: {
        fullText: ocrResult.fullText,
        language: ocrResult.language,
        textBlocks: ocrResult.textBlocks
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Wine label processing error:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if OCR service is properly configured
 * @returns {Object} Configuration status
 */
function checkConfiguration() {
  const status = {
    configured: false,
    method: null,
    errors: []
  };

  if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
    status.configured = true;
    status.method = 'API Key';
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    status.configured = true;
    status.method = 'Service Account (GOOGLE_APPLICATION_CREDENTIALS)';
  } else if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
    status.configured = true;
    status.method = 'Inline Credentials';
  } else {
    status.errors.push('No Google Cloud Vision credentials found');
    status.errors.push('Set GOOGLE_CLOUD_VISION_API_KEY or GOOGLE_APPLICATION_CREDENTIALS');
  }

  return status;
}

module.exports = {
  extractTextFromImage,
  parseWineLabelInfo,
  processWineLabel,
  detectLanguage,
  extractAppellation,
  extractGrapeVarietals,
  detectWineType,
  checkConfiguration
};
