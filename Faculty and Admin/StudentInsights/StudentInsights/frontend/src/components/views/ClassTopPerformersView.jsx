import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

// Helper to calculate average from subjects
function calculateStudentAverage(student) {
  if (!student?.subjects || student.subjects.length === 0) return 0;
  const total = student.subjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);
  return Math.round(total / student.subjects.length);
}

export function ClassTopPerformersView({ classData, students, renderBackButton }) {
  // ✅ Filter students who belong to this class and have avg >= 80
  const topPerformers = students
    .filter(s => s.className === classData?.name) // ✅
    .filter(s => calculateStudentAverage(s) >= 80);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton?.()}
      <h2 className="text-2xl font-bold text-white mb-6">
        Top Performers in {classData?.name} (Average ≥ 80%)
      </h2>

      {topPerformers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((student, index) => (
            <motion.div
              key={student._id}
              className="bg-slate-800/70 p-4 rounded-lg card-hover border border-slate-700 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-3" />
              <p className="text-lg font-semibold text-white">{student.name}</p>
              <p className="text-md text-yellow-300">
                Average Score: {calculateStudentAverage(student)}%
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">
          No top performers (average ≥ 80%) found in this class.
        </p>
      )}
    </motion.div>
  );
}



