const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: String,
  teacher: String,
});

module.exports = mongoose.model('Class', classSchema);
