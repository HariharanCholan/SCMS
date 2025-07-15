const mongoose = require('mongoose');

const cgpaHistorySchema = new mongoose.Schema({
  studentId: String,
  cgpaData: [
    {
      semester: String,
      cgpa: Number
    }
  ]
});

module.exports = mongoose.model('CGPAHistory', cgpahistorySchema);
