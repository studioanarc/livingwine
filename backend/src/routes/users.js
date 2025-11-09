const express = require('express');
const { User, CheckIn, Wine } = require('../models');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/v1/users/:username - Get user profile
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check privacy settings
    if (user.isPrivate && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({
        error: 'Profile is private'
      });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// GET /api/v1/users/:username/checkins - Get user's check-ins
router.get('/:username/checkins', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const user = await User.findOne({
      where: { username: req.params.username }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check privacy
    if (user.isPrivate && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({ error: 'Profile is private' });
    }

    const checkins = await CheckIn.findAndCountAll({
      where: {
        userId: user.id,
        isPublic: req.user?.id === user.id ? undefined : true
      },
      include: [
        {
          model: Wine,
          as: 'wine',
          include: ['producer']
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

// PATCH /api/v1/users/me - Update own profile
router.patch('/me', authenticate, async (req, res) => {
  try {
    const allowedFields = ['fullName', 'bio', 'location', 'avatarUrl', 'isPrivate'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await req.user.update(updates);

    res.json({
      message: 'Profile updated successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// GET /api/v1/users/me - Get own profile
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

module.exports = router;
