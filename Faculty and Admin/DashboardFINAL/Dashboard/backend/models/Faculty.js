const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Add more fields as needed
});

module.exports = mongoose.model('Faculty', facultySchema);
