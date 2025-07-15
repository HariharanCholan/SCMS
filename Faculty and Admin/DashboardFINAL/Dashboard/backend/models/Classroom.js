const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['Classroom', 'Conference', 'Lab', 'Auditorium'] },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  capacity: Number,
  location: String,
  block: String,
  assignedTo: String,
  createdAt: { type: Date, default: Date.now }
});
 
module.exports = mongoose.model('Classroom', classroomSchema);
