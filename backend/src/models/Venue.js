const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Venue = sequelize.define('Venue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    unique: true
  },

  // Location
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100)
  },
  state: {
    type: DataTypes.STRING(100)
  },
  country: {
    type: DataTypes.STRING(100)
  },
  zipCode: {
    type: DataTypes.STRING(20),
    field: 'zip_code'
  },
  coordinates: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },

  // Venue Type
  venueType: {
    type: DataTypes.STRING(50),
    field: 'venue_type',
    validate: {
      isIn: [['bar', 'restaurant', 'wine_shop', 'wine_bar', 'winery', 'tasting_room', 'other']]
    },
    defaultValue: 'bar'
  },

  // Profile
  description: {
    type: DataTypes.TEXT
  },
  website: {
    type: DataTypes.STRING(500)
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true
    }
  },
  instagram: {
    type: DataTypes.STRING(100)
  },

  // Verification
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  verifiedByUserId: {
    type: DataTypes.UUID,
    field: 'verified_by_user_id'
  },
  verifiedAt: {
    type: DataTypes.DATE,
    field: 'verified_at'
  },
  isOwner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_owner'
  },
  ownerUserId: {
    type: DataTypes.UUID,
    field: 'owner_user_id'
  },
  claimedAt: {
    type: DataTypes.DATE,
    field: 'claimed_at'
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
  communityVerifications: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'community_verifications'
  },

  // Images
  photoUrls: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'photo_urls'
  },

  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  tableName: 'venues',
  paranoid: true,
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['city', 'country'] },
    { fields: ['venue_type'] },
    { fields: ['is_verified'] },
    { type: 'GIST', fields: ['coordinates'] }
  ]
});

module.exports = Venue;
