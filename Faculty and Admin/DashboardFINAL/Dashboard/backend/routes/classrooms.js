const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');

// GET all classrooms
router.get('/', async (req, res) => {
  const classrooms = await Classroom.find();
  res.json(classrooms);
});

// POST create a classroom
router.post('/', async (req, res) => {
  const classroom = new Classroom(req.body);
  await classroom.save();
  res.status(201).json(classroom);
});

// PUT update classroom status or assignment
router.put('/:id', async (req, res) => {
  try {
    const updatedRoom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE classroom
router.delete('/:id', async (req, res) => {
  await Classroom.findByIdAndDelete(req.params.id);
  res.json({ message: 'Classroom deleted' });
});

module.exports = router;
