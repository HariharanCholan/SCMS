// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  avgScore: Number,
  quizzesCompleted: Number,
});

module.exports = mongoose.model('Student', studentSchema);
