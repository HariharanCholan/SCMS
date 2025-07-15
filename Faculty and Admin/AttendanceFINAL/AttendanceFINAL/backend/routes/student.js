const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({}, 'name'); // Only fetch names
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;
