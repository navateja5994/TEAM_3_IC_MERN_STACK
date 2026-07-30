const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  numRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genres: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('genres');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('genres', JSON.stringify(value));
    }
  },
  certificate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  formats: {
    type: DataTypes.TEXT,
    defaultValue: '["2D"]',
    get() {
      const value = this.getDataValue('formats');
      return value ? JSON.parse(value) : ['2D'];
    },
    set(value) {
      this.setDataValue('formats', JSON.stringify(value));
    }
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  backdropUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trailerUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  cast: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('cast');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('cast', JSON.stringify(value));
    }
  },
  crew: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('crew');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('crew', JSON.stringify(value));
    }
  },
  status: {
    type: DataTypes.ENUM('Now Showing', 'Coming Soon', 'Featured', 'Trending'),
    defaultValue: 'Now Showing'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

// Map id to _id for frontend compatibility
Movie.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Movie;
