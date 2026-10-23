// backend/models/StudentProgress.js
import mongoose from 'mongoose';

// 1. Student Schema
const StudentSchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  performance: [
    {
      month: String,
      score: Number,
    },
  ],
  subjects: [
    {
      subject: String,
      score: Number,
      maxScore: Number,
      status: String,
    },
  ],
});

export const Student =
  mongoose.models.StudentProgressUser || mongoose.model('StudentProgressUser', StudentSchema, 'students');

// 2. Performance Schema
const MonthlyPerformanceSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
);

const PerformanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  performance: [MonthlyPerformanceSchema],
});

export const Performance =
  mongoose.models.Performance || mongoose.model('Performance', PerformanceSchema, 'performances');

// 3. CGPA History Schema
const CgpaHistorySchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  semester: String,
  cgpa: Number,
  cgpaHistory: [
    {
      semester: String,
      gpa: Number,
      date: String,
    },
  ],
});

export const CGPAHistory =
  mongoose.models.CGPAHistory || mongoose.model('CGPAHistory', CgpaHistorySchema, 'cgpahistories');

// 4. Subject Schema
const SubjectSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Subject =
  mongoose.models.Subject || mongoose.model('Subject', SubjectSchema, 'subjects');
