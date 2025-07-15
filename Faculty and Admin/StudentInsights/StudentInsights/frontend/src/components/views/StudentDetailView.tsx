import React from 'react';
import { motion } from 'framer-motion';

export function StudentDetailView({ student, renderBackButton }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton?.()}

      <h2 className="text-2xl font-bold text-white mb-6">
        Performance Details: {student.name}
      </h2>

      {student.subjects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {student.subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              className="bg-slate-800/70 p-4 rounded-lg border border-slate-700 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
              <p className="text-md text-slate-300">Marks: {subject.marks}%</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">
          No subject data found for this student.
        </p>
      )}
    </motion.div>
  );
}
