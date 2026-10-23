// backend/routes/quizRoutes.js
import express from 'express';
import { ObjectId } from 'mongodb';
import { documentDb } from '../config/db.js';
import { Subject } from '../models/StudentProgress.js';

const router = express.Router();

const getDocDb = () => {
  if (!documentDb) {
    throw new Error('Database not initialized');
  }
  return documentDb;
};

// 1. Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 2. Get all available tests (for dropdown or selection)
router.get('/tests', async (req, res) => {
  try {
    const db = getDocDb();
    const tests = await db
      .collection('student_Questions')
      .find({})
      .project({ _id: 1, docName: 1, createdAt: 1 })
      .toArray();

    const formatted = tests.map((test) => ({
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

// 3. Get quiz questions for a specific documentId (answers stripped)
router.get('/quiz-questions', async (req, res) => {
  const { documentId } = req.query;

  if (!documentId) {
    return res.status(400).json({ message: 'documentId query parameter is required' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid documentId format' });
  }

  try {
    const db = getDocDb();
    const doc = await db.collection('student_Questions').findOne({ _id: new ObjectId(documentId) });

    if (!doc) {
      return res.status(404).json({ message: 'No document found for this documentId' });
    }

    const questionsWithoutAnswers = (doc.questions || []).map((q) => {
      const { answer, ...rest } = q;
      return rest;
    });

    res.status(200).json(questionsWithoutAnswers);
  } catch (error) {
    console.error('❌ Failed to fetch quiz questions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 4. Submit user answers, calculate score, and SYNC to Student Progress
router.post('/submit-answers', async (req, res) => {
  const { documentId, answers, studentId = 'default_student', studentName } = req.body;

  if (!documentId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'documentId and answers array are required' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid documentId format' });
  }

  try {
    const db = getDocDb();
    const doc = await db.collection('student_Questions').findOne({ _id: new ObjectId(documentId) });

    if (!doc) {
      return res.status(404).json({ message: 'No document found for this documentId' });
    }

    let score = 0;
    const questions = doc.questions || [];

    answers.forEach((userAns, idx) => {
      const correctAns = questions[idx]?.answer || '';
      const correctSet = new Set(
        correctAns
          .split(',')
          .map((a) => a.trim().toUpperCase())
          .filter((a) => a)
      );
      const userSet = new Set(
        (userAns || '')
          .split(',')
          .map((a) => a.trim().toUpperCase())
          .filter((a) => a)
      );

      if (
        userSet.size > 0 &&
        userSet.size === correctSet.size &&
        [...correctSet].every((v) => userSet.has(v))
      ) {
        score++;
      }
    });

    const total = questions.length || 1;
    const docName = doc.docName || 'Quiz Assessment';

    // 🔗 AUTO-SYNC TO STUDENT PROGRESS (subjects collection)
    try {
      await Subject.create({
        studentId: studentId,
        subject: docName,
        score: score,
        maxScore: total,
        status: 'attended',
        date: new Date(),
      });
      console.log(`✅ Synced quiz result (${score}/${total}) to Student Progress for [${docName}]`);
    } catch (syncErr) {
      console.warn('⚠️ Could not sync quiz score to StudentProgress subjects:', syncErr.message);
    }

    res.status(200).json({
      score,
      total,
      message: 'Answers submitted successfully',
    });
  } catch (error) {
    console.error('❌ Failed to submit answers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 5. Get documents for quiz selection dropdown
router.get('/documents', async (req, res) => {
  try {
    const db = getDocDb();
    const documents = await db
      .collection('student_Questions')
      .find({})
      .project({ _id: 1, docName: 1, createdAt: 1 })
      .toArray();

    const formatted = documents.map((doc) => ({
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

export default router;
