const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  collegeIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'College',
  required: true
}],
  collegeNames: [{
    type: String,
    required: true
  }],
  pgName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  roomsVacant: {
    type: Number,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  images: {
    type: [String],
  },
  description: {
    type: String,
    required: true
  },
  reviews : {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review'
  },
  date: {
    type: Date,
    default: Date.now
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming your user model is named User
    required: true
  }
});

pgSchema.virtual('reviewsList', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'pgId'
});

pgSchema.set('toObject', { virtuals: true });
pgSchema.set('toJSON', { virtuals: true });

const Pg = mongoose.model('Pg', pgSchema);

module.exports = Pg;
