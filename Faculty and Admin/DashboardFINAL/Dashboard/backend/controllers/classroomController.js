// backend/controllers/classroomController.js
const Classroom = require('../models/Classroom');

// GET all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new classroom
exports.createClassroom = async (req, res) => {
  try {
    const classroom = new Classroom(req.body);
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update classroom details
exports.updateClassroom = async (req, res) => {
  try {
    const updated = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a classroom
exports.deleteClassroom = async (req, res) => {
  try {
    await Classroom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Classroom deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
