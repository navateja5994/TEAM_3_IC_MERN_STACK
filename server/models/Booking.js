const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  showId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  seats: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const value = this.getDataValue('seats');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('seats', JSON.stringify(value));
    }
  },
  foodItems: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('foodItems');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('foodItems', JSON.stringify(value));
    }
  },
  ticketSubtotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  foodSubtotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  convenienceFee: {
    type: DataTypes.FLOAT,
    defaultValue: 30
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Cancelled'),
    defaultValue: 'Pending'
  },
  bookingStatus: {
    type: DataTypes.ENUM('Booked', 'Cancelled'),
    defaultValue: 'Booked'
  },
  qrCodeUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

// Map id to _id for frontend compatibility
Booking.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = Booking;
