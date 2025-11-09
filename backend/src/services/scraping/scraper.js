const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

/**
 * Base Scraper Class
 * Provides common functionality for web scraping including:
 * - Browser management (Puppeteer)
 * - HTTP requests (Axios + Cheerio)
 * - Rate limiting
 * - Retry logic
 * - Error handling
 */
class BaseScraper {
  constructor(options = {}) {
    this.options = {
      rateLimit: options.rateLimit || 1000, // ms between requests
      maxRetries: options.maxRetries || 3,
      timeout: options.timeout || 30000,
      userAgent: options.userAgent ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      headless: options.headless !== undefined ? options.headless : true,
      ...options
    };

    this.browser = null;
    this.lastRequestTime = 0;
  }

  /**
   * Initialize Puppeteer browser
   */
  async initBrowser() {
    if (this.browser) {
      return this.browser;
    }

    try {
      this.browser = await puppeteer.launch({
        headless: this.options.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });

      return this.browser;
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw new Error(`Browser initialization failed: ${error.message}`);
    }
  }

  /**
   * Close Puppeteer browser
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Enforce rate limiting
   */
  async applyRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.options.rateLimit) {
      const waitTime = this.options.rateLimit - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry logic wrapper
   */
  async withRetry(fn, context = 'operation') {
    let lastError;

    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${this.options.maxRetries} failed for ${context}:`, error.message);

        if (attempt < this.options.maxRetries) {
          // Exponential backoff
          const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await this.sleep(backoffTime);
        }
      }
    }

    throw new Error(`Failed after ${this.options.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Fetch page with Puppeteer
   */
  async fetchWithPuppeteer(url, options = {}) {
    await this.applyRateLimit();

    return this.withRetry(async () => {
      const browser = await this.initBrowser();
      const page = await browser.newPage();

      try {
        // Set user agent
        await page.setUserAgent(this.options.userAgent);

        // Set viewport
        await page.setViewport({
          width: 1920,
          height: 1080
        });

        // Navigate to page
        await page.goto(url, {
          waitUntil: options.waitUntil || 'networkidle2',
          timeout: this.options.timeout
        });

        // Wait for custom selector if provided
        if (options.waitForSelector) {
          await page.waitForSelector(options.waitForSelector, {
            timeout: this.options.timeout
          });
        }

        // Execute custom actions if provided
        if (options.actions && typeof options.actions === 'function') {
          await options.actions(page);
        }

        // Get page content
        const html = await page.content();
        await page.close();

        return html;
      } catch (error) {
        await page.close();
        throw error;
      }
    }, `Puppeteer fetch: ${url}`);
  }

  /**
   * Fetch page with Axios + Cheerio (lighter weight)
   */
  async fetchWithAxios(url, options = {}) {
    await this.applyRateLimit();

    return this.withRetry(async () => {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.options.userAgent,
          ...options.headers
        },
        timeout: this.options.timeout,
        ...options
      });

      return response.data;
    }, `Axios fetch: ${url}`);
  }

  /**
   * Parse HTML with Cheerio
   */
  parseHTML(html) {
    return cheerio.load(html);
  }

  /**
   * Extract text safely
   */
  extractText($element) {
    if (!$element || !$element.length) {
      return null;
    }
    return $element.text().trim() || null;
  }

  /**
   * Extract attribute safely
   */
  extractAttr($element, attr) {
    if (!$element || !$element.length) {
      return null;
    }
    return $element.attr(attr) || null;
  }

  /**
   * Clean and normalize text
   */
  cleanText(text) {
    if (!text) return null;

    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim() || null;
  }

  /**
   * Validate URL
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Extract domain from URL
   */
  getDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (_) {
      return null;
    }
  }

  /**
   * Log scraping activity
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      scraper: this.constructor.name,
      message,
      ...data
    };

    console.log(JSON.stringify(logEntry));
  }

  /**
   * Handle errors gracefully
   */
  handleError(error, context = '') {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      context
    };

    this.log('error', 'Scraping error occurred', errorDetails);

    return {
      success: false,
      error: error.message,
      context
    };
  }

  /**
   * Generic scrape method to be overridden by child classes
   */
  async scrape() {
    throw new Error('scrape() method must be implemented by child class');
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    await this.closeBrowser();
  }
}

module.exports = BaseScraper;
