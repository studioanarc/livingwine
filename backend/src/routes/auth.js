const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// POST /api/v1/auth/register
router.post('/register',
  [
    body('username')
      .isLength({ min: 3, max: 50 })
      .isAlphanumeric()
      .withMessage('Username must be 3-50 alphanumeric characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('fullName')
      .optional()
      .isLength({ max: 100 })
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const { username, email, password, fullName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          message: existingUser.username === username
            ? 'Username already taken'
            : 'Email already registered'
        });
      }

      // Hash password and create user
      const passwordHash = await User.hashPassword(password);

      const user = await User.create({
        username,
        email,
        passwordHash,
        fullName
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }
);

// POST /api/v1/auth/login
router.post('/login',
  [
    body('login')
      .notEmpty()
      .withMessage('Username or email required'),
    body('password')
      .notEmpty()
      .withMessage('Password required')
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

      const { login, password } = req.body;

      // Find user by username or email
      const user = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { username: login },
            { email: login }
          ]
        }
      });

      if (!user) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid credentials'
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: error.message
      });
    }
  }
);

module.exports = router;
