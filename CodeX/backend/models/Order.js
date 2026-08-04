import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String, // Stored as a string to accommodate potential custom format or MongoDB ObjectId
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const shippingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true }
});

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    type: shippingInfoSchema,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: [v => v.length > 0, 'An order must contain at least one item']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 15.0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['upi', 'cod']
  },
  upiId: {
    type: String,
    required: function() { return this.paymentMethod === 'upi'; }
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
