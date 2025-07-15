import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PerformanceChart = ({ performanceData }) => {
  if (!performanceData || performanceData.length === 0) return null;

  const chartData = {
    labels: performanceData.map((item) => item.month),
    datasets: [
      {
        label: 'Performance Score',
        data: performanceData.map((item) => item.score),
        borderColor: '#00B4D8',
        backgroundColor: '#90E0EF',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ADE8F4',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    layout: {
      padding: 0,
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
        ticks: {
          color: '#E5E7EB',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#E5E7EB',
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-[280px] max-h-[280px] min-h-[280px]">
      <Line data={chartData} options={options} />
    </div>
  );
};
