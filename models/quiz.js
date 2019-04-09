const mongoose = require('mongoose');

// Set schema for quiz questions
const QuizSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    unique: true
  },
  incorrect: [{
    type: String,
    required: true
  }],
  correct: {
    type: String,
    required: true
  }
});

const Quiz = mongoose.model('Quiz', QuizSchema, 'quiz');
module.exports = Quiz;
