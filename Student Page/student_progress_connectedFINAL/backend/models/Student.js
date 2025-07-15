const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  performance: [
    {
      month: String,
      score: Number
    }
  ],
  subjects: [
    {
      subject: String,
      score: Number,
      maxScore: Number,
      status: String
    }
  ],
  cgpaHistory: [
    {
      semester: String,
      gpa: Number,
      date: String
    }
  ]
});

module.exports = mongoose.model('Student', StudentSchema);
