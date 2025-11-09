/**
 * Scraping Services Index
 * Exports all scraping-related modules
 */

const BaseScraper = require('./scraper');
const VenueScraper = require('./venues');
const EventScraper = require('./events');
const ProducerScraper = require('./producers');
const scrapingQueue = require('./queue');

module.exports = {
  BaseScraper,
  VenueScraper,
  EventScraper,
  ProducerScraper,
  scrapingQueue
};
