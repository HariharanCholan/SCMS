import React from 'react';
import { Bar } from 'react-chartjs-2';

export const SubjectPerformance = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return null;

  const subjectNames = subjects.map((subject) => subject.name);
  const subjectScores = subjects.map((subject) => subject.score);

  const data = {
    labels: subjectNames,
    datasets: [
      {
        label: 'Score',
        data: subjectScores,
        backgroundColor: '#0077B6',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Subject Scores' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};
