const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  collegeAddress: {
    type: String,
    required: true
  }
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;
