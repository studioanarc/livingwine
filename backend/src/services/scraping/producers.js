const BaseScraper = require('./scraper');
const axios = require('axios');

/**
 * Producer Scraper
 * Scrapes producer websites for contact information, certifications,
 * and production details
 */
class ProducerScraper extends BaseScraper {
  constructor(options = {}) {
    super(options);
  }

  /**
   * Main scrape method for a single producer website
   */
  async scrape(producerUrl, options = {}) {
    this.log('info', 'Starting producer scrape', { url: producerUrl });

    const result = {
      success: true,
      url: producerUrl,
      producer: null,
      error: null
    };

    try {
      if (!this.isValidUrl(producerUrl)) {
        throw new Error('Invalid producer URL');
      }

      // Fetch the producer website
      const html = await this.fetchWithAxios(producerUrl);
      const $ = this.parseHTML(html);

      // Extract producer information
      const producer = {
        url: producerUrl,
        domain: this.getDomain(producerUrl),
        name: await this.extractProducerName($, producerUrl),
        description: await this.extractDescription($),
        contactInfo: await this.extractContactInfo($),
        certifications: await this.extractCertifications($),
        productionDetails: await this.extractProductionDetails($),
        location: await this.extractLocation($),
        socialMedia: await this.extractSocialMedia($),
        wines: await this.extractWineList($),
        scrapedAt: new Date().toISOString()
      };

      result.producer = producer;

      this.log('info', 'Producer scrape completed', {
        url: producerUrl,
        name: producer.name
      });

      return result;
    } catch (error) {
      this.log('error', 'Producer scrape failed', {
        url: producerUrl,
        error: error.message
      });

      result.success = false;
      result.error = error.message;

      return result;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Batch scrape multiple producer websites
   */
  async scrapeBatch(producerUrls, options = {}) {
    this.log('info', 'Starting batch producer scrape', {
      count: producerUrls.length
    });

    const results = {
      success: true,
      producers: [],
      errors: [],
      total: producerUrls.length
    };

    for (const url of producerUrls) {
      try {
        const result = await this.scrape(url, options);

        if (result.success) {
          results.producers.push(result.producer);
        } else {
          results.errors.push({
            url,
            error: result.error
          });
        }

        // Apply rate limiting between requests
        await this.applyRateLimit();
      } catch (error) {
        this.log('error', 'Batch scrape error', {
          url,
          error: error.message
        });

        results.errors.push({
          url,
          error: error.message
        });
      }
    }

    results.success = results.errors.length < producerUrls.length;

    this.log('info', 'Batch producer scrape completed', {
      total: results.total,
      successful: results.producers.length,
      failed: results.errors.length
    });

    return results;
  }

  /**
   * Extract producer name from website
   */
  async extractProducerName($, url) {
    // Try multiple selectors
    const selectors = [
      'h1.producer-name',
      'h1.winery-name',
      'h1.estate-name',
      '.producer-title',
      'meta[property="og:title"]',
      'meta[name="title"]',
      'title',
      'h1'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();

      if (element.length) {
        let name;

        if (selector.includes('meta')) {
          name = element.attr('content');
        } else {
          name = this.extractText(element);
        }

        if (name) {
          return this.cleanText(name);
        }
      }
    }

    // Fallback to domain name
    const domain = this.getDomain(url);
    return domain ? domain.replace(/^www\./, '').split('.')[0] : null;
  }

  /**
   * Extract description/about text
   */
  async extractDescription($) {
    const selectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
      '.about-text',
      '.description',
      '.producer-description',
      '.winery-about',
      '#about p',
      '.about p'
    ];

    for (const selector of selectors) {
      const element = $(selector).first();

      if (element.length) {
        let description;

        if (selector.includes('meta')) {
          description = element.attr('content');
        } else {
          description = this.extractText(element);
        }

        if (description && description.length > 50) {
          return this.cleanText(description);
        }
      }
    }

    return null;
  }

  /**
   * Extract contact information
   */
  async extractContactInfo($) {
    const contact = {
      email: null,
      phone: null,
      address: null
    };

    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const pageText = $('body').text();
    const emailMatches = pageText.match(emailRegex);

    if (emailMatches && emailMatches.length > 0) {
      // Filter out common non-contact emails
      const validEmails = emailMatches.filter(email => {
        const lower = email.toLowerCase();
        return !lower.includes('example.com') &&
               !lower.includes('test.com') &&
               !lower.includes('wix.com') &&
               !lower.includes('wordpress.com');
      });

      if (validEmails.length > 0) {
        contact.email = validEmails[0];
      }
    }

    // Also check mailto links
    $('a[href^="mailto:"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !contact.email) {
        contact.email = href.replace('mailto:', '').split('?')[0];
      }
    });

    // Extract phone
    const phoneSelectors = [
      'a[href^="tel:"]',
      '.phone',
      '.telephone',
      '.contact-phone'
    ];

    for (const selector of phoneSelectors) {
      const element = $(selector).first();

      if (element.length) {
        let phone;

        if (selector.includes('href')) {
          phone = element.attr('href')?.replace('tel:', '');
        } else {
          phone = this.extractText(element);
        }

        if (phone) {
          contact.phone = this.cleanText(phone);
          break;
        }
      }
    }

    // Extract address
    const addressSelectors = [
      '.address',
      '.contact-address',
      '.location',
      '[itemprop="address"]',
      '.producer-address'
    ];

    for (const selector of addressSelectors) {
      const element = $(selector).first();

      if (element.length) {
        const address = this.extractText(element);

        if (address && address.length > 10) {
          contact.address = this.cleanText(address);
          break;
        }
      }
    }

    return contact;
  }

  /**
   * Extract certifications (organic, biodynamic, etc.)
   */
  async extractCertifications($) {
    const certifications = [];

    // Common certification keywords
    const certKeywords = {
      organic: ['organic', 'bio', 'biologico', 'biologique'],
      biodynamic: ['biodynamic', 'biodynamie', 'biodinamico', 'demeter'],
      natural: ['natural', 'naturel', 'naturale'],
      sustainable: ['sustainable', 'sustainability', 'sostenibile'],
      vegan: ['vegan', 'vegano'],
      certified: ['certified', 'certification', 'certificato']
    };

    const pageText = $('body').text().toLowerCase();

    // Check for certification keywords
    for (const [certType, keywords] of Object.entries(certKeywords)) {
      for (const keyword of keywords) {
        if (pageText.includes(keyword)) {
          if (!certifications.find(c => c.type === certType)) {
            certifications.push({
              type: certType,
              verified: false,
              foundKeyword: keyword
            });
          }
        }
      }
    }

    // Look for certification badges/images
    $('img[alt*="organic"], img[alt*="bio"], img[alt*="demeter"]').each((i, element) => {
      const alt = $(element).attr('alt')?.toLowerCase() || '';
      const src = $(element).attr('src') || '';

      if (alt.includes('demeter') || src.includes('demeter')) {
        if (!certifications.find(c => c.type === 'biodynamic')) {
          certifications.push({
            type: 'biodynamic',
            verified: true,
            certifier: 'Demeter'
          });
        }
      }
    });

    return certifications;
  }

  /**
   * Extract production details
   */
  async extractProductionDetails($) {
    const details = {
      established: null,
      hectares: null,
      annualProduction: null,
      winemaking: []
    };

    const pageText = $('body').text();

    // Extract year established
    const yearRegex = /established\s+(?:in\s+)?(\d{4})|founded\s+(?:in\s+)?(\d{4})|since\s+(\d{4})/i;
    const yearMatch = pageText.match(yearRegex);

    if (yearMatch) {
      details.established = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
    }

    // Extract hectares
    const hectaresRegex = /(\d+(?:\.\d+)?)\s*(?:hectares|ha|acres)/i;
    const hectaresMatch = pageText.match(hectaresRegex);

    if (hectaresMatch) {
      details.hectares = parseFloat(hectaresMatch[1]);
    }

    // Extract annual production
    const productionRegex = /(\d+(?:,\d+)?)\s*(?:bottles|btls)/i;
    const productionMatch = pageText.match(productionRegex);

    if (productionMatch) {
      details.annualProduction = parseInt(productionMatch[1].replace(/,/g, ''));
    }

    // Extract winemaking keywords
    const winemakingKeywords = [
      'low intervention',
      'minimal intervention',
      'no added sulfites',
      'native yeast',
      'wild yeast',
      'spontaneous fermentation',
      'natural fermentation',
      'amphora',
      'concrete egg',
      'oak barrel',
      'steel tank',
      'carbonic maceration',
      'whole cluster',
      'skin contact',
      'orange wine'
    ];

    const lowerPageText = pageText.toLowerCase();

    for (const keyword of winemakingKeywords) {
      if (lowerPageText.includes(keyword.toLowerCase())) {
        details.winemaking.push(keyword);
      }
    }

    return details;
  }

  /**
   * Extract location information
   */
  async extractLocation($) {
    const location = {
      region: null,
      country: null,
      coordinates: null
    };

    // Look for region/appellation
    const regionSelectors = [
      '.region',
      '.appellation',
      '[itemprop="region"]',
      '.location-region'
    ];

    for (const selector of regionSelectors) {
      const element = $(selector).first();

      if (element.length) {
        location.region = this.cleanText(this.extractText(element));
        break;
      }
    }

    // Look for country
    const countrySelectors = [
      '.country',
      '[itemprop="country"]',
      '.location-country'
    ];

    for (const selector of countrySelectors) {
      const element = $(selector).first();

      if (element.length) {
        location.country = this.cleanText(this.extractText(element));
        break;
      }
    }

    // Check meta tags for location
    const ogLocale = $('meta[property="og:locale"]').attr('content');
    if (ogLocale && !location.country) {
      location.country = ogLocale.split('_')[1];
    }

    return location;
  }

  /**
   * Extract social media links
   */
  async extractSocialMedia($) {
    const social = {
      instagram: null,
      facebook: null,
      twitter: null
    };

    // Find social media links
    $('a[href*="instagram.com"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !social.instagram) {
        social.instagram = href;
      }
    });

    $('a[href*="facebook.com"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !social.facebook) {
        social.facebook = href;
      }
    });

    $('a[href*="twitter.com"], a[href*="x.com"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && !social.twitter) {
        social.twitter = href;
      }
    });

    return social;
  }

  /**
   * Extract wine list from producer website
   */
  async extractWineList($) {
    const wines = [];

    // Look for wine listings
    const wineSelectors = [
      '.wine-item',
      '.wine-card',
      '.product-item',
      '.wine'
    ];

    for (const selector of wineSelectors) {
      const elements = $(selector);

      if (elements.length > 0) {
        elements.each((i, element) => {
          const $element = $(element);

          const name = this.extractText($element.find('h2, h3, .wine-name, .product-name'));
          const vintage = this.extractText($element.find('.vintage, .year'));
          const variety = this.extractText($element.find('.variety, .grape'));
          const description = this.extractText($element.find('.description, p'));

          if (name) {
            wines.push({
              name: this.cleanText(name),
              vintage: vintage ? parseInt(vintage) : null,
              variety: this.cleanText(variety),
              description: this.cleanText(description)
            });
          }
        });

        break; // Found wines, no need to check other selectors
      }
    }

    return wines;
  }

  /**
   * Validate scraped producer data
   */
  validateProducerData(producer) {
    const errors = [];

    if (!producer.name) {
      errors.push('Missing producer name');
    }

    if (!producer.url) {
      errors.push('Missing producer URL');
    }

    if (!producer.contactInfo || (!producer.contactInfo.email && !producer.contactInfo.phone)) {
      errors.push('Missing contact information');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Enrich producer data with additional sources
   */
  async enrichProducerData(producer, sources = []) {
    // Could be extended to pull data from:
    // - Wine databases (Vivino, CellarTracker)
    // - Import/distribution databases
    // - Wine certification registries

    return producer;
  }
}

module.exports = ProducerScraper;
