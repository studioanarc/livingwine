# Web Scraping Service

This directory contains the web scraping infrastructure for the Tipsy natural wine app. The scraping service is designed to gather data about natural wine venues, events, and producers from various online sources.

## Architecture

### Components

1. **Base Scraper (`scraper.js`)**: Core scraping functionality with rate limiting, retry logic, and error handling
2. **Venue Scraper (`venues.js`)**: Scrapes natural wine bars, restaurants, and shops
3. **Event Scraper (`events.js`)**: Scrapes wine fairs, tastings, and events
4. **Producer Scraper (`producers.js`)**: Scrapes producer websites for details and certifications
5. **Queue Service (`queue.js`)**: Manages scraping jobs using Bull/Redis
6. **Admin Routes (`../routes/admin.js`)**: API endpoints for triggering scrapes

## Requirements

### Dependencies

```bash
npm install puppeteer cheerio axios bull
```

### Redis

The queue service requires Redis to be running:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
# macOS: brew install redis
# Ubuntu: apt-get install redis-server
```

### Environment Variables

Add to your `.env` file:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Scraping Configuration
ENABLE_SCRAPING_QUEUE=true
SCRAPING_RATE_LIMIT=1000  # milliseconds between requests
SCRAPING_MAX_RETRIES=3
SCRAPING_TIMEOUT=30000    # milliseconds

# Optional: API Keys for enhanced scraping
GOOGLE_MAPS_API_KEY=your_api_key
```

## Usage

### Direct Scraping (Synchronous)

```javascript
const { VenueScraper, EventScraper, ProducerScraper } = require('./services/scraping');

// Scrape venues
const venueScraper = new VenueScraper({
  sources: ['google', 'raw_wine', 'community']
});
const venueResults = await venueScraper.scrape('New York, NY');

// Scrape events
const eventScraper = new EventScraper({
  sources: ['raw_wine', 'eventbrite', 'wine_fairs']
});
const eventResults = await eventScraper.scrape();

// Scrape producer
const producerScraper = new ProducerScraper();
const producerResult = await producerScraper.scrape('https://example-winery.com');
```

### Queue-Based Scraping (Asynchronous)

```javascript
const { scrapingQueue } = require('./services/scraping');

// Initialize the queue
await scrapingQueue.initialize();

// Queue a venue scrape
const job = await scrapingQueue.scrapeVenues('Paris, France', ['google', 'raw_wine']);
console.log('Job ID:', job.jobId);

// Check job status
const status = await scrapingQueue.getJobStatus('venues', job.jobId);
console.log('Job status:', status.state);

// Get queue statistics
const stats = await scrapingQueue.getAllQueueStats();
console.log('Queue stats:', stats);
```

### API Endpoints

All admin endpoints require steward-level authentication.

#### Trigger Venue Scrape

```bash
POST /api/v1/admin/scrape/venues
Authorization: Bearer <token>

{
  "location": "New York, NY",
  "sources": ["google", "raw_wine", "community"],
  "options": {}
}
```

#### Trigger Event Scrape

```bash
POST /api/v1/admin/scrape/events
Authorization: Bearer <token>

{
  "sources": ["raw_wine", "eventbrite", "wine_fairs"],
  "options": {}
}
```

#### Trigger Producer Scrape

```bash
POST /api/v1/admin/scrape/producer
Authorization: Bearer <token>

{
  "url": "https://example-winery.com",
  "options": {}
}

# Or batch scrape
{
  "urls": [
    "https://winery1.com",
    "https://winery2.com"
  ],
  "options": {}
}
```

#### Get Job Status

```bash
GET /api/v1/admin/scrape/jobs/:queue/:jobId
Authorization: Bearer <token>
```

#### Get Queue Statistics

```bash
GET /api/v1/admin/scrape/queues/stats
Authorization: Bearer <token>
```

#### Get Recent Jobs

```bash
GET /api/v1/admin/scrape/queues/:queue/jobs?status=completed&limit=10
Authorization: Bearer <token>
```

#### Pause/Resume Queue

```bash
POST /api/v1/admin/scrape/queues/:queue/pause
POST /api/v1/admin/scrape/queues/:queue/resume
Authorization: Bearer <token>
```

#### Clear Queue

```bash
DELETE /api/v1/admin/scrape/queues/:queue
Authorization: Bearer <token>
```

## Scraper Details

### Venue Scraper

Sources:
- **Google Maps**: Searches for natural wine bars, restaurants, and shops
- **RAW Wine**: Official RAW Wine venue directory
- **Community Sites**: Natural wine community directories

Data extracted:
- Name
- Address
- Coordinates (requires geocoding)
- Type (bar, restaurant, shop)
- Website
- Rating

### Event Scraper

Sources:
- **RAW Wine Fairs**: Official RAW Wine events
- **Eventbrite**: Natural wine events on Eventbrite
- **Wine Fair Sites**: VinNatur, Real Wine Fair, La Dive Bouteille, etc.

Data extracted:
- Name
- Description
- Start/end dates
- Location and venue
- City and country
- Event type
- Ticket URL
- Price

### Producer Scraper

Scrapes individual producer websites for:
- Producer name
- Description
- Contact info (email, phone, address)
- Certifications (organic, biodynamic, natural)
- Production details (hectares, bottles, winemaking methods)
- Location and region
- Social media links
- Wine list

## Scheduled Jobs

The queue service automatically sets up recurring scraping jobs:

- **Venues**: Daily at 2 AM
- **Events**: Every 6 hours

To customize schedules, edit the `setupRecurringJobs()` method in `queue.js`.

## Error Handling

All scrapers include:
- **Automatic retries**: 3 attempts with exponential backoff
- **Rate limiting**: Configurable delay between requests
- **Timeout protection**: 30-second default timeout
- **Graceful degradation**: Continues on individual item failures
- **Comprehensive logging**: All errors and warnings logged

## Production Considerations

### 1. Legal and Ethical

- **robots.txt**: Respect robots.txt files
- **Terms of Service**: Review ToS of scraped sites
- **Rate limiting**: Don't overload servers
- **User agent**: Use descriptive user agent
- **Data usage**: Comply with data protection laws

### 2. Performance

- Use queue for large scraping jobs
- Monitor Redis memory usage
- Set appropriate concurrency limits
- Consider using proxies for high-volume scraping

### 3. Maintenance

- Update selectors when websites change
- Monitor scrape success rates
- Review and handle failed jobs
- Keep dependencies updated

### 4. Data Quality

- Validate scraped data before storing
- Deduplicate results
- Geocode addresses for accurate coordinates
- Verify certifications from official sources

## Monitoring

Monitor scraping health with:

```javascript
// Get all queue statistics
const stats = await scrapingQueue.getAllQueueStats();

// Get failed jobs
const failedJobs = await scrapingQueue.getRecentJobs('venues', 'failed', 50);

// Review error logs
console.log(failedJobs.map(j => j.failedReason));
```

## Troubleshooting

### Queue not initializing

- Check Redis is running: `redis-cli ping`
- Verify Redis connection settings in `.env`
- Check Redis logs for errors

### Scraping failures

- Website structure may have changed (update selectors)
- Check rate limiting isn't too aggressive
- Verify network connectivity
- Review error logs for specific failures

### Puppeteer issues

```bash
# Install missing dependencies (Linux)
sudo apt-get install -y chromium-browser

# Or use bundled Chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false npm install puppeteer
```

## Future Enhancements

- [ ] Add more scraping sources
- [ ] Implement proxy rotation
- [ ] Add captcha solving
- [ ] Create scraping dashboard UI
- [ ] Add data validation and enrichment
- [ ] Implement change detection
- [ ] Add scraping metrics and analytics
- [ ] Create automated testing for scrapers

## Support

For issues or questions:
1. Check the error logs
2. Review this documentation
3. Check Bull queue dashboard (if installed)
4. Contact the development team
