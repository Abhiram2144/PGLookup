const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pg',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  reviewDescription: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
