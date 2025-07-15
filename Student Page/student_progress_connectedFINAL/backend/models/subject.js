const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, required: true }  // ✅ Important for frontend filtering/sorting
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema, 'subjects'); // 👈 Explicitly use 'subjects' collection
