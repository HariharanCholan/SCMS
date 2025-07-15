const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  maxScore: Number,
});

module.exports = mongoose.model('Quiz', quizSchema);
