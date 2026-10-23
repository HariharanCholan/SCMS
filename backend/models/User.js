// backend/models/User.js
import mongoose from 'mongoose';
import { authConnection } from '../config/db.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      required: true,
      default: 'student',
    },
  },
  { timestamps: true }
);

// Helper to get or compile models on specific connection
export const getUserModels = () => {
  const conn = authConnection || mongoose;
  const Student = conn.models.Student || conn.model('Student', userSchema, 'students');
  const Faculty = conn.models.Faculty || conn.model('Faculty', userSchema, 'faculties');
  const Admin = conn.models.Admin || conn.model('Admin', userSchema, 'admins');
  const User = conn.models.User || conn.model('User', userSchema, 'users');
  return { Student, Faculty, Admin, User };
};
