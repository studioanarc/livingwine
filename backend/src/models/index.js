const User = require('./User');
const Producer = require('./Producer');
const Wine = require('./Wine');
const CheckIn = require('./CheckIn');
const Venue = require('./Venue');

// Define associations

// User associations
User.hasMany(CheckIn, { foreignKey: 'userId', as: 'checkins' });
User.hasMany(Wine, { foreignKey: 'createdByUserId', as: 'winesCreated' });

// Producer associations
Producer.hasMany(Wine, { foreignKey: 'producerId', as: 'wines' });
Producer.belongsTo(User, { foreignKey: 'claimedByUserId', as: 'claimedBy' });

// Wine associations
Wine.belongsTo(Producer, { foreignKey: 'producerId', as: 'producer' });
Wine.hasMany(CheckIn, { foreignKey: 'wineId', as: 'checkins' });
Wine.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

// CheckIn associations
CheckIn.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CheckIn.belongsTo(Wine, { foreignKey: 'wineId', as: 'wine' });

// Venue associations
Venue.belongsTo(User, { foreignKey: 'ownerUserId', as: 'owner' });
Venue.belongsTo(User, { foreignKey: 'verifiedByUserId', as: 'verifiedBy' });

module.exports = {
  User,
  Producer,
  Wine,
  CheckIn,
  Venue
};
