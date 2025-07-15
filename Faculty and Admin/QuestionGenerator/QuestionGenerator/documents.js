const express = require('express');
const router = express.Router();
const { getMongoClient } = require('../utils/mongo');

router.get('/all', async (req, res) => {
  try {
    const client = await getMongoClient();
    const db = client.db('document_db'); // ✅ Use your actual DB name
    const questionsCollection = db.collection('Questions'); // ✅ Correct collection

    const allQuestionDocs = await questionsCollection.find({}).toArray(); // ✅ Fetch full docs

    res.json(allQuestionDocs); // ✅ Returns array
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

module.exports = router;
