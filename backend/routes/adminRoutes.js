// backend/routes/adminRoutes.js
import express from 'express';
import { getAdminModels } from '../models/AdminManagement.js';
import { getUserModels } from '../models/User.js';

const router = express.Router();

// ===== CLASSROOMS =====
router.get('/classrooms', async (req, res) => {
  try {
    const { Classroom } = getAdminModels();
    const classrooms = await Classroom.find({});
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/classrooms', async (req, res) => {
  try {
    const { Classroom } = getAdminModels();
    const newClassroom = new Classroom(req.body);
    await newClassroom.save();
    res.status(201).json(newClassroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== BOOKINGS =====
router.get('/bookings', async (req, res) => {
  try {
    const { Booking } = getAdminModels();
    const bookings = await Booking.find({}).populate('roomId').populate('facultyId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const { Booking } = getAdminModels();
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    const { Booking } = getAdminModels();
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SCHEDULE =====
router.get('/schedule', async (req, res) => {
  try {
    const { Schedule } = getAdminModels();
    const schedules = await Schedule.find({});
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/schedule/:id', async (req, res) => {
  try {
    const { Schedule } = getAdminModels();
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const { Schedule } = getAdminModels();
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ADMIN STUDENTS LIST =====
router.get('/students', async (req, res) => {
  try {
    const { Student } = getUserModels();
    const students = await Student.find({}, { password: 0 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
