// backend/routes/generatorRoutes.js
import express from 'express';
import { ObjectId } from 'mongodb';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { documentDb } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const getDocDb = () => {
  if (!documentDb) {
    throw new Error('Database not initialized');
  }
  return documentDb;
};

// 1. Upload Document
router.post('/upload', async (req, res) => {
  try {
    const db = getDocDb();
    const doc = req.body;
    const result = await db.collection('documents').insertOne(doc);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ message: 'Failed to save document', error: err.message });
  }
});

// 2. Fetch All Documents
router.get('/documents', async (req, res) => {
  try {
    const db = getDocDb();
    const docs = await db.collection('documents').find({}).toArray();
    const mapped = docs.map((doc) => ({
      _id: doc._id.toString(),
      filename: doc.filename || doc.name,
      name: doc.name || doc.filename,
      type: doc.type,
      size: doc.size,
      uploadDate: doc.uploadDate || doc.createdAt,
      extractedText: doc.extractedText || doc.textContent,
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
  }
});

// 3. Delete Document by ID
router.delete('/documents/:id', async (req, res) => {
  try {
    const db = getDocDb();
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    const result = await db.collection('documents').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// 4. Delete questions Document by ID
router.delete('/questions/deleteDocument/:docId', async (req, res) => {
  try {
    const db = getDocDb();
    const { docId } = req.params;
    if (!ObjectId.isValid(docId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }
    const result = await db.collection('Questions').deleteOne({ _id: new ObjectId(docId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// 5. Generate Questions (Invokes Python AI model)
router.post('/generate', async (req, res) => {
  const { documentId, numQuestions = 5 } = req.body;
  if (!documentId) {
    return res.status(400).json({ message: 'documentId is required' });
  }
  try {
    const scriptPath = path.resolve(__dirname, '../python_ai/topic_doc_question_generator.py');
    const pyProcess = spawn('python', [scriptPath], {
      env: { ...process.env },
    });
    const inputJson = JSON.stringify({ documentId, numQuestions });

    let outputData = '';
    let errorData = '';

    pyProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pyProcess.on('close', (code) => {
      if (code !== 0 && !outputData.includes('{')) {
        console.error('Python process error:', errorData);
        return res.status(500).json({ message: 'Python AI model error', error: errorData });
      }

      try {
        const jsonStart = outputData.indexOf('{');
        const jsonEnd = outputData.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('Invalid JSON output from Python script');
        }
        const cleanJson = outputData.substring(jsonStart, jsonEnd + 1);
        const parsedOutput = JSON.parse(cleanJson);

        if (parsedOutput.error) {
          return res.status(400).json({ message: parsedOutput.error });
        }

        res.json(parsedOutput);
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError, 'Raw output:', outputData);
        res.status(500).json({ message: 'Failed to parse AI model output', error: parseError.message });
      }
    });

    pyProcess.stdin.write(inputJson);
    pyProcess.stdin.end();
  } catch (err) {
    console.error('AI generation exception:', err);
    res.status(500).json({ message: 'Failed to generate questions', error: err.message });
  }
});

// 6. Save Questions grouped by Document
router.post('/saveQuestions', async (req, res) => {
  const { documentId, docName, questions } = req.body;
  if (!documentId || !questions) {
    return res.status(400).json({ message: 'Missing required data (documentId or questions)' });
  }
  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid document ID' });
  }

  try {
    const db = getDocDb();
    const updateResult = await db.collection('Questions').updateOne(
      { _id: new ObjectId(documentId) },
      { $set: { docName, questions } },
      { upsert: true }
    );

    res.json({
      message: 'Questions saved successfully',
      modifiedCount: updateResult.modifiedCount,
      upsertedId: updateResult.upsertedId,
    });
  } catch (err) {
    console.error('Save questions error:', err);
    res.status(500).json({ message: 'Failed to save questions', error: err.message });
  }
});

// 7. Fetch all questions documents
router.get('/questions/all', async (req, res) => {
  try {
    const db = getDocDb();
    const allQuestionDocs = await db.collection('Questions').find({}).toArray();
    res.json(allQuestionDocs);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

// 8. Publish questions to student_Questions collection
router.post('/questions/postStudentDocument', async (req, res) => {
  const { documentId, docName, questions } = req.body;
  if (!documentId || !questions) {
    return res.status(400).json({ message: 'Missing required data (documentId or questions)' });
  }
  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid document ID' });
  }

  try {
    const db = getDocDb();
    const result = await db.collection('student_Questions').insertOne({
      documentId: new ObjectId(documentId),
      docName,
      questions,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Questions posted to student_Questions', insertedId: result.insertedId });
  } catch (err) {
    console.error('Post student questions error:', err);
    res.status(500).json({ message: 'Failed to post questions', error: err.message });
  }
});

export default router;
