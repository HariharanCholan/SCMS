const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classroom: { type: String, required: true },
  roomName: { type: String },               // Optional
  roomType: { type: String },               // Optional
  date: { type: String, required: true },   // String if not using Date object
  timeSlot: { type: String, required: true },
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
