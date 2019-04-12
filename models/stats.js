const mongoose = require('mongoose');

// Set schema for statistics
const StatsSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  scores: [{
    percentage: Number,
    date: {type: Date, default: Date.now}
  }]
});

const Stats = mongoose.model('Stats', StatsSchema, 'stats');
module.exports = Stats;
