// models/performance.js
const mongoose = require('mongoose');

const MonthlyPerformanceSchema = new mongoose.Schema({
  month: { type: String, required: true },
  score: { type: Number, required: true },
}, { _id: false });

const PerformanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  performance: [MonthlyPerformanceSchema],
});

module.exports = mongoose.model('Performance', PerformanceSchema, 'performances');
