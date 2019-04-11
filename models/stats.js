const mongoose = require('mongoose');

// Set schema for quiz questions
const StatsSchema = new mongoose.Schema({
  gameType: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  scores: [{
    score: Number,
    date: {type: Date, default: Date.now}
  }]
});

const Stats = mongoose.model('Stats', StatsSchema, 'stats');
module.exports = Stats;
