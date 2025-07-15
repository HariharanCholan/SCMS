const express = require('express');
const router = express.Router();

// Replace this with MongoDB query logic
router.get('/performance', async (req, res) => {
  try {
    // Fetch from MongoDB here
    res.json([
      { month: 'Jan', score: 70 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 80 },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

router.get('/subjects', async (req, res) => {
  try {
    res.json([
      { subject: 'Math', score: 90 },
      { subject: 'Physics', score: 85 },
      { subject: 'Chemistry', score: 88 },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subject scores' });
  }
});

router.get('/cgpahistory', async (req, res) => {
  try {
    res.json([
      { semester: 1, cgpa: 7.5 },
      { semester: 2, cgpa: 7.8 },
      { semester: 3, cgpa: 8.0 },
    ]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CGPA history' });
  }
});

module.exports = router;
