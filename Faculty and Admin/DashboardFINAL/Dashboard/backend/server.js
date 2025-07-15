// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

require('./models/Faculty');

const classroomRoutes = require('./routes/classrooms');
const bookingRoutes = require('./routes/bookings');
const studentRoutes = require('./routes/students');
const scheduleRoutes = require('./routes/schedule');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/classrooms', classroomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/schedule', scheduleRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
