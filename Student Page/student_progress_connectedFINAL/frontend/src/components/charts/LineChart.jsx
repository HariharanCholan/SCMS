// components/charts/LineChart.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const LineChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No performance data available.
      </div>
    );
  }

  const chartHeight = 200;
  const chartWidth = 400;
  const yPadding = 20;

  const scores = data.map((d) => Number(d.score));
  let minScore = Math.min(...scores);
  let maxScore = Math.max(...scores);

  if (minScore === maxScore) {
    minScore = Math.max(0, minScore - 10);
    maxScore = Math.min(100, maxScore + 10);
  }

  minScore = Math.max(0, minScore);
  maxScore = Math.min(100, maxScore);
  if (minScore > maxScore) {
    minScore = 0;
    maxScore = 100;
  }

  const getY = (score) => {
    const range = maxScore - minScore || 1;
    return chartHeight - yPadding - ((score - minScore) / range) * (chartHeight - 2 * yPadding);
  };

  const getX = (index) =>
    data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2;

  const linePath = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(Number(point.score))}`)
    .join(' ');

  const areaPath = `${linePath} L ${getX(data.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;

  const yAxisLabels = () => {
    const labels = [];
    const steps = 5;
    const step = (maxScore - minScore) / (steps - 1);
    for (let i = 0; i < steps; i++) {
      const value = Math.round(minScore + i * step);
      const y = getY(value);
      if (!isNaN(y)) {
        labels.push({ value, y });
      }
    }
    return labels;
  };

  return (
    <div className="relative h-56 sm:h-64 w-full">
      <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <defs>
          <linearGradient id="lineChartLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(260, 85%, 65%)" />
            <stop offset="100%" stopColor="hsl(280, 90%, 70%)" />
          </linearGradient>
          <linearGradient id="lineChartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsla(260, 85%, 65%, 0.4)" />
            <stop offset="100%" stopColor="hsla(280, 90%, 70%, 0.1)" />
          </linearGradient>
        </defs>

        {/* Y-axis Grid Lines */}
        {yAxisLabels().map((label, index) => (
          <g key={index}>
            <line
              x1="0"
              y1={label.y}
              x2={chartWidth}
              y2={label.y}
              stroke="rgba(100, 116, 139, 0.2)"
              strokeDasharray="2 4"
            />
            <text
              x="-5"
              y={label.y + 4}
              textAnchor="end"
              className="text-xs fill-gray-400"
            >
              {label.value}
            </text>
          </g>
        ))}

        {/* Filled Area */}
        <motion.path
          d={areaPath}
          fill="url(#lineChartAreaGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Line Path */}
        <motion.path
          d={linePath}
          stroke="url(#lineChartLineGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_3px_6px_hsla(260,85%,65%,0.4)]"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Data Points */}
        {data.map((point, index) => {
          const x = getX(index);
          const y = getY(Number(point.score));
          return (
            <motion.g
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            >
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="hsl(260, 85%, 65%)"
                className="drop-shadow-md cursor-pointer"
              />
              <circle
                cx={x}
                cy={y}
                r="2.5"
                fill="white"
                className="cursor-pointer"
              />
            </motion.g>
          );
        })}
      </svg>

      {/* X-axis Month Labels */}
      <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-2 text-xs text-gray-400">
        {data.map((point, index) => (
          <span key={index}>{point.month}</span>
        ))}
      </div>
    </div>
  );
};
