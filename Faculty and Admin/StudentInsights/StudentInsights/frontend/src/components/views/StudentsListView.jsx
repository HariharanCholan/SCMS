import React from 'react';
import { motion } from 'framer-motion';

// ✅ Updated to calculate average score from student.subjects
function calculateStudentAverage(student) {
  const subjects = student.subjects || [];
  if (subjects.length === 0) return 0;
  const total = subjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);
  return Math.round(total / subjects.length);
}

export function StudentsListView({ classData, students, onStudentClick, renderBackButton }) {
  // ✅ Filter students based on className
  const studentsInClass = students.filter(student => student.className === classData?.name);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton()}
      <h2 className="text-2xl font-bold text-white mb-6">
        Students in {classData?.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studentsInClass.map((student, index) => (
          <motion.div
            key={student._id}
            className="bg-slate-800/70 p-4 rounded-lg card-hover cursor-pointer border border-slate-700"
            onClick={() => onStudentClick(student)}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <p className="text-lg font-semibold text-white">{student.name}</p>
            <p className="text-sm text-slate-400">
              Average Score: {calculateStudentAverage(student)}%
            </p>
          </motion.div>
        ))}
      </div>
      {studentsInClass.length === 0 && (
        <p className="text-slate-400 text-center py-8">No students found in this class.</p>
      )}
    </motion.div>
  );
}
