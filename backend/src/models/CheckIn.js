const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CheckIn = sequelize.define('CheckIn', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  wineId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'wine_id',
    references: {
      model: 'wines',
      key: 'id'
    }
  },
  venueId: {
    type: DataTypes.UUID,
    field: 'venue_id',
    references: {
      model: 'venues',
      key: 'id'
    }
  },

  // Rating and review
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    validate: {
      min: 0,
      max: 5
    }
  },
  tastingNotes: {
    type: DataTypes.TEXT,
    field: 'tasting_notes'
  },

  // Flavor profile (user's perception)
  flavorProfile: {
    type: DataTypes.JSONB,
    defaultValue: {
      funky: 0,
      clean: 0,
      oxidative: 0,
      reductive: 0,
      savory: 0,
      mineral: 0,
      floral: 0,
      earthy: 0,
      citrus: 0
    },
    field: 'flavor_profile'
  },

  // Mouthfeel
  mouthfeel: {
    type: DataTypes.JSONB,
    defaultValue: {
      tannin: 0,
      acidity: 0,
      body: 0,
      texture: null
    }
  },

  // Context tags
  contextTags: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'context_tags'
    // Examples: ["sunny_afternoon", "pizza_wine", "dinner_party", "contemplative"]
  },
  foodPairings: {
    type: DataTypes.TEXT,
    field: 'food_pairings'
  },

  // Purchase details
  wherePurchased: {
    type: DataTypes.STRING(200),
    field: 'where_purchased'
  },
  pricePaid: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'price_paid'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },

  // Additional details
  servingTemperature: {
    type: DataTypes.STRING(50),
    field: 'serving_temperature'
    // chilled, cellar_temp, room_temp
  },
  vintageCondition: {
    type: DataTypes.STRING(50),
    field: 'vintage_condition'
    // fresh, mature, past_peak
  },

  // Media
  photoUrls: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'photo_urls'
  },

  // Social
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public'
  },
  allowComments: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'allow_comments'
  },

  // Location (where they drank it)
  locationName: {
    type: DataTypes.STRING(200),
    field: 'location_name'
  },
  locationCoordinates: {
    type: DataTypes.GEOMETRY('POINT'),
    field: 'location_coordinates'
  },

  // Stats
  toastCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'toast_count'
  },
  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'comment_count'
  },

  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  tableName: 'checkins',
  paranoid: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['wine_id'] },
    { fields: ['venue_id'] },
    { fields: ['created_at'] },
    { fields: ['rating'] },
    { type: 'GIST', fields: ['location_coordinates'] }
  ]
});

module.exports = CheckIn;
