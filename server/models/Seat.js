const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  screenId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  row: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Standard', 'Premium', 'Recliner'),
    defaultValue: 'Standard'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['screenId', 'row', 'number']
    }
  ]
});

// Map id to _id for frontend compatibility
Seat.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Seat;
