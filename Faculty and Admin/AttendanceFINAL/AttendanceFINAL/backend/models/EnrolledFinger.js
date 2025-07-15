const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  fingerId: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: "enrolled"
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const EnrolledFinger = mongoose.model("Enrolled_Finger", enrollmentSchema);
module.exports = EnrolledFinger;
