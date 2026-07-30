const User = require('./User');
const Movie = require('./Movie');
const Screen = require('./Screen');
const Seat = require('./Seat');
const Show = require('./Show');
const Booking = require('./Booking');
const FoodItem = require('./FoodItem');
const Offer = require('./Offer');

function initAssociations() {
  // Screen - Seat relationship
  Screen.hasMany(Seat, { foreignKey: { name: 'screenId', allowNull: false }, onDelete: 'CASCADE' });
  Seat.belongsTo(Screen, { foreignKey: { name: 'screenId', allowNull: false } });

  // Movie - Show relationship
  Movie.hasMany(Show, { foreignKey: { name: 'movieId', allowNull: false }, onDelete: 'CASCADE' });
  Show.belongsTo(Movie, { foreignKey: { name: 'movieId', allowNull: false }, as: 'movieId' });

  // Screen - Show relationship
  Screen.hasMany(Show, { foreignKey: { name: 'screenId', allowNull: false }, onDelete: 'CASCADE' });
  Show.belongsTo(Screen, { foreignKey: { name: 'screenId', allowNull: false }, as: 'screenId' });

  // User - Booking relationship
  User.hasMany(Booking, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
  Booking.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, as: 'userId' });

  // Show - Booking relationship
  Show.hasMany(Booking, { foreignKey: { name: 'showId', allowNull: false }, onDelete: 'CASCADE' });
  Booking.belongsTo(Show, { foreignKey: { name: 'showId', allowNull: false }, as: 'showId' });
}

module.exports = initAssociations;
