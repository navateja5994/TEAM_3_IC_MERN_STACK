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
  Screen.hasMany(Seat, { foreignKey: 'screenId', onDelete: 'CASCADE' });
  Seat.belongsTo(Screen, { foreignKey: 'screenId' });

  // Movie - Show relationship
  Movie.hasMany(Show, { foreignKey: 'movieId', onDelete: 'CASCADE' });
  Show.belongsTo(Movie, { foreignKey: 'movieId', as: 'movieId' }); // Alias to match Mongoose key

  // Screen - Show relationship
  Screen.hasMany(Show, { foreignKey: 'screenId', onDelete: 'CASCADE' });
  Show.belongsTo(Screen, { foreignKey: 'screenId', as: 'screenId' }); // Alias to match Mongoose key

  // User - Booking relationship
  User.hasMany(Booking, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Booking.belongsTo(User, { foreignKey: 'userId', as: 'userId' }); // Alias to match Mongoose key

  // Show - Booking relationship
  Show.hasMany(Booking, { foreignKey: 'showId', onDelete: 'CASCADE' });
  Booking.belongsTo(Show, { foreignKey: 'showId', as: 'showId' }); // Alias to match Mongoose key
}

module.exports = initAssociations;
