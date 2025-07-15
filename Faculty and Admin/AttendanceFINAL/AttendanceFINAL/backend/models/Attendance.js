// models/Attendance.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define schema
const attendanceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    index: true  // 🔍 Helps optimize queries by date
  }
}, {
  timestamps: true  // ✅ Adds createdAt and updatedAt fields
});

// Export model
module.exports = mongoose.model('Attendance', attendanceSchema);
