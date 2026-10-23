// backend/routes/progressRoutes.js
import express from 'express';
import { Student, Performance, CGPAHistory, Subject } from '../models/StudentProgress.js';

const router = express.Router();

// 1. All students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('❌ Error in /api/students:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 2. Single student by ID
router.get('/student/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('❌ Error in /api/student/:id:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 3. Performance from performances collection
router.get('/performance', async (req, res) => {
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

// 4. Subjects from subjects collection (includes quiz scores dynamically)
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ date: -1 });
    res.json(subjects);
  } catch (err) {
    console.error('❌ Error in /api/subjects:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 5. CGPA history
router.get('/cgpahistory', async (req, res) => {
  try {
    const cgpaHistories = await CGPAHistory.find();
    res.json(cgpaHistories);
  } catch (err) {
    console.error('❌ Error in /api/cgpahistory:', err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
