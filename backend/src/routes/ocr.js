/**
 * OCR Routes
 * Handles wine label OCR and address extraction endpoints
 */

const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const ocrService = require('../services/ocr');
const geocodingService = require('../services/geocoding');
const addressParser = require('../utils/addressParser');
const { Producer } = require('../models');

const router = express.Router();

// ============================================
// MULTER CONFIGURATION
// ============================================

// Configure multer for memory storage (images are processed immediately)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1 // One file at a time
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and HEIC images are allowed'));
    }
  }
});

// ============================================
// ERROR HANDLERS
// ============================================

/**
 * Handle multer errors
 */
function handleMulterError(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'File too large',
        message: 'Image must be less than 10MB'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Only one file can be uploaded at a time'
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: error.message
    });
  }

  next(error);
}

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/v1/ocr/label
 * Upload wine label image and extract information
 * Requires authentication
 */
router.post('/label',
  authenticate,
  upload.single('image'),
  handleMulterError,
  async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload an image file'
        });
      }

      // Check OCR service configuration
      const ocrConfig = ocrService.checkConfiguration();
      if (!ocrConfig.configured) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'OCR service is not configured',
          details: ocrConfig.errors
        });
      }

      // Process the wine label
      const result = await ocrService.processWineLabel(req.file.buffer);

      if (!result.success) {
        return res.status(422).json({
          error: 'Processing failed',
          message: result.error || 'Failed to extract information from label'
        });
      }

      // If address was found, try to geocode it
      if (result.wine.address && result.wine.address.parsed) {
        try {
          const geocodingConfig = geocodingService.checkConfiguration();

          if (geocodingConfig.configured) {
            const geocodeResult = await geocodingService.geocodeAddress(result.wine.address);

            if (geocodeResult.success && geocodeResult.results.length > 0) {
              result.wine.address.coordinates = geocodeResult.results[0].coordinates;
              result.wine.address.geocoded = true;
            }
          }
        } catch (geocodeError) {
          // Log error but don't fail the request
          console.error('Geocoding error:', geocodeError);
          result.wine.address.geocodingError = geocodeError.message;
        }
      }

      // Try to find matching producer in database
      let matchedProducer = null;
      if (result.wine.producer) {
        try {
          const { Op } = require('sequelize');
          matchedProducer = await Producer.findOne({
            where: {
              name: { [Op.iLike]: `%${result.wine.producer}%` }
            }
          });
        } catch (dbError) {
          console.error('Producer lookup error:', dbError);
        }
      }

      // Return comprehensive result
      res.json({
        success: true,
        wine: result.wine,
        ocr: {
          language: result.ocr.language,
          textExtracted: result.ocr.fullText.length > 0,
          confidence: result.wine.confidence
        },
        matchedProducer: matchedProducer ? {
          id: matchedProducer.id,
          name: matchedProducer.name,
          slug: matchedProducer.slug,
          region: matchedProducer.region,
          country: matchedProducer.country
        } : null,
        suggestions: {
          createProducer: !matchedProducer && result.wine.producer,
          createWine: true,
          addVenue: result.wine.address?.geocoded || false
        },
        timestamp: result.timestamp
      });

    } catch (error) {
      console.error('Label OCR error:', error);
      res.status(500).json({
        error: 'Processing failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to process wine label'
      });
    }
  }
);

/**
 * POST /api/v1/ocr/suggest-venue
 * Extract address from label and suggest adding it as a venue/location
 * Requires authentication
 */
router.post('/suggest-venue',
  authenticate,
  upload.single('image'),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
          message: 'Please upload an image file'
        });
      }

      // Check services configuration
      const ocrConfig = ocrService.checkConfiguration();
      const geocodingConfig = geocodingService.checkConfiguration();

      if (!ocrConfig.configured) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'OCR service is not configured',
          details: ocrConfig.errors
        });
      }

      if (!geocodingConfig.configured) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Geocoding service is not configured',
          details: geocodingConfig.errors
        });
      }

      // Extract text from image
      const ocrResult = await ocrService.extractTextFromImage(req.file.buffer);

      if (!ocrResult.success) {
        return res.status(422).json({
          error: 'OCR failed',
          message: ocrResult.error || 'Could not extract text from image'
        });
      }

      // Parse addresses from text
      const countryHint = req.body.countryHint || null;
      const addresses = addressParser.parseMultipleAddresses(ocrResult.fullText, countryHint);

      if (addresses.length === 0) {
        return res.status(404).json({
          error: 'No address found',
          message: 'Could not extract address information from the image',
          textExtracted: ocrResult.fullText
        });
      }

      // Geocode all found addresses
      const venuesSuggestions = [];

      for (const address of addresses) {
        try {
          const geocodeResult = await geocodingService.geocodeAddress(address);

          if (geocodeResult.success && geocodeResult.results.length > 0) {
            const topResult = geocodeResult.results[0];

            venuesSuggestions.push({
              name: address.city || address.region || 'Unknown Location',
              address: {
                ...address,
                coordinates: topResult.coordinates,
                formattedAddress: topResult.formattedAddress
              },
              coordinates: topResult.coordinates,
              suggestedType: determineVenueType(address, ocrResult.fullText),
              confidence: address.confidence
            });
          }
        } catch (geocodeError) {
          console.error('Geocoding error for address:', geocodeError);
        }
      }

      if (venuesSuggestions.length === 0) {
        return res.status(422).json({
          error: 'Geocoding failed',
          message: 'Found addresses but could not convert them to coordinates',
          addressesFound: addresses
        });
      }

      res.json({
        success: true,
        venues: venuesSuggestions,
        totalFound: venuesSuggestions.length,
        ocr: {
          language: ocrResult.language,
          fullText: ocrResult.fullText
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Venue suggestion error:', error);
      res.status(500).json({
        error: 'Processing failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to extract venue information'
      });
    }
  }
);

/**
 * POST /api/v1/ocr/parse-address
 * Parse address text without image upload
 * Requires authentication
 */
router.post('/parse-address',
  authenticate,
  [
    body('address').notEmpty().withMessage('Address text is required'),
    body('countryHint').optional().isLength({ min: 2, max: 2 }).withMessage('Country hint must be 2-letter code')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const { address, countryHint } = req.body;

      // Parse the address
      const parsed = addressParser.parseAddress(address, countryHint);

      // Validate the parsed address
      const validation = addressParser.validateAddress(parsed);

      res.json({
        success: parsed.parsed,
        address: parsed,
        validation,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Address parsing error:', error);
      res.status(500).json({
        error: 'Parsing failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to parse address'
      });
    }
  }
);

/**
 * POST /api/v1/ocr/geocode
 * Geocode an address to coordinates
 * Requires authentication
 */
router.post('/geocode',
  authenticate,
  [
    body('address').notEmpty().withMessage('Address is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const geocodingConfig = geocodingService.checkConfiguration();
      if (!geocodingConfig.configured) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Geocoding service is not configured',
          details: geocodingConfig.errors
        });
      }

      const { address, ...options } = req.body;

      const result = await geocodingService.geocodeAddress(address, options);

      if (!result.success) {
        return res.status(422).json({
          error: 'Geocoding failed',
          message: result.error
        });
      }

      res.json(result);

    } catch (error) {
      console.error('Geocoding error:', error);
      res.status(500).json({
        error: 'Geocoding failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to geocode address'
      });
    }
  }
);

/**
 * POST /api/v1/ocr/reverse-geocode
 * Reverse geocode coordinates to address
 * Requires authentication
 */
router.post('/reverse-geocode',
  authenticate,
  [
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const geocodingConfig = geocodingService.checkConfiguration();
      if (!geocodingConfig.configured) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Geocoding service is not configured',
          details: geocodingConfig.errors
        });
      }

      const { latitude, longitude, ...options } = req.body;

      const result = await geocodingService.reverseGeocode(latitude, longitude, options);

      if (!result.success) {
        return res.status(422).json({
          error: 'Reverse geocoding failed',
          message: result.error
        });
      }

      res.json(result);

    } catch (error) {
      console.error('Reverse geocoding error:', error);
      res.status(500).json({
        error: 'Reverse geocoding failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to reverse geocode coordinates'
      });
    }
  }
);

/**
 * GET /api/v1/ocr/status
 * Check OCR and geocoding service status
 * Requires authentication
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const ocrConfig = ocrService.checkConfiguration();
    const geocodingConfig = geocodingService.checkConfiguration();

    res.json({
      ocr: {
        configured: ocrConfig.configured,
        method: ocrConfig.method,
        errors: ocrConfig.errors || []
      },
      geocoding: {
        configured: geocodingConfig.configured,
        provider: geocodingConfig.provider,
        errors: geocodingConfig.errors || []
      },
      overall: {
        ready: ocrConfig.configured && geocodingConfig.configured,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Status check failed',
      message: error.message
    });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determine venue type from address and OCR text
 * @param {Object} address - Parsed address
 * @param {string} ocrText - Full OCR text
 * @returns {string} Venue type
 */
function determineVenueType(address, ocrText) {
  const textLower = ocrText.toLowerCase();

  // Check for winery/producer indicators
  const wineryKeywords = [
    'winery', 'weingut', 'domaine', 'château', 'bodega', 'cantina',
    'estate', 'vineyard', 'vignoble', 'viñedo', 'vigneto'
  ];

  for (const keyword of wineryKeywords) {
    if (textLower.includes(keyword)) {
      return 'winery';
    }
  }

  // Check for restaurant/bar indicators
  const restaurantKeywords = [
    'restaurant', 'bistro', 'café', 'bar', 'brasserie', 'trattoria'
  ];

  for (const keyword of restaurantKeywords) {
    if (textLower.includes(keyword)) {
      return 'restaurant';
    }
  }

  // Check for shop indicators
  const shopKeywords = [
    'shop', 'store', 'boutique', 'cave', 'enoteca', 'wine shop'
  ];

  for (const keyword of shopKeywords) {
    if (textLower.includes(keyword)) {
      return 'shop';
    }
  }

  // Default to winery if in a wine region
  if (address.region) {
    return 'winery';
  }

  return 'venue';
}

module.exports = router;
