// backend/models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema, 'Attendance');

export default Attendance;
