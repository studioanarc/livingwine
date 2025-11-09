const Bull = require('bull');
const VenueScraper = require('./venues');
const EventScraper = require('./events');
const ProducerScraper = require('./producers');

/**
 * Scraping Queue Service
 * Manages scraping jobs using Bull queue
 * Handles job scheduling, retries, and monitoring
 */
class ScrapingQueue {
  constructor() {
    // Initialize Bull queues
    this.queues = {
      venues: null,
      events: null,
      producers: null
    };

    // Queue configuration
    this.queueConfig = {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 200 // Keep last 200 failed jobs
      }
    };

    this.initialized = false;
  }

  /**
   * Initialize all queues
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      console.log('Initializing scraping queues...');

      // Create queues
      this.queues.venues = new Bull('venue-scraping', {
        redis: this.queueConfig.redis,
        defaultJobOptions: this.queueConfig.defaultJobOptions
      });

      this.queues.events = new Bull('event-scraping', {
        redis: this.queueConfig.redis,
        defaultJobOptions: this.queueConfig.defaultJobOptions
      });

      this.queues.producers = new Bull('producer-scraping', {
        redis: this.queueConfig.redis,
        defaultJobOptions: this.queueConfig.defaultJobOptions
      });

      // Set up processors
      this.setupProcessors();

      // Set up event listeners
      this.setupEventListeners();

      // Set up recurring jobs (cron-like)
      this.setupRecurringJobs();

      this.initialized = true;
      console.log('Scraping queues initialized successfully');
    } catch (error) {
      console.error('Failed to initialize scraping queues:', error);
      throw error;
    }
  }

  /**
   * Set up job processors
   */
  setupProcessors() {
    // Venue scraping processor
    this.queues.venues.process(async (job) => {
      console.log(`Processing venue scraping job ${job.id}`);

      const { location, sources, options } = job.data;

      const scraper = new VenueScraper({ sources });
      const result = await scraper.scrape(location, options);

      // Update progress
      job.progress(100);

      return result;
    });

    // Event scraping processor
    this.queues.events.process(async (job) => {
      console.log(`Processing event scraping job ${job.id}`);

      const { sources, options } = job.data;

      const scraper = new EventScraper({ sources });
      const result = await scraper.scrape(options);

      job.progress(100);

      return result;
    });

    // Producer scraping processor
    this.queues.producers.process(async (job) => {
      console.log(`Processing producer scraping job ${job.id}`);

      const { url, urls, options } = job.data;

      const scraper = new ProducerScraper();

      let result;
      if (urls && Array.isArray(urls)) {
        result = await scraper.scrapeBatch(urls, options);
      } else if (url) {
        result = await scraper.scrape(url, options);
      } else {
        throw new Error('No URL or URLs provided for producer scraping');
      }

      job.progress(100);

      return result;
    });
  }

  /**
   * Set up event listeners for monitoring
   */
  setupEventListeners() {
    Object.entries(this.queues).forEach(([name, queue]) => {
      // Job completed
      queue.on('completed', (job, result) => {
        console.log(`Job ${job.id} in ${name} queue completed`, {
          jobId: job.id,
          queue: name,
          duration: Date.now() - job.timestamp
        });
      });

      // Job failed
      queue.on('failed', (job, err) => {
        console.error(`Job ${job.id} in ${name} queue failed`, {
          jobId: job.id,
          queue: name,
          error: err.message,
          attempts: job.attemptsMade,
          maxAttempts: job.opts.attempts
        });
      });

      // Job stalled
      queue.on('stalled', (job) => {
        console.warn(`Job ${job.id} in ${name} queue stalled`, {
          jobId: job.id,
          queue: name
        });
      });

      // Queue error
      queue.on('error', (error) => {
        console.error(`Error in ${name} queue`, {
          queue: name,
          error: error.message
        });
      });
    });
  }

  /**
   * Set up recurring jobs (scheduled scraping)
   */
  async setupRecurringJobs() {
    // Scrape venues daily at 2 AM
    await this.queues.venues.add(
      {
        location: 'New York, NY',
        sources: ['google', 'raw_wine', 'community'],
        options: {}
      },
      {
        repeat: {
          cron: '0 2 * * *' // Daily at 2 AM
        },
        jobId: 'recurring-venue-scrape'
      }
    );

    // Scrape events every 6 hours
    await this.queues.events.add(
      {
        sources: ['raw_wine', 'eventbrite', 'wine_fairs'],
        options: {}
      },
      {
        repeat: {
          cron: '0 */6 * * *' // Every 6 hours
        },
        jobId: 'recurring-event-scrape'
      }
    );

    console.log('Recurring scraping jobs scheduled');
  }

  /**
   * Add venue scraping job
   */
  async scrapeVenues(location = 'New York, NY', sources = null, options = {}) {
    await this.ensureInitialized();

    const job = await this.queues.venues.add({
      location,
      sources: sources || ['google', 'raw_wine', 'community'],
      options
    });

    console.log(`Venue scraping job ${job.id} added to queue`);

    return {
      jobId: job.id,
      queue: 'venues',
      status: 'queued'
    };
  }

  /**
   * Add event scraping job
   */
  async scrapeEvents(sources = null, options = {}) {
    await this.ensureInitialized();

    const job = await this.queues.events.add({
      sources: sources || ['raw_wine', 'eventbrite', 'wine_fairs'],
      options
    });

    console.log(`Event scraping job ${job.id} added to queue`);

    return {
      jobId: job.id,
      queue: 'events',
      status: 'queued'
    };
  }

  /**
   * Add producer scraping job
   */
  async scrapeProducer(url, options = {}) {
    await this.ensureInitialized();

    const job = await this.queues.producers.add({
      url,
      options
    });

    console.log(`Producer scraping job ${job.id} added to queue`);

    return {
      jobId: job.id,
      queue: 'producers',
      status: 'queued'
    };
  }

  /**
   * Add batch producer scraping job
   */
  async scrapeProducers(urls, options = {}) {
    await this.ensureInitialized();

    const job = await this.queues.producers.add({
      urls,
      options
    });

    console.log(`Batch producer scraping job ${job.id} added to queue`);

    return {
      jobId: job.id,
      queue: 'producers',
      status: 'queued',
      count: urls.length
    };
  }

  /**
   * Get job status
   */
  async getJobStatus(queueName, jobId) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const job = await queue.getJob(jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress();
    const failedReason = job.failedReason;

    return {
      id: job.id,
      queue: queueName,
      state,
      progress,
      data: job.data,
      result: job.returnvalue,
      failedReason,
      attempts: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn
    };
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused
    ] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.getPausedCount()
    ]);

    return {
      queue: queueName,
      waiting,
      active,
      completed,
      failed,
      delayed,
      paused,
      total: waiting + active + completed + failed + delayed + paused
    };
  }

  /**
   * Get all queue statistics
   */
  async getAllQueueStats() {
    await this.ensureInitialized();

    const stats = {};

    for (const queueName of Object.keys(this.queues)) {
      stats[queueName] = await this.getQueueStats(queueName);
    }

    return stats;
  }

  /**
   * Get recent jobs
   */
  async getRecentJobs(queueName, status = 'completed', limit = 10) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    let jobs;
    switch (status) {
      case 'completed':
        jobs = await queue.getCompleted(0, limit - 1);
        break;
      case 'failed':
        jobs = await queue.getFailed(0, limit - 1);
        break;
      case 'active':
        jobs = await queue.getActive(0, limit - 1);
        break;
      case 'waiting':
        jobs = await queue.getWaiting(0, limit - 1);
        break;
      default:
        throw new Error(`Invalid status: ${status}`);
    }

    return jobs.map(job => ({
      id: job.id,
      queue: queueName,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn
    }));
  }

  /**
   * Pause a queue
   */
  async pauseQueue(queueName) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
    console.log(`Queue ${queueName} paused`);

    return { queue: queueName, status: 'paused' };
  }

  /**
   * Resume a queue
   */
  async resumeQueue(queueName) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
    console.log(`Queue ${queueName} resumed`);

    return { queue: queueName, status: 'resumed' };
  }

  /**
   * Clear a queue
   */
  async clearQueue(queueName) {
    await this.ensureInitialized();

    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.empty();
    console.log(`Queue ${queueName} cleared`);

    return { queue: queueName, status: 'cleared' };
  }

  /**
   * Ensure queue is initialized
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('Shutting down scraping queues...');

    const closePromises = Object.entries(this.queues).map(async ([name, queue]) => {
      if (queue) {
        console.log(`Closing ${name} queue...`);
        await queue.close();
      }
    });

    await Promise.all(closePromises);

    this.initialized = false;
    console.log('Scraping queues shut down successfully');
  }
}

// Export singleton instance
const scrapingQueue = new ScrapingQueue();

module.exports = scrapingQueue;
