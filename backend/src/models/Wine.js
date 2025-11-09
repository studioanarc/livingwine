const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wine = sequelize.define('Wine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  producerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'producer_id',
    references: {
      model: 'producers',
      key: 'id'
    }
  },

  // Basic info
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  vintage: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },

  // Classification
  wineType: {
    type: DataTypes.STRING(50),
    field: 'wine_type',
    validate: {
      isIn: [['red', 'white', 'rose', 'orange', 'sparkling', 'pet-nat']]
    }
  },
  grapeVarietals: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'grape_varietals'
  },
  region: {
    type: DataTypes.STRING(100)
  },
  appellation: {
    type: DataTypes.STRING(100)
  },

  // Production details
  alcoholPercentage: {
    type: DataTypes.DECIMAL(4, 2),
    field: 'alcohol_percentage'
  },
  productionVolume: {
    type: DataTypes.INTEGER,
    field: 'production_volume'
  },

  // VINEYARD DETAILS (stored as JSONB)
  vineyardDetails: {
    type: DataTypes.JSONB,
    defaultValue: {
      farmingMethod: null,
      certifications: [],
      soilType: null,
      vineyardAge: null,
      yield: null,
      harvestMethod: null,
      harvestDate: null,
      sameDayProcessing: null,
      cooledTransport: null,
      handSorted: null
    },
    field: 'vineyard_details'
  },

  // CELLAR DETAILS (stored as JSONB)
  cellarDetails: {
    type: DataTypes.JSONB,
    defaultValue: {
      fermentation: {
        yeastType: null,
        vesselType: null,
        temperatureControl: null,
        durationDays: null,
        macerationDays: null
      },
      pressing: {
        method: null,
        wholeCluster: null,
        batchSize: null
      },
      aging: {
        vesselType: null,
        durationMonths: null,
        newOakPercentage: null,
        leesContact: null
      },
      interventions: {
        sulfitesAdded: null,
        sulfitesPpm: null,
        filtration: null,
        fining: null,
        additions: [],
        phAdjustments: null
      }
    },
    field: 'cellar_details'
  },

  // DISTRIBUTION DETAILS (stored as JSONB)
  distributionDetails: {
    type: DataTypes.JSONB,
    defaultValue: {
      bottling: {
        estateBottled: null,
        bottlingDate: null,
        closureType: null
      },
      distribution: {
        productionScale: null,
        importers: [],
        tempControlledStorage: null
      }
    },
    field: 'distribution_details'
  },

  // Openness/transparency rating
  opennessScore: {
    type: DataTypes.JSONB,
    defaultValue: {
      completeness: 0,
      communityVerified: false,
      producerCertified: false,
      verifiedCount: 0
    },
    field: 'openness_score'
  },

  // Stats
  totalCheckins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_checkins'
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
    field: 'average_rating'
  },

  // Images
  labelImageUrl: {
    type: DataTypes.STRING(500),
    field: 'label_image_url'
  },
  bottleImageUrl: {
    type: DataTypes.STRING(500),
    field: 'bottle_image_url'
  },
  additionalImages: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'additional_images'
  },

  // Metadata
  createdByUserId: {
    type: DataTypes.UUID,
    field: 'created_by_user_id'
  },
  lastUpdatedByUserId: {
    type: DataTypes.UUID,
    field: 'last_updated_by_user_id'
  },

  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  tableName: 'wines',
  paranoid: true,
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['producer_id'] },
    { fields: ['wine_type'] },
    { fields: ['region'] },
    { fields: ['vintage'] },
    { fields: ['average_rating'] }
  ]
});

module.exports = Wine;
