const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5175', // your frontend origin
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));

console.log("MONGO_URI:", process.env.MONGO_URI);

// ✅ DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(8002, () => console.log("🚀 Server running on http://localhost:8002"));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
