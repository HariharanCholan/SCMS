const express = require('express');
const router = express.Router();
const Subject = require('../models/subject'); // Uses your proper Subject model

// GET /api/subjects - Fetch all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({}).sort({ date: -1 });
    res.json(subjects);
  } catch (err) {
    console.error('❌ Error fetching subjects:', err.message);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

module.exports = router;
