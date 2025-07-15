const express = require('express');
const router = express.Router();
const Class = require('../models/class'); // make sure this model exists

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
