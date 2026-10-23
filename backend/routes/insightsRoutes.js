// backend/routes/insightsRoutes.js
import express from 'express';
import { StudentInsight, ClassInsight, QuizInsight } from '../models/StudentInsights.js';

const router = express.Router();

// 1. Get all students with marks
router.get('/student', async (req, res) => {
  try {
    const students = await StudentInsight.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching insight students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Alias for convenience
router.get('/students', async (req, res) => {
  try {
    const students = await StudentInsight.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. Add new student
router.post('/student', async (req, res) => {
  try {
    const student = new StudentInsight(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating insight student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// 3. Get students by class name
router.get('/student/class/:className', async (req, res) => {
  try {
    const students = await StudentInsight.find({ className: req.params.className });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. Update student marks by ID
router.put('/student/:id', async (req, res) => {
  try {
    const updated = await StudentInsight.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          department: req.body.department,
          className: req.body.className,
          subjects: req.body.subjects,
        },
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get classes list
router.get('/classes', async (req, res) => {
  try {
    const classes = await ClassInsight.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Get quizzes list
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await QuizInsight.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
