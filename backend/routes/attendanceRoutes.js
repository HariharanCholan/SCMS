// backend/routes/attendanceRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Define schemas for Fingerprint and Filtered Sessions
const filteredSchema = new mongoose.Schema({
  sessionStart: { type: Date, required: true },
  attendees: [
    {
      fingerId: Number,
      name: String,
      status: String,
      timestamp: Date,
    },
  ],
});
const FilteredAttendance =
  mongoose.models.Filtered_Attendance || mongoose.model('Filtered_Attendance', filteredSchema, 'Filtered_Attendance');

const enrollmentSchema = new mongoose.Schema({
  fingerId: { type: Number, unique: true, required: true },
  name: { type: String, default: null },
  status: { type: String, default: 'enrolled' },
  registeredAt: { type: Date, default: Date.now },
});
const EnrolledFinger =
  mongoose.models.Enrolled_Finger || mongoose.model('Enrolled_Finger', enrollmentSchema, 'Enrolled_Finger');

const studentNameSchema = new mongoose.Schema({
  name: String,
});
const StudentName =
  mongoose.models.AttendanceStudent || mongoose.model('AttendanceStudent', studentNameSchema, 'students');

// 1. Submit new attendance
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
    console.error('❌ Attendance submission error:', err);
    res.status(500).json({ error: 'Failed to submit attendance' });
  }
});

// 2. Get all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// 3. Get students for attendance selection
router.get('/students', async (req, res) => {
  try {
    const students = await StudentName.find({}, 'name');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// 4. Latest attendance session
router.get('/latest', async (req, res) => {
  try {
    const session = await FilteredAttendance.findOne().sort({ sessionStart: -1 });
    if (!session) return res.status(404).json({ error: 'No attendance session found' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve latest session' });
  }
});

// 5. All attendance sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await FilteredAttendance.find().sort({ sessionStart: -1 });
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

// 6. Absentees from latest session
router.get('/absentees/latest', async (req, res) => {
  try {
    const session = await FilteredAttendance.findOne().sort({ sessionStart: -1 });
    if (!session) return res.status(404).json({ error: 'No attendance session found' });

    const allEnrolled = await EnrolledFinger.find();
    const presentIds = (session.attendees || []).map((att) => att.fingerId);

    const absentees = allEnrolled
      .filter((stud) => !presentIds.includes(stud.fingerId))
      .map((absent) => ({
        fingerId: absent.fingerId,
        name: absent.name || `ID ${absent.fingerId}`,
        status: 'Absent',
      }));

    res.json({ date: session.sessionStart, absentees });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve absentees' });
  }
});

// 7. Absentees for all sessions
router.get('/absentees/sessions', async (req, res) => {
  try {
    const sessions = await FilteredAttendance.find().sort({ sessionStart: -1 });
    const enrolled = await EnrolledFinger.find();

    const allAbsentees = sessions.map((session) => {
      const presentIds = (session.attendees || []).map((att) => att.fingerId);
      const absentees = enrolled
        .filter((stud) => !presentIds.includes(stud.fingerId))
        .map((absent) => ({
          fingerId: absent.fingerId,
          name: absent.name || `ID ${absent.fingerId}`,
          status: 'Absent',
        }));

      return {
        sessionId: session._id,
        sessionStart: session.sessionStart,
        absentees,
      };
    });

    res.json({ success: true, sessions: allAbsentees });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch absentee sessions' });
  }
});

// 8. Today's attendance
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const session = await FilteredAttendance.findOne({
      sessionStart: { $gte: today, $lt: tomorrow },
    }).sort({ sessionStart: -1 });

    if (!session) {
      // Fallback check in regular Attendance collection
      const todayRecords = await Attendance.find({
        date: { $gte: today, $lt: tomorrow },
      });
      const present = todayRecords.filter((r) => r.status === 'Present');
      const absent = todayRecords.filter((r) => r.status === 'Absent');
      return res.json({ sessionStart: new Date(), present, absent });
    }

    const allEnrolled = await EnrolledFinger.find();
    const present = session.attendees || [];
    const presentIds = present.map((p) => p.fingerId);
    const absent = allEnrolled
      .filter((stud) => !presentIds.includes(stud.fingerId))
      .map((abs) => ({
        fingerId: abs.fingerId,
        name: abs.name || `ID ${abs.fingerId}`,
        status: 'Absent',
      }));

    res.json({ sessionStart: session.sessionStart, present, absent });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's attendance" });
  }
});

// 9. Update an attendance record
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid attendance ID' });
    }
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// 10. Delete by date
router.delete('/date/:date', async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    targetDate.setUTCHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setUTCDate(targetDate.getUTCDate() + 1);

    const result = await Attendance.deleteMany({
      date: { $gte: targetDate, $lt: nextDate },
    });
    res.json({ message: 'Deleted', count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
