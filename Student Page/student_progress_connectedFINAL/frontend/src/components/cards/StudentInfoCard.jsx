import React from 'react';
import { motion } from 'framer-motion';
import { PerformanceChart } from '@/components/charts/PerformanceChart';

export const StudentInfoCard = ({ performanceData = [] }) => {
  const validData = performanceData
    .filter(item => !isNaN(Number(item.score)))
    .map(item => ({ ...item, score: Number(item.score) }));

  const averageScore =
    validData.length > 0
      ? validData.reduce((sum, item) => sum + item.score, 0) / validData.length
      : 0;

  const quizzesAttended = validData.length;
  const overallStandingPercentage = 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-r from-slate-800/80 to-purple-900/60 backdrop-blur-lg border border-slate-700/60 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 items-start">
        {/* Column 1: Student Info */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-1">A S Tharun aadhitiya</h2>
          <p className="text-gray-300 text-xs sm:text-sm">Student ID: 23AD001</p>
          <p className="text-gray-300 text-xs sm:text-sm">
            Class Rank: Top {overallStandingPercentage.toFixed(2)}%
          </p>

          <div className="space-y-4 pt-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Average Score</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {validData.length > 0 ? Math.round(averageScore) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tests Taken</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{quizzesAttended}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Performance Chart */}
        <div className="-ml-20 -mt-4 w-full md:col-span-1">
          <p className="text-sm font-semibold text-white mb-2">Performance Trend</p>
          <div className="w-full h-[260px] bg-slate-800/60 rounded-xl p-3">
            {validData.length > 0 ? (
              <PerformanceChart performanceData={validData} />
            ) : (
              <div className="text-gray-400 text-sm flex items-center justify-center h-full">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Overall Standing */}
        <div className="space-y-3 md:text-right">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Overall Standing</p>
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Top {overallStandingPercentage.toFixed(2)}%
            </p>
          </div>

          <div className="w-full md:max-w-xs space-y-1">
            <div className="h-2 bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                style={{ width: `${overallStandingPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Bottom 0%</span>
              <span>Top 100%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
