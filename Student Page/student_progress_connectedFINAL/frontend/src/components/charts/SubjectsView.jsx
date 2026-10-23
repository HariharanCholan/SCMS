import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export function SubjectsView() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects')
      .then(res => res.json())
      .then(data => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching subjects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (subjects.length === 0) return <p>No subjects found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Student Subjects and Scores</h2>

      <table className="min-w-full bg-white border rounded-md mb-8">
        <thead>
          <tr>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Score</th>
            <th className="border px-4 py-2">Max Score</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(({ _id, subject, score, maxScore, status }) => (
            <tr key={_id} className="text-center">
              <td className="border px-4 py-2">{subject}</td>
              <td className="border px-4 py-2">{score}</td>
              <td className="border px-4 py-2">{maxScore}</td>
              <td className="border px-4 py-2 capitalize">{status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2">Scores Bar Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={subjects} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#0077B6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
