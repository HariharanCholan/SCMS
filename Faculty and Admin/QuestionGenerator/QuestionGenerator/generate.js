const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5177;

app.use(bodyParser.json());

// === POST /api/generate ===
app.post('/api/generate', (req, res) => {
  const { documentId, numQuestions = 6 } = req.body;

  if (!documentId) {
    return res.status(400).json({ error: 'Missing documentId' });
  }

  const pythonPath = 'python'; // or "python3" depending on your system
  const scriptPath = path.join(__dirname, 'topic_doc_question_generator.py');

  const input = JSON.stringify({ documentId, numQuestions });

  const pythonProcess = spawn(pythonPath, [scriptPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.stdin.write(input);
  pythonProcess.stdin.end();

  pythonProcess.on('close', (code) => {
    if (code !== 0 || errorOutput.includes('Traceback')) {
      console.error('Python error:', errorOutput);
      return res.status(500).json({ error: 'Python script failed', details: errorOutput });
    }

    try {
      const jsonOutput = JSON.parse(output.trim().split('\n').pop());
      return res.json(jsonOutput);
    } catch (err) {
      console.error('JSON parse error:', err.message);
      return res.status(500).json({ error: 'Invalid JSON output from Python script' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
