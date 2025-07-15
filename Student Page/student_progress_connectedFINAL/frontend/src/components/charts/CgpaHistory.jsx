import React from 'react';
import { Line } from 'react-chartjs-2';

export const CgpaHistory = ({ cgpaHistory }) => {
  if (!cgpaHistory || cgpaHistory.length === 0) return null;

  const semesters = cgpaHistory.map((entry) => entry.semester);
  const cgpaValues = cgpaHistory.map((entry) => entry.cgpa);

  const data = {
    labels: semesters,
    datasets: [
      {
        label: 'CGPA',
        data: cgpaValues,
        fill: false,
        borderColor: '#0096C7',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'CGPA Over Semesters' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};
