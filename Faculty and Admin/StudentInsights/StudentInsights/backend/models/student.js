const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: String,
  marks: Number
});

const StudentSchema = new mongoose.Schema({
  name: String,
  classId: String,
  className: String,
  department: String,
  subjects: [SubjectSchema]
});

module.exports = mongoose.model('student', StudentSchema);