const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findByPk(decoded.userId);

    if (!user || user.deletedAt) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication check failed'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (user && !user.deletedAt) {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};

const requireLevel = (minLevel) => {
  const levels = ['explorer', 'enthusiast', 'advocate', 'steward'];
  const minLevelIndex = levels.indexOf(minLevel);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const userLevelIndex = levels.indexOf(req.user.userLevel);

    if (userLevelIndex < minLevelIndex) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Requires ${minLevel} level or higher`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireLevel
};
