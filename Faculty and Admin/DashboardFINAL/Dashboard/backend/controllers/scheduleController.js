const Schedule = require('../models/Schedule'); // Make sure this is already imported

// GET: Get all schedules
const getAdminSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schedules', error: err.message });
  }
};

// POST: Add new schedule
const addSchedule = async (req, res) => {
  try {
    const { classroom, roomName, roomType, date, timeSlot, subject, faculty } = req.body;
    const newSchedule = new Schedule({ classroom, roomName, roomType, date, timeSlot, subject, faculty });

    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add schedule', error: err.message });
  }
};

// DELETE: Remove a schedule (optional)
const deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

module.exports = {
  getAdminSchedule,
  addSchedule,
  deleteSchedule,
};
