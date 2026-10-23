// backend/routes/alertRoutes.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const alarmFilePath = path.resolve(__dirname, '../alarm-status.json');

// Ensure alarm file exists
function ensureAlarmFileExists() {
  if (!fs.existsSync(alarmFilePath)) {
    fs.writeFileSync(alarmFilePath, JSON.stringify({ isActive: false, updatedAt: new Date() }));
  }
}

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

function setAlarmStatus(status) {
  try {
    fs.writeFileSync(alarmFilePath, JSON.stringify({ isActive: !!status, updatedAt: new Date() }));
  } catch (err) {
    console.error('Error writing alarm status:', err);
  }
}

// 1. GET current alarm status
router.get('/alarm-status', (req, res) => {
  const isActive = getAlarmStatus();
  res.json({ isActive });
});

// 2. POST update alarm status
router.post('/alarm-status', (req, res) => {
  const { active, isActive: activeAlt } = req.body;
  const status = active !== undefined ? !!active : !!activeAlt;
  setAlarmStatus(status);
  console.log(`🔄 Alarm status set to: ${status}`);
  res.json({ success: true, isActive: status });
});

// 3. POST shortcut to turn ON
router.post('/alarm-on', (req, res) => {
  setAlarmStatus(true);
  console.log('🔥 Alarm activated via /api/alarm-on');
  res.json({ success: true, isActive: true });
});

// 4. POST shortcut to turn OFF
router.post('/alarm-off', (req, res) => {
  setAlarmStatus(false);
  console.log('🛑 Alarm deactivated via /api/alarm-off');
  res.json({ success: true, isActive: false });
});

// 5. Real-time SSE stream for 0ms alarm push notifications
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendStatus = () => {
    const isActive = getAlarmStatus();
    res.write(`data: ${JSON.stringify({ isActive })}\n\n`);
  };

  sendStatus();
  const interval = setInterval(sendStatus, 2000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;
