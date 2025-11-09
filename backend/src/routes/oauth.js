const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Helper function to create or login user
const createOrLoginUser = async (profile) => {
  try {
    // Look for existing user by email or OAuth ID
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email: profile.email },
          { username: profile.username }
        ]
      }
    });

    if (user) {
      // Update last login
      user.lastLoginAt = new Date();
      if (profile.avatarUrl && !user.avatarUrl) {
        user.avatarUrl = profile.avatarUrl;
      }
      if (profile.fullName && !user.fullName) {
        user.fullName = profile.fullName;
      }
      await user.save();
      return user;
    }

    // Create new user
    user = await User.create({
      username: profile.username,
      email: profile.email,
      fullName: profile.fullName || '',
      avatarUrl: profile.avatarUrl || null,
      passwordHash: await User.hashPassword(Math.random().toString(36).slice(-20)), // Random password for OAuth users
      emailVerified: true, // OAuth emails are verified
      lastLoginAt: new Date()
    });

    return user;
  } catch (error) {
    console.error('Error creating or logging in user:', error);
    throw error;
  }
};

// POST /api/v1/oauth/google - Google OAuth callback
router.post('/google',
  [
    body('idToken')
      .notEmpty()
      .withMessage('ID token required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('name')
      .optional()
      .isString()
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

      const { idToken, email, name, picture } = req.body;

      // In production, verify the idToken with Google's API
      // For now, we'll trust the frontend validation
      // Reference: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

      // Generate a safe username from email
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

      const profile = {
        email,
        username,
        fullName: name || '',
        avatarUrl: picture || null
      };

      const user = await createOrLoginUser(profile);
      const token = generateToken(user.id);

      res.json({
        message: 'Google login successful',
        user: user.toJSON(),
        token,
        provider: 'google'
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({
        error: 'Google login failed',
        message: error.message
      });
    }
  }
);

// POST /api/v1/oauth/apple - Apple OAuth callback
router.post('/apple',
  [
    body('identityToken')
      .notEmpty()
      .withMessage('Identity token required'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('givenName')
      .optional()
      .isString(),
    body('familyName')
      .optional()
      .isString()
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

      const { identityToken, email, givenName, familyName } = req.body;

      // In production, verify the identityToken with Apple's API
      // Reference: https://developer.apple.com/documentation/sign_in_with_apple/verifying_a_user

      // Generate a safe username from email
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

      const fullName = [givenName, familyName].filter(Boolean).join(' ');

      const profile = {
        email,
        username,
        fullName: fullName || '',
        avatarUrl: null // Apple doesn't provide profile picture
      };

      const user = await createOrLoginUser(profile);
      const token = generateToken(user.id);

      res.json({
        message: 'Apple login successful',
        user: user.toJSON(),
        token,
        provider: 'apple'
      });
    } catch (error) {
      console.error('Apple OAuth error:', error);
      res.status(500).json({
        error: 'Apple login failed',
        message: error.message
      });
    }
  }
);

module.exports = router;
