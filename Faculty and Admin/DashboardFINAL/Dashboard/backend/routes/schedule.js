const express = require('express');
const router = express.Router();
const {
  getAdminSchedule,
  addSchedule,
  deleteSchedule, // Optional
} = require('../controllers/scheduleController');

router.get('/', getAdminSchedule);
router.post('/', addSchedule);       // NEW: Add schedule
router.delete('/:id', deleteSchedule); // Optional: Delete schedule

module.exports = router;
