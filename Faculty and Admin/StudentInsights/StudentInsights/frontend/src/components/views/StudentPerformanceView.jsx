import React from 'react';
import { motion } from 'framer-motion';
import { PerformanceChart } from '@/components/common/PerformanceChart';

export function StudentPerformanceView({ student, quizzes, renderBackButton }) {
  if (!student) return null;

  const studentQuizzes = student.quizzes.map(sq => {
    const quizDetail = quizzes.find(q => q.id === sq.quizId);
    return { ...sq, ...quizDetail };
  });

  const chartData = {
    labels: studentQuizzes.map(q => q.name || `Quiz ${q.quizId}`),
    datasets: [
      {
        label: `${student.name}'s Scores`,
        data: studentQuizzes.map(q => q.score),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-white mb-4">{student.name}'s Performance</h2>
      <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 h-96">
        {studentQuizzes.length > 0 ? (
          <PerformanceChart data={chartData} title={`${student.name}'s Quiz Scores`} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No quiz data available for this student.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}