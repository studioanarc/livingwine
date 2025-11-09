const BaseScraper = require('./scraper');
const axios = require('axios');

/**
 * Venue Scraper
 * Scrapes natural wine bars, restaurants, and wine shops from various sources
 */
class VenueScraper extends BaseScraper {
  constructor(options = {}) {
    super(options);
    this.sources = options.sources || ['google', 'raw_wine', 'community'];
  }

  /**
   * Main scrape method
   */
  async scrape(location = 'New York, NY', options = {}) {
    this.log('info', 'Starting venue scrape', { location, sources: this.sources });

    const results = {
      success: true,
      location,
      venues: [],
      errors: [],
      sources: {}
    };

    try {
      // Scrape from each enabled source
      if (this.sources.includes('google')) {
        try {
          const googleVenues = await this.scrapeGoogleMaps(location, options);
          results.venues.push(...googleVenues);
          results.sources.google = { count: googleVenues.length, success: true };
        } catch (error) {
          this.log('error', 'Google Maps scraping failed', { error: error.message });
          results.errors.push({ source: 'google', error: error.message });
          results.sources.google = { success: false, error: error.message };
        }
      }

      if (this.sources.includes('raw_wine')) {
        try {
          const rawWineVenues = await this.scrapeRAWWine(location, options);
          results.venues.push(...rawWineVenues);
          results.sources.raw_wine = { count: rawWineVenues.length, success: true };
        } catch (error) {
          this.log('error', 'RAW Wine scraping failed', { error: error.message });
          results.errors.push({ source: 'raw_wine', error: error.message });
          results.sources.raw_wine = { success: false, error: error.message };
        }
      }

      if (this.sources.includes('community')) {
        try {
          const communityVenues = await this.scrapeCommunitySites(location, options);
          results.venues.push(...communityVenues);
          results.sources.community = { count: communityVenues.length, success: true };
        } catch (error) {
          this.log('error', 'Community sites scraping failed', { error: error.message });
          results.errors.push({ source: 'community', error: error.message });
          results.sources.community = { success: false, error: error.message };
        }
      }

      // Deduplicate venues
      results.venues = this.deduplicateVenues(results.venues);

      this.log('info', 'Venue scrape completed', {
        totalVenues: results.venues.length,
        sources: results.sources
      });

      return results;
    } catch (error) {
      this.log('error', 'Venue scrape failed', { error: error.message });
      return this.handleError(error, 'venue scrape');
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Scrape Google Maps for natural wine venues
   */
  async scrapeGoogleMaps(location, options = {}) {
    this.log('info', 'Scraping Google Maps', { location });

    const searchQueries = [
      'natural wine bar',
      'natural wine restaurant',
      'natural wine shop',
      'biodynamic wine bar'
    ];

    const venues = [];

    for (const query of searchQueries) {
      try {
        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${query} ${location}`)}`;

        // Use Puppeteer for Google Maps as it's JavaScript heavy
        const html = await this.fetchWithPuppeteer(searchUrl, {
          waitForSelector: 'div[role="feed"]',
          actions: async (page) => {
            // Scroll to load more results
            await this.scrollPage(page, 3);
            await this.sleep(2000);
          }
        });

        const $ = this.parseHTML(html);
        const queryVenues = this.parseGoogleMapsResults($, query);
        venues.push(...queryVenues);

        this.log('info', `Found ${queryVenues.length} venues for query: ${query}`);
      } catch (error) {
        this.log('warn', `Failed to scrape Google Maps for query: ${query}`, { error: error.message });
      }
    }

    return venues;
  }

  /**
   * Parse Google Maps results
   */
  parseGoogleMapsResults($, searchQuery) {
    const venues = [];

    // Note: Google Maps HTML structure changes frequently
    // This is a simplified example - actual selectors would need to be updated
    $('div[role="article"]').each((i, element) => {
      try {
        const $element = $(element);

        const name = this.extractText($element.find('div[role="heading"]'));
        const address = this.extractText($element.find('div[data-tooltip*="address"]'));
        const rating = this.extractText($element.find('span[role="img"]'));
        const website = this.extractAttr($element.find('a[data-tooltip*="website"]'), 'href');

        if (name) {
          venues.push({
            name: this.cleanText(name),
            address: this.cleanText(address),
            rating: this.parseRating(rating),
            website: this.isValidUrl(website) ? website : null,
            type: this.inferVenueType(name, searchQuery),
            source: 'google_maps',
            coordinates: null, // Would need geocoding
            scrapedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        this.log('warn', 'Failed to parse Google Maps result', { error: error.message });
      }
    });

    return venues;
  }

  /**
   * Scrape RAW Wine website for venues
   */
  async scrapeRAWWine(location, options = {}) {
    this.log('info', 'Scraping RAW Wine website', { location });

    const venues = [];

    try {
      // RAW Wine venue directory (example URL - would need to be verified)
      const url = 'https://www.rawwine.com/venues';

      const html = await this.fetchWithAxios(url);
      const $ = this.parseHTML(html);

      // Example parsing - actual selectors would depend on site structure
      $('.venue-item, .venue-card').each((i, element) => {
        try {
          const $element = $(element);

          const name = this.extractText($element.find('.venue-name, h3, h2'));
          const address = this.extractText($element.find('.venue-address, .address'));
          const city = this.extractText($element.find('.venue-city, .city'));
          const country = this.extractText($element.find('.venue-country, .country'));
          const website = this.extractAttr($element.find('a.venue-link, a.website'), 'href');
          const description = this.extractText($element.find('.venue-description, .description'));

          if (name) {
            venues.push({
              name: this.cleanText(name),
              address: this.cleanText(address),
              city: this.cleanText(city),
              country: this.cleanText(country),
              website: this.isValidUrl(website) ? website : null,
              description: this.cleanText(description),
              type: 'natural_wine_bar',
              source: 'raw_wine',
              coordinates: null,
              scrapedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          this.log('warn', 'Failed to parse RAW Wine venue', { error: error.message });
        }
      });

      this.log('info', `Found ${venues.length} venues from RAW Wine`);
    } catch (error) {
      this.log('error', 'RAW Wine scraping failed', { error: error.message });
    }

    return venues;
  }

  /**
   * Scrape natural wine community sites
   */
  async scrapeCommunitysites(location, options = {}) {
    this.log('info', 'Scraping community sites', { location });

    const venues = [];

    // List of community sites to scrape
    const communitySites = [
      {
        name: 'natural_wine_directory',
        url: 'https://naturalwinedirectory.com',
        enabled: true
      },
      {
        name: 'wine_natural',
        url: 'https://www.wine-natural.com/venues',
        enabled: true
      }
    ];

    for (const site of communitySites) {
      if (!site.enabled) continue;

      try {
        const siteVenues = await this.scrapeCommunitySite(site, location);
        venues.push(...siteVenues);
        this.log('info', `Found ${siteVenues.length} venues from ${site.name}`);
      } catch (error) {
        this.log('warn', `Failed to scrape ${site.name}`, { error: error.message });
      }
    }

    return venues;
  }

  /**
   * Scrape a single community site
   */
  async scrapeCommunitysite(site, location) {
    const venues = [];

    try {
      const html = await this.fetchWithAxios(site.url);
      const $ = this.parseHTML(html);

      // Generic parsing - would need customization per site
      $('.venue, .location, .bar, .restaurant').each((i, element) => {
        try {
          const $element = $(element);

          const name = this.extractText($element.find('h2, h3, .name, .title'));
          const address = this.extractText($element.find('.address, .location'));
          const website = this.extractAttr($element.find('a'), 'href');

          if (name) {
            venues.push({
              name: this.cleanText(name),
              address: this.cleanText(address),
              website: this.isValidUrl(website) ? website : null,
              type: 'natural_wine_venue',
              source: site.name,
              coordinates: null,
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

    return venues;
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
   * Helper: Parse rating from text
   */
  parseRating(ratingText) {
    if (!ratingText) return null;

    const match = ratingText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  /**
   * Helper: Infer venue type from name and context
   */
  inferVenueType(name, context = '') {
    const lowercaseName = (name || '').toLowerCase();
    const lowercaseContext = (context || '').toLowerCase();

    if (lowercaseName.includes('shop') || lowercaseContext.includes('shop')) {
      return 'wine_shop';
    }
    if (lowercaseName.includes('restaurant') || lowercaseContext.includes('restaurant')) {
      return 'restaurant';
    }
    if (lowercaseName.includes('bar') || lowercaseContext.includes('bar')) {
      return 'wine_bar';
    }

    return 'wine_venue';
  }

  /**
   * Helper: Deduplicate venues by name and address
   */
  deduplicateVenues(venues) {
    const seen = new Set();
    const unique = [];

    for (const venue of venues) {
      const key = `${venue.name}|${venue.address}`.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(venue);
      }
    }

    return unique;
  }

  /**
   * Geocode address to coordinates
   * Note: Requires geocoding API (Google, Mapbox, etc.)
   */
  async geocodeAddress(address) {
    // Placeholder - would need actual geocoding API
    // Example with Google Geocoding API:
    /*
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }
    } catch (error) {
      this.log('warn', 'Geocoding failed', { address, error: error.message });
    }
    */

    return null;
  }
}

module.exports = VenueScraper;
