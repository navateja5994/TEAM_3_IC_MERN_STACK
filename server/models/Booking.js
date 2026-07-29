const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
  bookingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  seats: {
    type: [String], // e.g. ['A1', 'A2']
    required: true
  },
  foodItems: [{
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  ticketSubtotal: {
    type: Number,
    required: true
  },
  foodSubtotal: {
    type: Number,
    default: 0
  },
  convenienceFee: {
    type: Number,
    required: true,
    default: 30 // Flat fee
  },
  tax: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  bookingStatus: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked'
  },
  qrCodeUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
