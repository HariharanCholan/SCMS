const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
require('../models/Faculty');
require('../models/Classroom');

// GET all bookings
router.get('/', async (req, res) => {
  const bookings = await Booking.find()
    .populate('roomId')
    .populate('facultyId', 'name');
  res.json(bookings);
});

// POST create booking
router.post('/', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).json(booking);
});

module.exports = router;
