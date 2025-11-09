const express = require('express');
const { body, validationResult } = require('express-validator');
const { Wine, Producer, CheckIn, User } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/v1/wines - Search and list wines
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      wineType,
      region,
      producer,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const where = {};

    // Search by name or grape varietals
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { grapeVarietals: { [Op.contains]: [search.toLowerCase()] } }
      ];
    }

    if (wineType) {
      where.wineType = wineType;
    }

    if (region) {
      where.region = { [Op.iLike]: `%${region}%` };
    }

    const wines = await Wine.findAndCountAll({
      where,
      include: [
        {
          model: Producer,
          as: 'producer',
          ...(producer && { where: { name: { [Op.iLike]: `%${producer}%` } } })
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    res.json({
      wines: wines.rows,
      total: wines.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Search wines error:', error);
    res.status(500).json({
      error: 'Failed to search wines',
      message: error.message
    });
  }
});

// GET /api/v1/wines/:slug - Get wine details
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const wine = await Wine.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: Producer, as: 'producer' },
        { model: User, as: 'createdBy', attributes: ['id', 'username'] }
      ]
    });

    if (!wine) {
      return res.status(404).json({ error: 'Wine not found' });
    }

    res.json({ wine });
  } catch (error) {
    console.error('Get wine error:', error);
    res.status(500).json({
      error: 'Failed to fetch wine',
      message: error.message
    });
  }
});

// POST /api/v1/wines - Create new wine
router.post('/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('producerId').isUUID().withMessage('Valid producer ID required'),
    body('wineType').isIn(['red', 'white', 'rose', 'orange', 'sparkling', 'pet-nat'])
      .withMessage('Invalid wine type'),
    body('vintage').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 })
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

      // Check if producer exists
      const producer = await Producer.findByPk(req.body.producerId);
      if (!producer) {
        return res.status(404).json({ error: 'Producer not found' });
      }

      // Generate slug
      const slug = `${producer.slug}-${req.body.name.toLowerCase().replace(/\s+/g, '-')}-${req.body.vintage || 'nv'}`;

      const wine = await Wine.create({
        ...req.body,
        slug,
        createdByUserId: req.user.id
      });

      // Update producer wine count
      await producer.increment('totalWines');

      // Increment user contribution count
      await req.user.increment('totalContributions');

      const createdWine = await Wine.findByPk(wine.id, {
        include: [{ model: Producer, as: 'producer' }]
      });

      res.status(201).json({
        message: 'Wine created successfully',
        wine: createdWine
      });
    } catch (error) {
      console.error('Create wine error:', error);
      res.status(500).json({
        error: 'Failed to create wine',
        message: error.message
      });
    }
  }
);

// PATCH /api/v1/wines/:slug - Update wine details
router.patch('/:slug', authenticate, async (req, res) => {
  try {
    const wine = await Wine.findOne({ where: { slug: req.params.slug } });

    if (!wine) {
      return res.status(404).json({ error: 'Wine not found' });
    }

    // Only allow update if user created it or is high-level
    const canEdit = wine.createdByUserId === req.user.id ||
                    ['advocate', 'steward'].includes(req.user.userLevel);

    if (!canEdit) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You can only edit wines you created'
      });
    }

    const allowedFields = [
      'name', 'vintage', 'wineType', 'grapeVarietals', 'region', 'appellation',
      'alcoholPercentage', 'productionVolume', 'vineyardDetails', 'cellarDetails',
      'distributionDetails', 'labelImageUrl', 'bottleImageUrl'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.lastUpdatedByUserId = req.user.id;

    await wine.update(updates);

    res.json({
      message: 'Wine updated successfully',
      wine
    });
  } catch (error) {
    console.error('Update wine error:', error);
    res.status(500).json({
      error: 'Failed to update wine',
      message: error.message
    });
  }
});

// GET /api/v1/wines/:slug/checkins - Get check-ins for a wine
router.get('/:slug/checkins', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const wine = await Wine.findOne({ where: { slug: req.params.slug } });
    if (!wine) {
      return res.status(404).json({ error: 'Wine not found' });
    }

    const checkins = await CheckIn.findAndCountAll({
      where: {
        wineId: wine.id,
        isPublic: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      checkins: checkins.rows,
      total: checkins.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get wine checkins error:', error);
    res.status(500).json({
      error: 'Failed to fetch check-ins',
      message: error.message
    });
  }
});

module.exports = router;
