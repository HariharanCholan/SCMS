const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Attendance = require('../models/Attendance'); // Legacy model
const EnrolledFinger = require('../models/EnrolledFinger');
const FilteredAttendance = require('../models/FilteredAttendance');

// ✅ Submit new attendance (legacy)
router.post('/submit', async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const entries = records.map(({ name, status }) => ({
      name,
      status,
      date: new Date(date),
    }));

    const savedRecords = await Attendance.insertMany(entries);
    res.status(201).json(savedRecords);
  } catch (err) {
    console.error("❌ Attendance submission error:", err);
    res.status(500).json({ error: 'Failed to submit attendance' });
  }
});

// ✅ Get all legacy attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// ✅ Get latest filtered attendance session
router.get('/latest', async (req, res) => {
  try {
    const session = await FilteredAttendance.findOne().sort({ sessionStart: -1 });
    if (!session) return res.status(404).json({ error: 'No attendance session found' });

    res.json({ success: true, session });
  } catch (err) {
    console.error('❌ Error fetching latest attendance session:', err);
    res.status(500).json({ error: 'Failed to retrieve latest session' });
  }
});

// ✅ Get all filtered attendance sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await FilteredAttendance.find().sort({ sessionStart: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

// ✅ Get absentees from latest session
router.get('/absentees/latest', async (req, res) => {
  try {
    const session = await FilteredAttendance.findOne().sort({ sessionStart: -1 });
    if (!session) return res.status(404).json({ error: 'No attendance session found' });

    const allEnrolled = await EnrolledFinger.find();
    const presentIds = session.attendees.map(att => att.fingerId);

    const absentees = allEnrolled
      .filter(stud => !presentIds.includes(stud.fingerId))
      .map(absent => ({
        fingerId: absent.fingerId,
        name: absent.name || `ID ${absent.fingerId}`,
        status: 'Absent',
      }));

    res.json({ date: session.sessionStart, absentees });
  } catch (err) {
    console.error('❌ Error fetching latest absentees:', err);
    res.status(500).json({ error: 'Failed to retrieve absentees' });
  }
});

// ✅ Get absentees for all sessions
router.get('/absentees/sessions', async (req, res) => {
  try {
    const sessions = await FilteredAttendance.find().sort({ sessionStart: -1 });
    const enrolled = await EnrolledFinger.find();

    const allAbsentees = sessions.map(session => {
      const presentIds = session.attendees.map(att => att.fingerId);
      const absentees = enrolled
        .filter(stud => !presentIds.includes(stud.fingerId))
        .map(absent => ({
          fingerId: absent.fingerId,
          name: absent.name || `ID ${absent.fingerId}`,
          status: 'Absent'
        }));

      return {
        sessionId: session._id,
        sessionStart: session.sessionStart,
        absentees
      };
    });

    res.json({ success: true, sessions: allAbsentees });
  } catch (err) {
    console.error("❌ Error fetching absentee sessions:", err);
    res.status(500).json({ error: "Failed to fetch absentee sessions" });
  }
});

// ✅ Get today's attendance (present and absent)
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const session = await FilteredAttendance.findOne({
      sessionStart: { $gte: today, $lt: tomorrow },
    }).sort({ sessionStart: -1 });

    if (!session) return res.status(404).json({ error: 'No session today' });

    const allEnrolled = await EnrolledFinger.find();
    const present = session.attendees;
    const presentIds = present.map(p => p.fingerId);
    const absent = allEnrolled.filter(stud => !presentIds.includes(stud.fingerId))
      .map(abs => ({
        fingerId: abs.fingerId,
        name: abs.name || `ID ${abs.fingerId}`,
        status: 'Absent'
      }));

    res.json({ sessionStart: session.sessionStart, present, absent });
  } catch (err) {
    console.error("❌ Error fetching today's attendance:", err);
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
});

// ✅ Update a legacy attendance record by ID
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }

    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating attendance record:", err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete legacy attendance by date
router.delete('/date/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setUTCDate(targetDate.getUTCDate() + 1);

    const result = await Attendance.deleteMany({
      date: { $gte: targetDate, $lt: nextDate },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No attendance found for the given date" });
    }

    res.json({ message: `Attendance for ${dateStr} deleted successfully.` });
  } catch (err) {
    console.error("❌ Error deleting attendance by date:", err);
    res.status(500).json({ error: "Failed to delete attendance by date" });
  }
});

// ✅ Delete legacy attendance by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }

    const result = await Attendance.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting attendance by ID:", err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ✅ Group legacy attendance history by date (for old Attendance model)
router.get('/history', async (req, res) => {
  try {
    const records = await Attendance.find();
    const grouped = {};

    records.forEach(record => {
      const dateStr = new Date(record.date).toISOString().split('T')[0];

      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          date: dateStr,
          present: 0,
          absent: 0,
          records: [],
        };
      }

      if (record.status === 'Present') grouped[dateStr].present++;
      if (record.status === 'Absent') grouped[dateStr].absent++;

      grouped[dateStr].records.push({
        name: record.name,
        status: record.status,
      });
    });

    const history = Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(history);
  } catch (err) {
    console.error('❌ Error fetching attendance history:', err);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

module.exports = router;
