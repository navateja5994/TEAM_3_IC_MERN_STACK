const mongoose = require('mongoose');

const CastSchema = new mongoose.Schema({
  name: { type: String, required: true },
  character: { type: String, required: true },
  imageUrl: { type: String, default: '' }
});

const CrewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, default: '' }
});

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  numRatings: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  genres: {
    type: [String],
    required: true
  },
  certificate: {
    type: String,
    required: true,
    trim: true
  },
  formats: {
    type: [String], // e.g. ['2D', '3D', 'IMAX', '4DX']
    default: ['2D']
  },
  releaseDate: {
    type: Date,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  backdropUrl: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  cast: [CastSchema],
  crew: [CrewSchema],
  status: {
    type: String,
    enum: ['Now Showing', 'Coming Soon', 'Featured', 'Trending'],
    default: 'Now Showing'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);
