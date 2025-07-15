// backend/routes/alarm.js

const express = require('express');
const router = express.Router();

let isAlarmActive = false;

// GET: Check alarm status
router.get('/alarm-status', (req, res) => {
  res.json({ isActive: isAlarmActive });
});

// POST: Set alarm status (e.g., from admin)
router.post('/alarm-status', (req, res) => {
  const { active } = req.body;
  isAlarmActive = !!active;
  res.json({ success: true, isActive });
});

// POST: Turn OFF alarm (used by student or admin stop button)
router.post('/alarm-off', (req, res) => {
  isAlarmActive = false;
  res.json({ success: true, isActive: false });
});

module.exports = router;
