import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';

// Calculates average from either subjects[] or quizzes[]
function calculateStudentAverage(student) {
  const subjects = student.subjects || [];
  const quizzes = student.quizzes || [];

  if (subjects.length > 0) {
    const total = subjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);
    return Math.round(total / subjects.length);
  } else if (quizzes.length > 0) {
    const total = quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    return Math.round(total / quizzes.length);
  }

  return 0;
}

export function LowPerformersView({ classData, students, onStudentClick, renderBackButton }) {
  const lowPerformers = students
    .filter(s => s.className === classData?.name)  // ✅ Filter using className
    .filter(s => calculateStudentAverage(s) < 50);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton?.()}
      <h2 className="text-2xl font-bold text-white mb-6">
        Low Performers in {classData?.name} (Average &lt; 50%)
      </h2>

      {lowPerformers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowPerformers.map((student, index) => (
            <motion.div
              key={student._id}
              className="bg-slate-800/70 p-4 rounded-lg card-hover cursor-pointer border border-slate-700 flex flex-col items-center text-center"
              onClick={() => onStudentClick?.(student)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <TrendingDown className="w-10 h-10 text-red-400 mb-3" />
              <p className="text-lg font-semibold text-white">{student.name}</p>
              <p className="text-md text-red-300">
                Average Score: {calculateStudentAverage(student)}%
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">
          No students in this class found with an average score below 50%.
        </p>
      )}
    </motion.div>
  );
}
