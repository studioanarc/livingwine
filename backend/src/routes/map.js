const express = require('express');
const { query, validationResult } = require('express-validator');
const { Venue, Producer } = require('../models');
const { sequelize } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/v1/map/clusters - Return clustered points based on zoom level and bounds
router.get('/clusters',
  optionalAuth,
  [
    query('minLat')
      .isFloat()
      .withMessage('Valid minLat required'),
    query('maxLat')
      .isFloat()
      .withMessage('Valid maxLat required'),
    query('minLng')
      .isFloat()
      .withMessage('Valid minLng required'),
    query('maxLng')
      .isFloat()
      .withMessage('Valid maxLng required'),
    query('zoom')
      .isInt({ min: 0, max: 22 })
      .withMessage('Zoom must be between 0 and 22'),
    query('clusterDistance')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Cluster distance must be positive')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const { minLat, maxLat, minLng, maxLng, zoom } = req.query;
      const clusterDistance = parseInt(req.query.clusterDistance) || 40; // Default cluster radius in pixels

      // Determine cluster precision based on zoom level
      // Higher zoom = more precise clustering
      const clusterPrecision = Math.max(0.1, 45 / Math.pow(2, zoom / 2));

      // Use PostGIS to cluster venues and producers
      const venueQuery = `
        SELECT
          ST_AsGeoJSON(ST_Centroid(ST_Collect(coordinates)))::json AS geometry,
          COUNT(*) as count,
          AVG(CAST(total_checkins AS FLOAT)) as avg_checkins,
          'venue' as type,
          ARRAY_AGG(id) as ids
        FROM venues
        WHERE
          is_deleted = false
          AND ST_DWithin(
            coordinates,
            ST_MakeEnvelope(
              $1, $2, $3, $4,
              4326
            ),
            0
          )
        GROUP BY
          ST_GeoHash(coordinates, $5)
      `;

      const producerQuery = `
        SELECT
          ST_AsGeoJSON(ST_Centroid(ST_Collect(coordinates)))::json AS geometry,
          COUNT(*) as count,
          AVG(CAST(total_checkins AS FLOAT)) as avg_checkins,
          'producer' as type,
          ARRAY_AGG(id) as ids
        FROM producers
        WHERE
          deleted_at IS NULL
          AND ST_DWithin(
            coordinates,
            ST_MakeEnvelope(
              $1, $2, $3, $4,
              4326
            ),
            0
          )
        GROUP BY
          ST_GeoHash(coordinates, $5)
      `;

      const [venueResults, producerResults] = await Promise.all([
        sequelize.query(venueQuery, {
          replacements: [parseFloat(minLng), parseFloat(minLat), parseFloat(maxLng), parseFloat(maxLat), clusterPrecision],
          type: sequelize.QueryTypes.SELECT
        }),
        sequelize.query(producerQuery, {
          replacements: [parseFloat(minLng), parseFloat(minLat), parseFloat(maxLng), parseFloat(maxLat), clusterPrecision],
          type: sequelize.QueryTypes.SELECT
        })
      ]);

      const clusters = [...venueResults, ...producerResults].map(cluster => ({
        geometry: cluster.geometry,
        properties: {
          count: parseInt(cluster.count),
          avgCheckins: parseFloat(cluster.avg_checkins) || 0,
          type: cluster.type,
          ids: cluster.ids
        }
      }));

      res.json({
        type: 'FeatureCollection',
        features: clusters
      });
    } catch (error) {
      console.error('Cluster map error:', error);
      res.status(500).json({
        error: 'Failed to fetch clusters',
        message: error.message
      });
    }
  }
);

// GET /api/v1/map/venues - Get venues in bounding box
router.get('/venues',
  optionalAuth,
  [
    query('minLat')
      .isFloat()
      .withMessage('Valid minLat required'),
    query('maxLat')
      .isFloat()
      .withMessage('Valid maxLat required'),
    query('minLng')
      .isFloat()
      .withMessage('Valid minLng required'),
    query('maxLng')
      .isFloat()
      .withMessage('Valid maxLng required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const { minLat, maxLat, minLng, maxLng } = req.query;
      const limit = parseInt(req.query.limit) || 50;

      const venues = await Venue.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                'ST_DWithin',
                sequelize.col('coordinates'),
                sequelize.fn(
                  'ST_MakeEnvelope',
                  parseFloat(minLng),
                  parseFloat(minLat),
                  parseFloat(maxLng),
                  parseFloat(maxLat),
                  4326
                ),
                0
              ),
              true
            )
          ]
        },
        attributes: {
          exclude: ['deletedAt']
        },
        limit,
        order: [['totalCheckins', 'DESC']],
        subQuery: false
      });

      res.json({
        venues,
        count: venues.length,
        limit
      });
    } catch (error) {
      console.error('Get venues map error:', error);
      res.status(500).json({
        error: 'Failed to fetch venues',
        message: error.message
      });
    }
  }
);

// GET /api/v1/map/producers - Get producers in bounding box
router.get('/producers',
  optionalAuth,
  [
    query('minLat')
      .isFloat()
      .withMessage('Valid minLat required'),
    query('maxLat')
      .isFloat()
      .withMessage('Valid maxLat required'),
    query('minLng')
      .isFloat()
      .withMessage('Valid minLng required'),
    query('maxLng')
      .isFloat()
      .withMessage('Valid maxLng required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const { minLat, maxLat, minLng, maxLng } = req.query;
      const limit = parseInt(req.query.limit) || 50;

      const producers = await Producer.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                'ST_DWithin',
                sequelize.col('coordinates'),
                sequelize.fn(
                  'ST_MakeEnvelope',
                  parseFloat(minLng),
                  parseFloat(minLat),
                  parseFloat(maxLng),
                  parseFloat(maxLat),
                  4326
                ),
                0
              ),
              true
            )
          ]
        },
        attributes: {
          exclude: ['deletedAt']
        },
        limit,
        order: [['totalCheckins', 'DESC']],
        subQuery: false
      });

      res.json({
        producers,
        count: producers.length,
        limit
      });
    } catch (error) {
      console.error('Get producers map error:', error);
      res.status(500).json({
        error: 'Failed to fetch producers',
        message: error.message
      });
    }
  }
);

module.exports = router;
