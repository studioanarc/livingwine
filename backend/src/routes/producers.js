const express = require('express');
const { body, validationResult } = require('express-validator');
const { Producer, Wine, User } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/v1/producers - List and search producers
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      country,
      region,
      isClaimed,
      limit = 20,
      offset = 0
    } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { region: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (country) {
      where.country = country;
    }

    if (region) {
      where.region = { [Op.iLike]: `%${region}%` };
    }

    if (isClaimed !== undefined) {
      where.isClaimed = isClaimed === 'true';
    }

    const producers = await Producer.findAndCountAll({
      where,
      attributes: {
        exclude: ['deletedAt']
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['totalCheckins', 'DESC']]
    });

    res.json({
      producers: producers.rows,
      total: producers.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Search producers error:', error);
    res.status(500).json({
      error: 'Failed to search producers',
      message: error.message
    });
  }
});

// GET /api/v1/producers/:slug - Get producer details
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const producer = await Producer.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Wine,
          as: 'wines',
          limit: 10,
          order: [['averageRating', 'DESC']]
        }
      ]
    });

    if (!producer) {
      return res.status(404).json({ error: 'Producer not found' });
    }

    res.json({ producer });
  } catch (error) {
    console.error('Get producer error:', error);
    res.status(500).json({
      error: 'Failed to fetch producer',
      message: error.message
    });
  }
});

// POST /api/v1/producers - Create new producer
router.post('/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('region').optional().isString()
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

      // Generate slug
      const slug = req.body.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const producer = await Producer.create({
        ...req.body,
        slug
      });

      // Increment user contribution count
      await req.user.increment('totalContributions');

      res.status(201).json({
        message: 'Producer created successfully',
        producer
      });
    } catch (error) {
      console.error('Create producer error:', error);
      res.status(500).json({
        error: 'Failed to create producer',
        message: error.message
      });
    }
  }
);

// POST /api/v1/producers/:slug/claim - Claim producer profile
router.post('/:slug/claim', authenticate, async (req, res) => {
  try {
    const producer = await Producer.findOne({ where: { slug: req.params.slug } });

    if (!producer) {
      return res.status(404).json({ error: 'Producer not found' });
    }

    if (producer.isClaimed) {
      return res.status(409).json({
        error: 'Producer already claimed',
        message: 'This producer profile has already been claimed'
      });
    }

    // In a real app, you'd verify ownership via email/documentation
    // For now, we'll just claim it
    await producer.update({
      isClaimed: true,
      claimedByUserId: req.user.id,
      claimedAt: new Date()
    });

    res.json({
      message: 'Producer claimed successfully',
      producer
    });
  } catch (error) {
    console.error('Claim producer error:', error);
    res.status(500).json({
      error: 'Failed to claim producer',
      message: error.message
    });
  }
});

// PATCH /api/v1/producers/:slug - Update producer
router.patch('/:slug', authenticate, async (req, res) => {
  try {
    const producer = await Producer.findOne({ where: { slug: req.params.slug } });

    if (!producer) {
      return res.status(404).json({ error: 'Producer not found' });
    }

    // Only claimed producer or high-level users can edit
    const canEdit = producer.claimedByUserId === req.user.id ||
                    ['advocate', 'steward'].includes(req.user.userLevel);

    if (!canEdit) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Only the producer owner or moderators can edit'
      });
    }

    const allowedFields = [
      'description', 'philosophy', 'yearFounded', 'winemakerName',
      'website', 'email', 'phone', 'instagram',
      'certifications', 'logoUrl', 'coverPhotoUrl'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await producer.update(updates);

    res.json({
      message: 'Producer updated successfully',
      producer
    });
  } catch (error) {
    console.error('Update producer error:', error);
    res.status(500).json({
      error: 'Failed to update producer',
      message: error.message
    });
  }
});

module.exports = router;
