import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PerformanceChart({ data, title }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: data.datasets.length > 1 },
      title: { display: true, text: title, color: '#fff', font: { size: 16 } },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100, 
        ticks: { color: '#9ca3af', font: { size: 10 } }, 
        grid: { color: 'rgba(255,255,255,0.1)' } 
      },
      x: { 
        ticks: { color: '#9ca3af', font: { size: 10 } }, 
        grid: { color: 'rgba(255,255,255,0.1)' } 
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={data} options={chartOptions} />
    </div>
  );
}