import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

let db;
let client;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(process.env.DB_NAME || 'document_db');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Get all available tests (basic info for dropdown or selection)
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await db.collection('student_Questions')
      .find({})
      .project({ _id: 1, docName: 1, createdAt: 1 })
      .toArray();

    const formatted = tests.map(test => ({
      _id: test._id,
      title: test.docName || 'Untitled Quiz',
      uploadedAt: test.createdAt || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ Failed to fetch tests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get quiz questions for a specific documentId (without answers)
app.get('/api/quiz-questions', async (req, res) => {
  const { documentId } = req.query;

  if (!documentId) {
    return res.status(400).json({ message: 'documentId query parameter is required' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid documentId format' });
  }

  try {
    const doc = await db.collection('student_Questions').findOne({ _id: new ObjectId(documentId) });

    if (!doc) {
      return res.status(404).json({ message: 'No document found for this documentId' });
    }

    // Return questions with answers removed
    const questionsWithoutAnswers = doc.questions.map(q => {
      const { answer, ...rest } = q;
      return rest;
    });

    res.status(200).json(questionsWithoutAnswers);
  } catch (error) {
    console.error('❌ Failed to fetch quiz questions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Submit user answers and calculate the score
app.post('/api/submit-answers', async (req, res) => {
  const { documentId, answers } = req.body;

  if (!documentId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'documentId and answers array are required' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid documentId format' });
  }

  try {
    const doc = await db.collection('student_Questions').findOne({ _id: new ObjectId(documentId) });

    if (!doc) {
      return res.status(404).json({ message: 'No document found for this documentId' });
    }

    let score = 0;

    answers.forEach((userAns, idx) => {
      const correctAns = doc.questions[idx]?.answer || '';

      const correctSet = new Set(
        correctAns
          .split(',')
          .map(a => a.trim().toUpperCase())
          .filter(a => a)
      );

      const userSet = new Set(
        (userAns || '')
          .split(',')
          .map(a => a.trim().toUpperCase())
          .filter(a => a)
      );

      // Compare sets
      if (
        userSet.size > 0 &&
        userSet.size === correctSet.size &&
        [...correctSet].every(v => userSet.has(v))
      ) {
        score++;
      }
    });

    res.status(200).json({
      score,
      total: doc.questions.length,
      message: 'Answers submitted successfully',
    });
  } catch (error) {
    console.error('❌ Failed to submit answers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get documents for dropdown (with upload date/time for quiz selection page)
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await db.collection('student_Questions')
      .find({})
      .project({ _id: 1, docName: 1, createdAt: 1 })
      .toArray();

    const formatted = documents.map(doc => ({
      _id: doc._id,
      name: doc.docName || `Document ${doc._id.toString()}`,
      uploadedAt: doc.createdAt || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('❌ Failed to fetch documents:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received, closing MongoDB client');
  if (client) await client.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing MongoDB client');
  if (client) await client.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
