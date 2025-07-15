const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // make sure path is correct

// GET student data by studentId
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
