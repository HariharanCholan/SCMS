import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Minus } from 'lucide-react';

export const TestHistoryTable = ({ data, getGrade }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 py-8">No test history available.</div>;
  }

  const getGradeClass = (grade) => {
    switch (grade) {
      case 'O': return 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30';
      case 'A+': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'A': return 'bg-green-600/20 text-green-400 border border-green-600/30';
      case 'B+': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'B': return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
      case 'F': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getStatusIconAndColor = (status) => {
    const normalized = status.toLowerCase();
    if (normalized === 'absent') {
      return {
        icon: <XCircle className="w-4 h-4 text-red-400" />,
        textColor: 'text-red-400',
      };
    } else {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-400" />,
        textColor: 'text-green-400',
      };
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="w-full">
        <thead className="bg-slate-800/60">
          <tr>
            <th className="text-left py-3 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Subject</th>
            <th className="text-left py-3 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Date</th>
            <th className="text-left py-3 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Marks</th>
            <th className="text-left py-3 px-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Grade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const { icon, textColor } = getStatusIconAndColor(row.status);
            return (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors duration-150"
              >
                <td className="py-4 px-4 text-white font-medium text-sm">{row.subject}</td>
                <td className="py-4 px-4 text-gray-300 text-sm">{row.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className={`text-sm font-medium ${textColor}`}>
                      {row.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300 text-sm">{row.marks}</td>
                <td className="py-4 px-4">
                  {row.grade !== '-' ? (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getGradeClass(row.grade)}`}>
                      {row.grade}
                    </span>
                  ) : (
                    <Minus className="w-4 h-4 text-gray-500" />
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
