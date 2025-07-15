const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8003;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Optional Student Routes (load only if file exists)
try {
  const studentRoutes = require('./routes/student');
  app.use('/api/students', studentRoutes);
} catch (err) {
  console.warn('⚠️ /routes/student.js not found — skipping student routes');
}

// ✅ Attendance Routes
const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('🎉 Server is running');
});

// ✅ Catch-all Route (404)
app.use((req, res) => {
  res.status(404).json({ error: '❌ Route not found' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
