const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Venue, User } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

const router = express.Router();

// Helper function to generate slug
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
};

// GET /api/v1/venues - Search venues
router.get('/',
  optionalAuth,
  [
    query('search')
      .optional()
      .isString()
      .trim(),
    query('city')
      .optional()
      .isString(),
    query('type')
      .optional()
      .isString(),
    query('verified')
      .optional()
      .isBoolean(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be non-negative')
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

      const {
        search,
        city,
        type,
        verified,
        limit = 20,
        offset = 0
      } = req.query;

      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (city) {
        where.city = { [Op.iLike]: `%${city}%` };
      }

      if (type) {
        where.venueType = type;
      }

      if (verified !== undefined) {
        where.isVerified = verified === 'true';
      }

      const venues = await Venue.findAndCountAll({
        where,
        attributes: {
          exclude: ['deletedAt']
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['totalCheckins', 'DESC']]
      });

      res.json({
        venues: venues.rows,
        total: venues.count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Search venues error:', error);
      res.status(500).json({
        error: 'Failed to search venues',
        message: error.message
      });
    }
  }
);

// GET /api/v1/venues/suggest - Auto-suggest venues based on partial name/address
router.get('/suggest',
  optionalAuth,
  [
    query('q')
      .notEmpty()
      .isString()
      .trim()
      .withMessage('Search query required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Limit must be between 1 and 20')
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

      const { q } = req.query;
      const limit = parseInt(req.query.limit) || 10;

      const venues = await Venue.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `${q}%` } },
            { address: { [Op.iLike]: `${q}%` } }
          ]
        },
        attributes: ['id', 'name', 'address', 'city', 'coordinates'],
        limit,
        order: [['name', 'ASC']]
      });

      res.json({
        suggestions: venues
      });
    } catch (error) {
      console.error('Venue suggestions error:', error);
      res.status(500).json({
        error: 'Failed to fetch suggestions',
        message: error.message
      });
    }
  }
);

// POST /api/v1/venues - Create venue
router.post('/',
  authenticate,
  [
    body('name')
      .notEmpty()
      .isString()
      .withMessage('Name is required'),
    body('address')
      .notEmpty()
      .isString()
      .withMessage('Address is required'),
    body('city')
      .optional()
      .isString(),
    body('country')
      .optional()
      .isString(),
    body('coordinates')
      .notEmpty()
      .custom((value) => {
        if (!value.latitude || !value.longitude) {
          throw new Error('Coordinates must have latitude and longitude');
        }
        return true;
      }),
    body('venueType')
      .optional()
      .isIn(['bar', 'restaurant', 'wine_shop', 'wine_bar', 'winery', 'tasting_room', 'other']),
    body('phone')
      .optional()
      .isString(),
    body('email')
      .optional()
      .isEmail(),
    body('website')
      .optional()
      .isURL()
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

      const {
        name,
        address,
        city,
        country,
        coordinates,
        venueType = 'bar',
        phone,
        email,
        website,
        instagram,
        description
      } = req.body;

      // Check if venue with similar name already exists in same city
      const existingVenue = await Venue.findOne({
        where: {
          name: { [Op.iLike]: name },
          city: { [Op.iLike]: city || '' }
        }
      });

      if (existingVenue) {
        return res.status(409).json({
          error: 'Venue already exists',
          message: 'A venue with this name already exists in this city'
        });
      }

      const slug = generateSlug(name);

      // Create venue with PostGIS point
      const venue = await Venue.create({
        name,
        slug,
        address,
        city,
        country,
        venueType,
        phone,
        email,
        website,
        instagram,
        description,
        coordinates: sequelize.fn('ST_GeomFromText', `POINT(${coordinates.longitude} ${coordinates.latitude})`, 4326)
      });

      // Increment user contribution count
      await req.user.increment('totalContributions');

      res.status(201).json({
        message: 'Venue created successfully',
        venue
      });
    } catch (error) {
      console.error('Create venue error:', error);
      res.status(500).json({
        error: 'Failed to create venue',
        message: error.message
      });
    }
  }
);

// POST /api/v1/venues/verify - Verify venue exists (community verification)
router.post('/verify',
  authenticate,
  [
    body('venueId')
      .notEmpty()
      .isUUID()
      .withMessage('Valid venue ID required')
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

      const { venueId } = req.body;

      const venue = await Venue.findByPk(venueId);

      if (!venue) {
        return res.status(404).json({
          error: 'Venue not found'
        });
      }

      // Increment community verifications
      await venue.increment('communityVerifications');

      // Optionally auto-verify if enough community verifications
      if (venue.communityVerifications >= 3 && !venue.isVerified) {
        await venue.update({
          isVerified: true,
          verifiedByUserId: req.user.id,
          verifiedAt: new Date()
        });
      }

      // Increment user contribution count
      await req.user.increment('totalContributions');

      res.json({
        message: 'Venue verified successfully',
        venue
      });
    } catch (error) {
      console.error('Verify venue error:', error);
      res.status(500).json({
        error: 'Failed to verify venue',
        message: error.message
      });
    }
  }
);

// GET /api/v1/venues/:id - Get venue details
router.get('/:id',
  optionalAuth,
  async (req, res) => {
    try {
      const venue = await Venue.findByPk(req.params.id, {
        attributes: {
          exclude: ['deletedAt']
        }
      });

      if (!venue) {
        return res.status(404).json({
          error: 'Venue not found'
        });
      }

      res.json({ venue });
    } catch (error) {
      console.error('Get venue error:', error);
      res.status(500).json({
        error: 'Failed to fetch venue',
        message: error.message
      });
    }
  }
);

// PATCH /api/v1/venues/:id - Update venue
router.patch('/:id',
  authenticate,
  async (req, res) => {
    try {
      const venue = await Venue.findByPk(req.params.id);

      if (!venue) {
        return res.status(404).json({
          error: 'Venue not found'
        });
      }

      // Only venue owner or high-level users can edit
      const canEdit = venue.ownerUserId === req.user.id ||
                      ['advocate', 'steward'].includes(req.user.userLevel);

      if (!canEdit) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Only the venue owner or moderators can edit'
        });
      }

      const allowedFields = [
        'name', 'address', 'city', 'country', 'zipCode',
        'description', 'website', 'phone', 'email', 'instagram',
        'venueType'
      ];

      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      await venue.update(updates);

      res.json({
        message: 'Venue updated successfully',
        venue
      });
    } catch (error) {
      console.error('Update venue error:', error);
      res.status(500).json({
        error: 'Failed to update venue',
        message: error.message
      });
    }
  }
);

module.exports = router;
