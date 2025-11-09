const BaseScraper = require('./scraper');
const axios = require('axios');

/**
 * Event Scraper
 * Scrapes natural wine events from various sources including wine fairs,
 * tastings, and community events
 */
class EventScraper extends BaseScraper {
  constructor(options = {}) {
    super(options);
    this.sources = options.sources || ['raw_wine', 'eventbrite', 'wine_fairs'];
  }

  /**
   * Main scrape method
   */
  async scrape(options = {}) {
    this.log('info', 'Starting event scrape', { sources: this.sources });

    const results = {
      success: true,
      events: [],
      errors: [],
      sources: {}
    };

    try {
      // Scrape from each enabled source
      if (this.sources.includes('raw_wine')) {
        try {
          const rawWineEvents = await this.scrapeRAWWineFairs(options);
          results.events.push(...rawWineEvents);
          results.sources.raw_wine = { count: rawWineEvents.length, success: true };
        } catch (error) {
          this.log('error', 'RAW Wine scraping failed', { error: error.message });
          results.errors.push({ source: 'raw_wine', error: error.message });
          results.sources.raw_wine = { success: false, error: error.message };
        }
      }

      if (this.sources.includes('eventbrite')) {
        try {
          const eventbriteEvents = await this.scrapeEventbrite(options);
          results.events.push(...eventbriteEvents);
          results.sources.eventbrite = { count: eventbriteEvents.length, success: true };
        } catch (error) {
          this.log('error', 'Eventbrite scraping failed', { error: error.message });
          results.errors.push({ source: 'eventbrite', error: error.message });
          results.sources.eventbrite = { success: false, error: error.message };
        }
      }

      if (this.sources.includes('wine_fairs')) {
        try {
          const wineFairEvents = await this.scrapeWineFairs(options);
          results.events.push(...wineFairEvents);
          results.sources.wine_fairs = { count: wineFairEvents.length, success: true };
        } catch (error) {
          this.log('error', 'Wine fairs scraping failed', { error: error.message });
          results.errors.push({ source: 'wine_fairs', error: error.message });
          results.sources.wine_fairs = { success: false, error: error.message };
        }
      }

      // Deduplicate events
      results.events = this.deduplicateEvents(results.events);

      // Filter future events only
      if (options.futureOnly !== false) {
        results.events = this.filterFutureEvents(results.events);
      }

      this.log('info', 'Event scrape completed', {
        totalEvents: results.events.length,
        sources: results.sources
      });

      return results;
    } catch (error) {
      this.log('error', 'Event scrape failed', { error: error.message });
      return this.handleError(error, 'event scrape');
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Scrape RAW Wine fairs and events
   */
  async scrapeRAWWineFairs(options = {}) {
    this.log('info', 'Scraping RAW Wine fairs');

    const events = [];

    try {
      // RAW Wine events page
      const url = 'https://www.rawwine.com/fairs';

      const html = await this.fetchWithAxios(url);
      const $ = this.parseHTML(html);

      // Parse event listings
      $('.event-item, .fair-item, .event-card').each((i, element) => {
        try {
          const $element = $(element);

          const name = this.extractText($element.find('.event-name, h2, h3, .title'));
          const date = this.extractText($element.find('.event-date, .date'));
          const location = this.extractText($element.find('.event-location, .location'));
          const city = this.extractText($element.find('.event-city, .city'));
          const country = this.extractText($element.find('.event-country, .country'));
          const description = this.extractText($element.find('.event-description, .description'));
          const url = this.extractAttr($element.find('a'), 'href');
          const imageUrl = this.extractAttr($element.find('img'), 'src');

          if (name) {
            events.push({
              name: this.cleanText(name),
              description: this.cleanText(description),
              startDate: this.parseDate(date),
              endDate: null, // May need to extract separately
              location: this.cleanText(location),
              city: this.cleanText(city),
              country: this.cleanText(country),
              venue: this.cleanText(location),
              url: this.isValidUrl(url) ? url : null,
              imageUrl: this.isValidUrl(imageUrl) ? imageUrl : null,
              eventType: 'wine_fair',
              source: 'raw_wine',
              ticketUrl: null,
              price: null,
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          this.log('warn', 'Failed to parse RAW Wine event', { error: error.message });
        }
      });

      this.log('info', `Found ${events.length} events from RAW Wine`);
    } catch (error) {
      this.log('error', 'RAW Wine events scraping failed', { error: error.message });
      throw error;
    }

    return events;
  }

  /**
   * Scrape Eventbrite for natural wine events
   */
  async scrapeEventbrite(options = {}) {
    this.log('info', 'Scraping Eventbrite');

    const events = [];

    const searchQueries = [
      'natural wine tasting',
      'natural wine fair',
      'biodynamic wine',
      'orange wine tasting',
      'low intervention wine'
    ];

    for (const query of searchQueries) {
      try {
        // Eventbrite search URL
        const searchUrl = `https://www.eventbrite.com/d/online/events--${encodeURIComponent(query)}`;

        const html = await this.fetchWithPuppeteer(searchUrl, {
          waitForSelector: '.search-event-card-wrapper',
          actions: async (page) => {
            // Scroll to load more events
            await this.scrollPage(page, 2);
            await this.sleep(1500);
          }
        });

        const $ = this.parseHTML(html);
        const queryEvents = this.parseEventbriteResults($, query);
        events.push(...queryEvents);

        this.log('info', `Found ${queryEvents.length} events for query: ${query}`);
      } catch (error) {
        this.log('warn', `Failed to scrape Eventbrite for query: ${query}`, { error: error.message });
      }
    }

    return events;
  }

  /**
   * Parse Eventbrite search results
   */
  parseEventbriteResults($, searchQuery) {
    const events = [];

    $('.search-event-card-wrapper, .event-card').each((i, element) => {
      try {
        const $element = $(element);

        const name = this.extractText($element.find('.event-card__title, h3'));
        const date = this.extractText($element.find('.event-card__date, .date'));
        const location = this.extractText($element.find('.event-card__location, .location'));
        const price = this.extractText($element.find('.event-card__price, .price'));
        const url = this.extractAttr($element.find('a'), 'href');
        const imageUrl = this.extractAttr($element.find('img'), 'src');

        if (name) {
          events.push({
            name: this.cleanText(name),
            description: null, // Would need to visit detail page
            startDate: this.parseDate(date),
            endDate: null,
            location: this.cleanText(location),
            city: null,
            country: null,
            venue: this.cleanText(location),
            url: this.isValidUrl(url) ? url : null,
            imageUrl: this.isValidUrl(imageUrl) ? imageUrl : null,
            eventType: this.inferEventType(name, searchQuery),
            source: 'eventbrite',
            ticketUrl: this.isValidUrl(url) ? url : null,
            price: this.cleanText(price),
            scrapedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        // Skip individual parsing errors
      }
    });

    return events;
  }

  /**
   * Scrape local wine fair websites
   */
  async scrapeWineFairs(options = {}) {
    this.log('info', 'Scraping wine fair websites');

    const events = [];

    // List of wine fair websites to scrape
    const wineFairSites = [
      {
        name: 'VinNatur',
        url: 'https://www.vinnatur.org/eventi',
        enabled: true
      },
      {
        name: 'Real Wine Fair',
        url: 'https://www.therealwinefair.com',
        enabled: true
      },
      {
        name: 'La Dive Bouteille',
        url: 'https://www.ladivebouteille.com',
        enabled: true
      },
      {
        name: 'Glou Glou',
        url: 'https://www.glouglou.wine/events',
        enabled: true
      }
    ];

    for (const site of wineFairSites) {
      if (!site.enabled) continue;

      try {
        const siteEvents = await this.scrapeWineFairSite(site);
        events.push(...siteEvents);
        this.log('info', `Found ${siteEvents.length} events from ${site.name}`);
      } catch (error) {
        this.log('warn', `Failed to scrape ${site.name}`, { error: error.message });
      }
    }

    return events;
  }

  /**
   * Scrape a single wine fair site
   */
  async scrapeWineFairSite(site) {
    const events = [];

    try {
      const html = await this.fetchWithAxios(site.url);
      const $ = this.parseHTML(html);

      // Generic parsing - would need customization per site
      $('.event, .fair, .tasting').each((i, element) => {
        try {
          const $element = $(element);

          const name = this.extractText($element.find('h2, h3, .title, .name'));
          const date = this.extractText($element.find('.date, .when'));
          const location = this.extractText($element.find('.location, .where, .venue'));
          const description = this.extractText($element.find('.description, p'));
          const url = this.extractAttr($element.find('a'), 'href');

          if (name) {
            events.push({
              name: this.cleanText(name),
              description: this.cleanText(description),
              startDate: this.parseDate(date),
              endDate: null,
              location: this.cleanText(location),
              city: null,
              country: null,
              venue: this.cleanText(location),
              url: this.isValidUrl(url) ? url : null,
              imageUrl: null,
              eventType: 'wine_fair',
              source: site.name,
              ticketUrl: null,
              price: null,
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          // Skip individual parsing errors
        }
      });
    } catch (error) {
      this.log('warn', `Failed to scrape ${site.name}`, { error: error.message });
    }

    return events;
  }

  /**
   * Helper: Scroll page to load dynamic content
   */
  async scrollPage(page, scrollCount = 3) {
    for (let i = 0; i < scrollCount; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await this.sleep(1000);
    }
  }

  /**
   * Helper: Parse date from various formats
   */
  parseDate(dateString) {
    if (!dateString) return null;

    try {
      // Clean the date string
      const cleaned = this.cleanText(dateString);

      // Try parsing with Date constructor
      const date = new Date(cleaned);

      // Check if valid date
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }

      // Try extracting date patterns (DD/MM/YYYY, MM/DD/YYYY, etc.)
      const patterns = [
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
        /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
        /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i
      ];

      for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
          const parsedDate = new Date(match[0]);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
          }
        }
      }
    } catch (error) {
      this.log('warn', 'Date parsing failed', { dateString, error: error.message });
    }

    return null;
  }

  /**
   * Helper: Infer event type from name and context
   */
  inferEventType(name, context = '') {
    const lowercaseName = (name || '').toLowerCase();
    const lowercaseContext = (context || '').toLowerCase();

    if (lowercaseName.includes('fair') || lowercaseContext.includes('fair')) {
      return 'wine_fair';
    }
    if (lowercaseName.includes('tasting') || lowercaseContext.includes('tasting')) {
      return 'tasting';
    }
    if (lowercaseName.includes('dinner') || lowercaseName.includes('pairing')) {
      return 'dinner';
    }
    if (lowercaseName.includes('workshop') || lowercaseName.includes('class')) {
      return 'workshop';
    }
    if (lowercaseName.includes('festival')) {
      return 'festival';
    }

    return 'wine_event';
  }

  /**
   * Helper: Deduplicate events by name and date
   */
  deduplicateEvents(events) {
    const seen = new Set();
    const unique = [];

    for (const event of events) {
      const key = `${event.name}|${event.startDate}`.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(event);
      }
    }

    return unique;
  }

  /**
   * Helper: Filter to include only future events
   */
  filterFutureEvents(events) {
    const now = new Date();

    return events.filter(event => {
      if (!event.startDate) return false;

      try {
        const eventDate = new Date(event.startDate);
        return eventDate >= now;
      } catch (error) {
        return false;
      }
    });
  }

  /**
   * Enrich event with additional details by visiting detail page
   */
  async enrichEvent(event) {
    if (!event.url) return event;

    try {
      const html = await this.fetchWithAxios(event.url);
      const $ = this.parseHTML(html);

      // Extract additional details from event page
      const fullDescription = this.extractText($('description, .event-details, .about'));
      const organizer = this.extractText($('.organizer, .host'));
      const ticketUrl = this.extractAttr($('a[href*="ticket"], .buy-tickets'), 'href');

      return {
        ...event,
        description: fullDescription || event.description,
        organizer: this.cleanText(organizer),
        ticketUrl: this.isValidUrl(ticketUrl) ? ticketUrl : event.ticketUrl
      };
    } catch (error) {
      this.log('warn', 'Failed to enrich event', { event: event.name, error: error.message });
      return event;
    }
  }
}

module.exports = EventScraper;
