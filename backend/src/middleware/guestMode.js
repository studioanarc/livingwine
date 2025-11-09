const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware that allows both authenticated and guest users
 * Attaches user to request if authenticated, otherwise treats as guest
 *
 * For authenticated users: req.user and req.userId will be set
 * For guest users: req.isGuest will be true and req.guestToken will contain the token
 */
const guestMode = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - treat as guest
      req.isGuest = true;
      req.guestToken = null;
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Try to verify as a regular JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findByPk(decoded.userId);

      if (!user || user.deletedAt) {
        // Token is valid but user doesn't exist or is deleted
        req.isGuest = true;
        req.guestToken = null;
        req.user = null;
        req.userId = null;
        return next();
      }

      // Valid authenticated user
      req.isGuest = false;
      req.user = user;
      req.userId = user.id;
      req.guestToken = null;
      return next();
    } catch (tokenError) {
      // Check if this is a guest token (indicated by 'guest' claim)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          ignoreExpiration: false
        });

        if (decoded.isGuest === true) {
          req.isGuest = true;
          req.guestToken = token;
          req.user = null;
          req.userId = null;
          return next();
        }
      } catch (guestTokenError) {
        // Invalid token - treat as guest
      }

      // Token is invalid - treat as guest
      req.isGuest = true;
      req.guestToken = null;
      req.user = null;
      req.userId = null;
      return next();
    }
  } catch (error) {
    console.error('Guest mode middleware error:', error);
    // Continue as guest on error
    req.isGuest = true;
    req.guestToken = null;
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Middleware that requires authentication but allows guest users to have limited access
 * Same as guestMode but will be used in routes that explicitly support both
 */
const requireAuthOrGuest = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.isGuest = true;
      req.guestToken = null;
      req.user = null;
      req.userId = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (user && !user.deletedAt) {
        req.isGuest = false;
        req.user = user;
        req.userId = user.id;
        req.guestToken = null;
      } else {
        req.isGuest = true;
        req.guestToken = null;
        req.user = null;
        req.userId = null;
      }
    } catch (error) {
      req.isGuest = true;
      req.guestToken = null;
      req.user = null;
      req.userId = null;
    }

    next();
  } catch (error) {
    console.error('Auth or guest middleware error:', error);
    req.isGuest = true;
    req.guestToken = null;
    req.user = null;
    req.userId = null;
    next();
  }
};

module.exports = {
  guestMode,
  requireAuthOrGuest
};
