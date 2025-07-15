// routes/performance.js
const express = require('express');
const router = express.Router();
const Performance = require('../models/performance');

router.get('/', async (req, res) => {
  try {
    const records = await Performance.find().lean();
    const monthly = records.flatMap(r =>
      Array.isArray(r.performance)
        ? r.performance.filter(p => p.month && typeof p.score === 'number')
        : []
    );
    return res.json(monthly);
  } catch (err) {
    console.error('Error fetching performance:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
