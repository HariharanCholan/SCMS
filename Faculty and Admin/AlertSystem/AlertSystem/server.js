import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';

// Setup
const app = express();
const PORT = 8005;

app.use(cors());
app.use(bodyParser.json());

// File path to store alarm state persistently
const alarmFilePath = path.resolve('./alarm-status.json');

// Ensure the alarm status file exists with default value
function ensureAlarmFileExists() {
  if (!fs.existsSync(alarmFilePath)) {
    fs.writeFileSync(alarmFilePath, JSON.stringify({ isActive: false }));
  }
}

// Read current alarm status
function getAlarmStatus() {
  ensureAlarmFileExists();
  try {
    const data = JSON.parse(fs.readFileSync(alarmFilePath, 'utf-8'));
    return !!data.isActive;
  } catch (err) {
    console.error('Error reading alarm status:', err);
    return false;
  }
}

// Write alarm status to file
function setAlarmStatus(status) {
  try {
    fs.writeFileSync(alarmFilePath, JSON.stringify({ isActive: !!status }));
  } catch (err) {
    console.error('Error writing alarm status:', err);
  }
}

// GET: Fetch current alarm status
app.get('/api/alarm-status', (req, res) => {
  const isActive = getAlarmStatus();
  res.json({ isActive });
});

// POST: Update alarm status (toggle on/off using "active": true/false)
app.post('/api/alarm-status', (req, res) => {
  const { active } = req.body;
  const status = !!active;
  setAlarmStatus(status);
  console.log(`🔄 Alarm status set to: ${status}`);
  res.json({ success: true, isActive: status });
});

// POST: Shortcut to turn ON the alarm
app.post('/api/alarm-on', (req, res) => {
  setAlarmStatus(true);
  console.log('🔥 Alarm activated via /api/alarm-on');
  res.json({ success: true, isActive: true });
});

// POST: Shortcut to turn OFF the alarm
app.post('/api/alarm-off', (req, res) => {
  setAlarmStatus(false);
  console.log('🛑 Alarm deactivated via /api/alarm-off');
  res.json({ success: true, isActive: false });
});

// Start the server
app.listen(PORT, () => {
  ensureAlarmFileExists();
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
