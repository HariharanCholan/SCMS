import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const QuestionSetList = () => {
  const [sets, setSets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quiz/documents');
        const data = await response.json();
        setSets(data);
      } catch (error) {
        console.error('Error fetching question sets:', error);
      }
    };
    fetchSets();
  }, []);

  return (
    <div className="min-h-screen p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Available Question Sets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sets.map((setName, index) => (
          <Button
            key={index}
            onClick={() => navigate(`/quiz/${encodeURIComponent(setName)}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {setName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSetList;
