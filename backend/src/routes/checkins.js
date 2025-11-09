const express = require('express');
const { body, validationResult } = require('express-validator');
const { CheckIn, Wine, Producer, User } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/checkins - Get activity feed (public check-ins)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const checkins = await CheckIn.findAndCountAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl', 'userLevel']
        },
        {
          model: Wine,
          as: 'wine',
          include: [
            {
              model: Producer,
              as: 'producer',
              attributes: ['id', 'name', 'slug', 'region', 'country']
            }
          ]
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
    console.error('Get checkins error:', error);
    res.status(500).json({
      error: 'Failed to fetch check-ins',
      message: error.message
    });
  }
});

// GET /api/v1/checkins/:id - Get single check-in
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const checkin = await CheckIn.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatarUrl', 'userLevel']
        },
        {
          model: Wine,
          as: 'wine',
          include: [{ model: Producer, as: 'producer' }]
        }
      ]
    });

    if (!checkin) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    // Check privacy
    if (!checkin.isPublic && (!req.user || req.user.id !== checkin.userId)) {
      return res.status(403).json({
        error: 'This check-in is private'
      });
    }

    res.json({ checkin });
  } catch (error) {
    console.error('Get checkin error:', error);
    res.status(500).json({
      error: 'Failed to fetch check-in',
      message: error.message
    });
  }
});

// POST /api/v1/checkins - Create new check-in
router.post('/',
  authenticate,
  [
    body('wineId').isUUID().withMessage('Valid wine ID required'),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be 0-5'),
    body('tastingNotes').optional().isString(),
    body('isPublic').optional().isBoolean()
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

      // Check if wine exists
      const wine = await Wine.findByPk(req.body.wineId);
      if (!wine) {
        return res.status(404).json({ error: 'Wine not found' });
      }

      // Create check-in
      const checkin = await CheckIn.create({
        ...req.body,
        userId: req.user.id
      });

      // Update stats
      await wine.increment('totalCheckins');
      await req.user.increment('totalCheckins');

      // Update wine average rating if rating provided
      if (req.body.rating) {
        const { sequelize } = require('../config/database');
        const [results] = await sequelize.query(`
          UPDATE wines
          SET average_rating = (
            SELECT AVG(rating)
            FROM checkins
            WHERE wine_id = :wineId AND rating IS NOT NULL
          )
          WHERE id = :wineId
        `, {
          replacements: { wineId: wine.id }
        });
      }

      // Fetch complete check-in with associations
      const completeCheckin = await CheckIn.findByPk(checkin.id, {
        include: [
          {
            model: Wine,
            as: 'wine',
            include: [{ model: Producer, as: 'producer' }]
          }
        ]
      });

      res.status(201).json({
        message: 'Check-in created successfully',
        checkin: completeCheckin
      });
    } catch (error) {
      console.error('Create checkin error:', error);
      res.status(500).json({
        error: 'Failed to create check-in',
        message: error.message
      });
    }
  }
);

// PATCH /api/v1/checkins/:id - Update check-in
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const checkin = await CheckIn.findByPk(req.params.id);

    if (!checkin) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    // Only owner can edit
    if (checkin.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You can only edit your own check-ins'
      });
    }

    const allowedFields = [
      'rating', 'tastingNotes', 'flavorProfile', 'mouthfeel',
      'contextTags', 'foodPairings', 'wherePurchased', 'pricePaid',
      'servingTemperature', 'photoUrls', 'isPublic', 'allowComments'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await checkin.update(updates);

    // Update wine rating if rating changed
    if (req.body.rating !== undefined) {
      const { sequelize } = require('../config/database');
      await sequelize.query(`
        UPDATE wines
        SET average_rating = (
          SELECT AVG(rating)
          FROM checkins
          WHERE wine_id = :wineId AND rating IS NOT NULL
        )
        WHERE id = :wineId
      `, {
        replacements: { wineId: checkin.wineId }
      });
    }

    res.json({
      message: 'Check-in updated successfully',
      checkin
    });
  } catch (error) {
    console.error('Update checkin error:', error);
    res.status(500).json({
      error: 'Failed to update check-in',
      message: error.message
    });
  }
});

// DELETE /api/v1/checkins/:id - Delete check-in
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const checkin = await CheckIn.findByPk(req.params.id);

    if (!checkin) {
      return res.status(404).json({ error: 'Check-in not found' });
    }

    // Only owner can delete
    if (checkin.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You can only delete your own check-ins'
      });
    }

    // Soft delete
    await checkin.destroy();

    // Update stats
    const wine = await Wine.findByPk(checkin.wineId);
    if (wine && wine.totalCheckins > 0) {
      await wine.decrement('totalCheckins');
    }

    if (req.user.totalCheckins > 0) {
      await req.user.decrement('totalCheckins');
    }

    res.json({
      message: 'Check-in deleted successfully'
    });
  } catch (error) {
    console.error('Delete checkin error:', error);
    res.status(500).json({
      error: 'Failed to delete check-in',
      message: error.message
    });
  }
});

module.exports = router;
