// src/components/charts/ClassComparisonChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const ClassComparisonChart = ({ data }) => {
  const chartData = {
    labels: data?.map((item) => item.className),
    datasets: [
      {
        label: 'Average Score (%)',
        data: data?.map((item) => item.averageScore),
        backgroundColor: '#0077B6',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
    </div>
  );
};
