require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { sequelize, testConnection } = require('./config/database');
const scrapingQueue = require('./services/scraping/queue');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const wineRoutes = require('./routes/wines');
const producerRoutes = require('./routes/producers');
const checkinRoutes = require('./routes/checkins');
const venueRoutes = require('./routes/venues');
const oauthRoutes = require('./routes/oauth');
const mapRoutes = require('./routes/map');
const ocrRoutes = require('./routes/ocr');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`/api/${API_VERSION}`, limiter);

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/wines`, wineRoutes);
app.use(`/api/${API_VERSION}/producers`, producerRoutes);
app.use(`/api/${API_VERSION}/checkins`, checkinRoutes);
app.use(`/api/${API_VERSION}/venues`, venueRoutes);
app.use(`/api/${API_VERSION}/oauth`, oauthRoutes);
app.use(`/api/${API_VERSION}/map`, mapRoutes);
app.use(`/api/${API_VERSION}/ocr`, ocrRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);

// API documentation endpoint
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.json({
    name: 'Tipsy API',
    version: API_VERSION,
    description: 'Natural Wine Tracking & Discovery Platform',
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      wines: `/api/${API_VERSION}/wines`,
      producers: `/api/${API_VERSION}/producers`,
      checkins: `/api/${API_VERSION}/checkins`,
      venues: `/api/${API_VERSION}/venues`,
      oauth: `/api/${API_VERSION}/oauth`,
      map: `/api/${API_VERSION}/map`,
      ocr: `/api/${API_VERSION}/ocr`,
      admin: `/api/${API_VERSION}/admin`
    },
    documentation: 'https://github.com/yourusername/tipsy/wiki/API-Documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER INITIALIZATION
// ============================================

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Syncing database models...');
      await sequelize.sync({ alter: false }); // Don't auto-alter in production
      console.log('✓ Database models synced');
    }

    // Initialize scraping queue (only if Redis is configured)
    if (process.env.REDIS_HOST || process.env.ENABLE_SCRAPING_QUEUE === 'true') {
      try {
        await scrapingQueue.initialize();
        console.log('✓ Scraping queue initialized');
      } catch (error) {
        console.warn('⚠ Scraping queue initialization failed:', error.message);
        console.warn('  Scraping features will be unavailable');
      }
    } else {
      console.log('ℹ Scraping queue disabled (Redis not configured)');
    }

    // Start server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🍷 Tipsy API Server`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Port: ${PORT}`);
      console.log(`API Version: ${API_VERSION}`);
      console.log(`URL: http://localhost:${PORT}/api/${API_VERSION}`);
      console.log(`Health: http://localhost:${PORT}/health`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await scrapingQueue.shutdown();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  await scrapingQueue.shutdown();
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
