const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producer = sequelize.define('Producer', {
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
    allowNull: false,
    unique: true
  },

  // Location
  country: {
    type: DataTypes.STRING(100)
  },
  region: {
    type: DataTypes.STRING(100)
  },
  subRegion: {
    type: DataTypes.STRING(100),
    field: 'sub_region'
  },
  address: {
    type: DataTypes.TEXT
  },
  coordinates: {
    type: DataTypes.GEOMETRY('POINT')
  },

  // Profile
  description: {
    type: DataTypes.TEXT
  },
  philosophy: {
    type: DataTypes.TEXT
  },
  yearFounded: {
    type: DataTypes.INTEGER,
    field: 'year_founded'
  },
  winemakerName: {
    type: DataTypes.STRING(100),
    field: 'winemaker_name'
  },

  // Contact
  website: {
    type: DataTypes.STRING(500)
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  instagram: {
    type: DataTypes.STRING(100)
  },

  // Verification
  isClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_claimed'
  },
  claimedByUserId: {
    type: DataTypes.UUID,
    field: 'claimed_by_user_id'
  },
  claimedAt: {
    type: DataTypes.DATE,
    field: 'claimed_at'
  },

  // Certifications (stored as JSON array)
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  certificationDocuments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    field: 'certification_documents'
  },

  // Stats
  totalWines: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_wines'
  },
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
  logoUrl: {
    type: DataTypes.STRING(500),
    field: 'logo_url'
  },
  coverPhotoUrl: {
    type: DataTypes.STRING(500),
    field: 'cover_photo_url'
  },
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
  tableName: 'producers',
  paranoid: true,
  indexes: [
    { unique: true, fields: ['slug'] },
    { fields: ['country', 'region'] },
    { fields: ['is_claimed'] },
    { type: 'GIST', fields: ['coordinates'] }
  ]
});

module.exports = Producer;
