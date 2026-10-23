// backend/models/AdminManagement.js
import mongoose from 'mongoose';
import { authConnection } from '../config/db.js';

const classroomSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['Classroom', 'Conference', 'Lab', 'Auditorium'] },
  status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  capacity: Number,
  location: String,
  block: String,
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  date: String,
  timeSlot: String,
  createdAt: { type: Date, default: Date.now },
});

const scheduleSchema = new mongoose.Schema({
  classroom: { type: String, required: true },
  roomName: { type: String },
  roomType: { type: String },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const getAdminModels = () => {
  const conn = authConnection || mongoose;
  const Classroom = conn.models.Classroom || conn.model('Classroom', classroomSchema);
  const Booking = conn.models.Booking || conn.model('Booking', bookingSchema);
  const Schedule = conn.models.Schedule || conn.model('Schedule', scheduleSchema);
  return { Classroom, Booking, Schedule };
};
