
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export function ClassesListView({ title, onClassClick, renderBackButton }) {
  const [students, setStudents] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/insights/student')
      .then(res => {
        const fetchedStudents = res.data;
        setStudents(fetchedStudents);

        // Extract unique class names from students
        const uniqueClasses = Array.from(
          new Set(fetchedStudents.map(s => s.className))
        )
          .filter(Boolean)
          .map(className => ({
            name: className,
            grade: className, // Change if actual grade info is available
          }));

        setClassList(uniqueClasses);
      })
      .catch(err => {
        console.error('Error fetching students for class list:', err);
      });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton?.()}
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classList.map((classItem, index) => (
          <motion.div
            key={classItem.name}
            className="bg-slate-800/70 p-4 rounded-lg card-hover cursor-pointer border border-slate-700"
            onClick={() => onClassClick?.(classItem)}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <p className="text-lg font-semibold text-white">{classItem.name}</p>
            <p className="text-sm text-slate-400">Grade: {classItem.grade}</p>
          </motion.div>
        ))}
      </div>

      {classList.length === 0 && (
        <p className="text-slate-400 text-center py-8">No classes found.</p>
      )}
    </motion.div>
  );
}