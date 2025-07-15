// backend/routes/students.js
const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../controllers/studentController');

router.get('/', getAllStudents);

module.exports = router;
