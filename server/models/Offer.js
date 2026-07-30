const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Offer = sequelize.define('Offer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxDiscount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

// Map id to _id for frontend compatibility
Offer.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Offer;
