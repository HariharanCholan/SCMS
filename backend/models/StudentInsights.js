// backend/models/StudentInsights.js
import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  name: String,
  marks: Number,
});

const StudentInsightSchema = new mongoose.Schema({
  name: String,
  classId: String,
  className: String,
  department: String,
  subjects: [SubjectSchema],
});

const ClassInsightSchema = new mongoose.Schema({
  name: String,
  teacher: String,
});

const QuizInsightSchema = new mongoose.Schema({
  title: String,
  subject: String,
  totalMarks: Number,
  date: { type: Date, default: Date.now },
});

export const StudentInsight =
  mongoose.models.InsightStudent || mongoose.model('InsightStudent', StudentInsightSchema, 'students');

export const ClassInsight =
  mongoose.models.InsightClass || mongoose.model('InsightClass', ClassInsightSchema, 'classes');

export const QuizInsight =
  mongoose.models.InsightQuiz || mongoose.model('InsightQuiz', QuizInsightSchema, 'quizzes');
