const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  date: String,
  timeSlot: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
