import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import { spawn } from 'child_process';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;
const MONGO_URI = process.env.MONGO_URI; // From your .env file

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env file. Exiting...');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Connected to MongoDB Atlas');
    db = client.db('document_db');

    // Start the server only if DB connection is successful
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1); // Exit the process to avoid dangling server
  });

/**
 * Upload Document
 */
app.post('/api/upload', async (req, res) => {
  try {
    const doc = req.body;
    const result = await db.collection('documents').insertOne(doc);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ message: 'Failed to save document', error: err.message });
  }
});

/**
 * Fetch All Documents
 */
app.get('/api/documents', async (req, res) => {
  try {
    const docs = await db.collection('documents').find({}).toArray();
    const mapped = docs.map(doc => ({
      _id: doc._id.toString(),
      filename: doc.filename,
      name: doc.filename,
      type: doc.type,
      size: doc.size,
      uploadDate: doc.uploadDate,
      extractedText: doc.extractedText
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
  }
});

/**
 * Delete a Document by ID
 */
app.delete('/api/documents/:id', async (req, res) => {
  try {
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

/**
 * Alias delete route for questions collection
 */
app.delete('/api/questions/deleteDocument/:docId', async (req, res) => {
  try {
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

/**
 * Generate Questions
 */
app.post('/api/generate', async (req, res) => {
  const { documentId, numQuestions = 5 } = req.body;
  if (!documentId) {
    return res.status(400).json({ message: 'documentId is required' });
  }
  try {
    const pyProcess = spawn('python', ['topic_doc_question_generator.py']);
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
      if (code !== 0 || errorData.includes('Traceback')) {
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

/**
 * Save Questions grouped by Document
 */
app.post('/api/saveQuestions', async (req, res) => {
  const { documentId, docName, questions } = req.body;

  if (!documentId || !questions) {
    return res.status(400).json({ message: 'Missing required data (documentId or questions)' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid document ID' });
  }

  try {
    const updateResult = await db.collection('Questions').updateOne(
      { _id: new ObjectId(documentId) },
      { $set: { docName, questions } },
      { upsert: true }
    );

    res.json({
      message: 'Questions saved successfully',
      modifiedCount: updateResult.modifiedCount,
      upsertedId: updateResult.upsertedId
    });
  } catch (err) {
    console.error('Save questions error:', err);
    res.status(500).json({ message: 'Failed to save questions', error: err.message });
  }
});

/**
 * Fetch all questions documents
 */
app.get('/api/questions/all', async (req, res) => {
  try {
    const allQuestionDocs = await db.collection('Questions').find({}).toArray();
    res.json(allQuestionDocs);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

/**
 * Save to student_Questions collection
 */
app.post('/api/questions/postStudentDocument', async (req, res) => {
  const { documentId, docName, questions } = req.body;

  if (!documentId || !questions) {
    return res.status(400).json({ message: 'Missing required data (documentId or questions)' });
  }

  if (!ObjectId.isValid(documentId)) {
    return res.status(400).json({ message: 'Invalid document ID' });
  }

  try {
    const result = await db.collection('student_Questions').insertOne({
      documentId: new ObjectId(documentId),
      docName,
      questions,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Questions posted to student_Questions', insertedId: result.insertedId });
  } catch (err) {
    console.error('Post student questions error:', err);
    res.status(500).json({ message: 'Failed to post questions', error: err.message });
  }
});

/**
 * Health Check
 */
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});
