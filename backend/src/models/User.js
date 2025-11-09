const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  fullName: {
    type: DataTypes.STRING(100),
    field: 'full_name'
  },
  bio: {
    type: DataTypes.TEXT
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    field: 'avatar_url'
  },
  location: {
    type: DataTypes.STRING(100)
  },
  locationCoordinates: {
    type: DataTypes.GEOMETRY('POINT'),
    field: 'location_coordinates'
  },

  // Settings
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_private'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified'
  },

  // Reputation
  credibilityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    field: 'credibility_score'
  },
  userLevel: {
    type: DataTypes.STRING(20),
    defaultValue: 'explorer',
    field: 'user_level',
    validate: {
      isIn: [['explorer', 'enthusiast', 'advocate', 'steward']]
    }
  },

  // Stats
  totalCheckins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_checkins'
  },
  totalUniqueWines: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_unique_wines'
  },
  totalContributions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_contributions'
  },

  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  tableName: 'users',
  paranoid: true, // Enables soft delete
  indexes: [
    { unique: true, fields: ['username'] },
    { unique: true, fields: ['email'] },
    { fields: ['user_level'] },
    { fields: ['created_at'] }
  ]
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.passwordHash;
  delete values.deletedAt;
  return values;
};

// Class methods
User.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

module.exports = User;
