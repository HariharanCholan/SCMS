const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz'); // make sure this model exists

router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
