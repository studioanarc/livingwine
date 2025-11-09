const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { authenticate, requireLevel } = require('../middleware/auth');
const scrapingQueue = require('../services/scraping/queue');

const router = express.Router();

// All admin routes require steward-level authentication
router.use(authenticate);
router.use(requireLevel('steward'));

/**
 * POST /api/v1/admin/scrape/venues
 * Trigger venue scraping job
 */
router.post('/scrape/venues',
  [
    body('location')
      .optional()
      .isString()
      .withMessage('Location must be a string'),
    body('sources')
      .optional()
      .isArray()
      .withMessage('Sources must be an array'),
    body('sources.*')
      .optional()
      .isIn(['google', 'raw_wine', 'community'])
      .withMessage('Invalid source type')
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

      const { location, sources, options } = req.body;

      // Add job to queue
      const job = await scrapingQueue.scrapeVenues(
        location || 'New York, NY',
        sources,
        options || {}
      );

      res.status(202).json({
        message: 'Venue scraping job queued successfully',
        job: {
          id: job.jobId,
          queue: job.queue,
          status: job.status,
          location: location || 'New York, NY',
          sources: sources || ['google', 'raw_wine', 'community']
        },
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Venue scraping error:', error);
      res.status(500).json({
        error: 'Failed to queue venue scraping job',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/v1/admin/scrape/events
 * Trigger event scraping job
 */
router.post('/scrape/events',
  [
    body('sources')
      .optional()
      .isArray()
      .withMessage('Sources must be an array'),
    body('sources.*')
      .optional()
      .isIn(['raw_wine', 'eventbrite', 'wine_fairs'])
      .withMessage('Invalid source type')
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

      const { sources, options } = req.body;

      // Add job to queue
      const job = await scrapingQueue.scrapeEvents(
        sources,
        options || {}
      );

      res.status(202).json({
        message: 'Event scraping job queued successfully',
        job: {
          id: job.jobId,
          queue: job.queue,
          status: job.status,
          sources: sources || ['raw_wine', 'eventbrite', 'wine_fairs']
        },
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Event scraping error:', error);
      res.status(500).json({
        error: 'Failed to queue event scraping job',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/v1/admin/scrape/producer
 * Trigger producer scraping job
 */
router.post('/scrape/producer',
  [
    body('url')
      .optional()
      .isURL()
      .withMessage('Valid URL required'),
    body('urls')
      .optional()
      .isArray()
      .withMessage('URLs must be an array'),
    body('urls.*')
      .optional()
      .isURL()
      .withMessage('Each URL must be valid')
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

      const { url, urls, options } = req.body;

      // Ensure at least one URL is provided
      if (!url && (!urls || urls.length === 0)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Either url or urls array must be provided'
        });
      }

      let job;

      if (urls && urls.length > 0) {
        // Batch scraping
        job = await scrapingQueue.scrapeProducers(urls, options || {});
      } else {
        // Single producer scraping
        job = await scrapingQueue.scrapeProducer(url, options || {});
      }

      res.status(202).json({
        message: 'Producer scraping job queued successfully',
        job: {
          id: job.jobId,
          queue: job.queue,
          status: job.status,
          url,
          count: job.count
        },
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Producer scraping error:', error);
      res.status(500).json({
        error: 'Failed to queue producer scraping job',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/v1/admin/scrape/jobs/:queue/:jobId
 * Get job status
 */
router.get('/scrape/jobs/:queue/:jobId',
  async (req, res) => {
    try {
      const { queue, jobId } = req.params;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const jobStatus = await scrapingQueue.getJobStatus(queue, jobId);

      if (!jobStatus) {
        return res.status(404).json({
          error: 'Job not found',
          message: `Job ${jobId} not found in ${queue} queue`
        });
      }

      res.json({
        job: jobStatus
      });
    } catch (error) {
      console.error('Get job status error:', error);
      res.status(500).json({
        error: 'Failed to get job status',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/v1/admin/scrape/queues/:queue/stats
 * Get queue statistics
 */
router.get('/scrape/queues/:queue/stats',
  async (req, res) => {
    try {
      const { queue } = req.params;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const stats = await scrapingQueue.getQueueStats(queue);

      res.json({
        stats
      });
    } catch (error) {
      console.error('Get queue stats error:', error);
      res.status(500).json({
        error: 'Failed to get queue statistics',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/v1/admin/scrape/queues/stats
 * Get all queue statistics
 */
router.get('/scrape/queues/stats',
  async (req, res) => {
    try {
      const stats = await scrapingQueue.getAllQueueStats();

      res.json({
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get all queue stats error:', error);
      res.status(500).json({
        error: 'Failed to get queue statistics',
        message: error.message
      });
    }
  }
);

/**
 * GET /api/v1/admin/scrape/queues/:queue/jobs
 * Get recent jobs from queue
 */
router.get('/scrape/queues/:queue/jobs',
  [
    query('status')
      .optional()
      .isIn(['completed', 'failed', 'active', 'waiting'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
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

      const { queue } = req.params;
      const status = req.query.status || 'completed';
      const limit = parseInt(req.query.limit) || 10;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const jobs = await scrapingQueue.getRecentJobs(queue, status, limit);

      res.json({
        queue,
        status,
        count: jobs.length,
        jobs
      });
    } catch (error) {
      console.error('Get recent jobs error:', error);
      res.status(500).json({
        error: 'Failed to get recent jobs',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/v1/admin/scrape/queues/:queue/pause
 * Pause a queue
 */
router.post('/scrape/queues/:queue/pause',
  async (req, res) => {
    try {
      const { queue } = req.params;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const result = await scrapingQueue.pauseQueue(queue);

      res.json({
        message: `Queue ${queue} paused successfully`,
        result,
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Pause queue error:', error);
      res.status(500).json({
        error: 'Failed to pause queue',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/v1/admin/scrape/queues/:queue/resume
 * Resume a queue
 */
router.post('/scrape/queues/:queue/resume',
  async (req, res) => {
    try {
      const { queue } = req.params;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const result = await scrapingQueue.resumeQueue(queue);

      res.json({
        message: `Queue ${queue} resumed successfully`,
        result,
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Resume queue error:', error);
      res.status(500).json({
        error: 'Failed to resume queue',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/v1/admin/scrape/queues/:queue
 * Clear a queue
 */
router.delete('/scrape/queues/:queue',
  async (req, res) => {
    try {
      const { queue } = req.params;

      // Validate queue name
      if (!['venues', 'events', 'producers'].includes(queue)) {
        return res.status(400).json({
          error: 'Invalid queue name',
          message: 'Queue must be one of: venues, events, producers'
        });
      }

      const result = await scrapingQueue.clearQueue(queue);

      res.json({
        message: `Queue ${queue} cleared successfully`,
        result,
        initiatedBy: {
          userId: req.user.id,
          username: req.user.username
        }
      });
    } catch (error) {
      console.error('Clear queue error:', error);
      res.status(500).json({
        error: 'Failed to clear queue',
        message: error.message
      });
    }
  }
);

module.exports = router;
