import React, { useState, useEffect } from 'react';

const TestSelection = ({ onSelectTest }) => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/tests');
        const data = await response.json();
        console.log('Fetched tests:', data);
        setTests(data);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleStartQuiz = () => {
    if (!selectedTestId) {
      alert('Please select a test.');
      return;
    }
    onSelectTest(selectedTestId);
  };

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div>
      <h2>Select a Quiz</h2>
      <select
        value={selectedTestId}
        onChange={(e) => setSelectedTestId(e.target.value)}
      >
        <option value="">-- Select a quiz --</option>
        {tests.map(test => (
          <option key={test._id} value={test._id}>
            {test.title} {test.uploadedAt ? `(${new Date(test.uploadedAt).toLocaleString()})` : ''}
          </option>
        ))}
      </select>
      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
};

export default TestSelection;
