const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    console.log("Fetched students:", students); 
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Get students by class name
router.get('/class/:className', async (req, res) => {
  try {
    const students = await Student.find({ className: req.params.className }); // or classId if that's your field
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Update marks by class name
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          department: req.body.department,
          className: req.body.className,
          subjects: req.body.subjects,
        }
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;