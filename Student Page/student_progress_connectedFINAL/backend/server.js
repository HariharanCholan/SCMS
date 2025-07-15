const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8006;

// ✅ Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5180'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Student Schema & Model (Embedded version)
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

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

// ✅ Performance Schema & Model (Standalone)
const MonthlyPerformanceSchema = new mongoose.Schema(
  {
    month: String,
    score: Number,
  },
  { _id: false }
);

const PerformanceSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  performance: [MonthlyPerformanceSchema],
});

const Performance =
  mongoose.models.Performance || mongoose.model('Performance', PerformanceSchema, 'performances');

// ✅ CGPA History Schema & Model (Standalone)
const CgpaHistorySchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  cgpaHistory: [
    {
      semester: String,
      gpa: Number,
      date: String,
    },
  ],
});

const CGPAHistory =
  mongoose.models.CGPAHistory || mongoose.model('CGPAHistory', CgpaHistorySchema);

// ✅ Subject Schema & Model (Standalone)
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

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema, 'subjects');

// ✅ API Routes

// ➤ All students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('❌ Error in /api/students:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ➤ Single student by ID
app.get('/api/student/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('❌ Error in /api/student/:id:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ➤ Performance from "performances" collection
app.get('/api/performance', async (req, res) => {
  try {
    const records = await Performance.find().lean();
    const monthly = records.flatMap((r) =>
      Array.isArray(r.performance)
        ? r.performance.filter((p) => p.month && typeof p.score === 'number')
        : []
    );
    res.json(monthly);
  } catch (err) {
    console.error('❌ Error in /api/performance:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ➤ Subjects from "subjects" collection
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ date: -1 });
    res.json(subjects);
  } catch (err) {
    console.error('❌ Error in /api/subjects:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ➤ CGPA history
app.get('/api/cgpahistory', async (req, res) => {
  try {
    const cgpaHistories = await CGPAHistory.find();
    res.json(cgpaHistories);
  } catch (err) {
    console.error('❌ Error in /api/cgpahistory:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ➤ Health check
app.get('/', (req, res) => {
  res.send('🎯 Student Insights Backend API Running');
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
