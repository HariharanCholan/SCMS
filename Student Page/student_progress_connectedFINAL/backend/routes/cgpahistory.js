const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ✅ Define schema for standalone cgpahistory collection
const CgpaHistorySchema = new mongoose.Schema({
  semester: { type: String, required: true },
  cgpa: { type: Number, required: true },
  date: { type: String, default: () => new Date().toISOString() }
}, { collection: 'cgpahistory' });

// ✅ Prevent model overwrite error
const CgpaHistory = mongoose.models.CgpaHistory || mongoose.model('CgpaHistory', CgpaHistorySchema);

// ✅ GET /api/cgpahistory - Fetch all CGPA records
router.get('/', async (req, res) => {
  try {
    const records = await CgpaHistory.find().sort({ semester: 1 });

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'No CGPA records found.' });
    }

    console.log('📊 Sending standalone CGPA history:', JSON.stringify(records, null, 2));
    res.status(200).json(records);
  } catch (err) {
    console.error('❌ Error fetching CGPA history from standalone collection:', err.message);
    res.status(500).json({ message: 'Server error while retrieving CGPA history.' });
  }
});

// ✅ POST /api/cgpahistory - Add a new CGPA record
router.post('/', async (req, res) => {
  const { semester, cgpa, date } = req.body;

  if (!semester || typeof cgpa !== 'number') {
    return res.status(400).json({ message: 'Semester and CGPA are required fields.' });
  }

  try {
    const newRecord = new CgpaHistory({
      semester,
      cgpa,
      date: date || new Date().toISOString(),
    });

    await newRecord.save();
    console.log('✅ New CGPA record saved:', newRecord);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error saving CGPA record:', err.message);
    res.status(500).json({ message: 'Failed to save CGPA record.' });
  }
});

// ✅ DELETE /api/cgpahistory/:id - Delete CGPA record by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await CgpaHistory.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'CGPA record not found.' });
    }
    console.log('🗑️ CGPA record deleted:', result);
    res.status(200).json({ message: 'CGPA record deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting CGPA record:', err.message);
    res.status(500).json({ message: 'Failed to delete CGPA record.' });
  }
});

module.exports = router;
