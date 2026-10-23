// backend/server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import httpProxy from 'http-proxy';

import { connectDatabases } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import generatorRoutes from './routes/generatorRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import insightsRoutes from './routes/insightsRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'scms_unified_secret_key';
const MONGO_URI = process.env.MONGO_URI_AUTH || process.env.MONGO_URI;

// 1. CORS Configuration for all micro-frontends (5173 - 5180)
const allowedOrigins = [
  'http://localhost:5173', // Login
  'http://localhost:5174', // Quiz Attending
  'http://localhost:5175', // Student Insights
  'http://localhost:5176', // Attendance
  'http://localhost:5177', // Question Generator
  'http://localhost:5178', // Alert System
  'http://localhost:5179', // Faculty / Admin Hub
  'http://localhost:5180', // Student Progress
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or proxies)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 2. Session Middleware with MongoDB persistence
if (MONGO_URI) {
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: false,
      },
    })
  );
}

// 3. Health & Diagnostic Root
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'Smart Classroom Management System (SCMS) Unified Backend',
    version: '2.0.0',
    port: PORT,
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/auth',
      '/api/admin',
      '/api/attendance',
      '/api/generator',
      '/api/quiz',
      '/api/progress',
      '/api/insights',
      '/api/alerts',
    ],
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// 4. Mount Namespaced Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/generator', generatorRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/alerts', alertRoutes);

// 5. Mount Backward-Compatibility Direct Aliases
// Auth
app.use('/api', authRoutes);

// Admin & Classrooms
app.use('/api', adminRoutes);

// Attendance
app.use('/api/attendance', attendanceRoutes);

// AI Question Generator
app.use('/api', generatorRoutes);

// Quiz Attending
app.use('/api', quizRoutes);

// Student Academic Progress
app.use('/api', progressRoutes);

// Student Insights
app.use('/api', insightsRoutes);

// Alerts & Siren
app.use('/api', alertRoutes);

// Unified /api/students resolver
app.get('/api/students', (req, res, next) => {
  // Let progressRoutes handle it
  progressRoutes(req, res, next);
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.originalUrl,
  });
});

// 7. Start Server and Backward-Compatible Transparent Port Proxies
const startServer = async () => {
  await connectDatabases();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 SCMS UNIFIED BACKEND SERVER LIVE ON PORT ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });

  // Optional: Start transparent reverse proxies for legacy ports (8000-8006)
  if (process.env.PORT_LEGACY_PROXY !== 'false') {
    startLegacyPortProxies(PORT);
  }
};

/**
 * Spawns lightweight HTTP forwarders on ports 8000-8006.
 * Any request to old ports seamlessly routes to http://localhost:5000!
 */
function startLegacyPortProxies(targetPort) {
  const legacyPorts = [8000, 8001, 8002, 8003, 8004, 8005, 8006];
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${targetPort}`,
    ws: true,
  });

  proxy.on('error', (err, req, res) => {
    console.warn(`Proxy forward warning: ${err.message}`);
    if (res && res.writeHead) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy Gateway Error' }));
    }
  });

  legacyPorts.forEach((port) => {
    try {
      const server = http.createServer((req, res) => {
        proxy.web(req, res);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`ℹ️ Port ${port} is in use; proxy forwarder skipped for ${port}`);
        } else {
          console.warn(`Proxy port ${port} error:`, err.message);
        }
      });

      server.listen(port, () => {
        console.log(`⚡ Legacy port forwarder active: http://localhost:${port} ➔ :${targetPort}`);
      });
    } catch (e) {
      // Ignore if port in use
    }
  });
}

startServer();
