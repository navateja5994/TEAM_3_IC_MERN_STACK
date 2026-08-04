import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  notes: {
    type: [String],
    required: true,
    default: []
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 5
  },
  reviews: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  concentration: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women'],
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
