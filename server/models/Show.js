const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Show = sequelize.define('Show', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: DataTypes.STRING, // format YYYY-MM-DD
    allowNull: false
  },
  time: {
    type: DataTypes.STRING, // e.g. '10:00 AM'
    allowNull: false
  },
  prices: {
    type: DataTypes.TEXT,
    defaultValue: '{"Standard": 150, "Premium": 250, "Recliner": 400}',
    get() {
      const value = this.getDataValue('prices');
      return value ? JSON.parse(value) : { Standard: 150, Premium: 250, Recliner: 400 };
    },
    set(value) {
      this.setDataValue('prices', JSON.stringify(value));
    }
  },
  bookedSeats: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('bookedSeats');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('bookedSeats', JSON.stringify(value));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['screenId', 'date', 'time']
    }
  ]
});

// Map id to _id for frontend compatibility
Show.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Show;
