const mongoose = require('mongoose');

const filteredSchema = new mongoose.Schema({
  sessionStart: {
    type: Date,
    required: true,
  },
  attendees: [
    {
      fingerId: Number,
      name: String,
      status: String,
      timestamp: Date,
    },
  ],
});

const FilteredAttendance = mongoose.model("Filtered_Attendance", filteredSchema);
module.exports = FilteredAttendance;
