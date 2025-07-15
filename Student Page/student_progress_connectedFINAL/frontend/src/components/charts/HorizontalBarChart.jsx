import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export const HorizontalBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 py-8">No subject data available.</div>;
  }

  const getBarColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'linear-gradient(90deg, hsl(45, 90%, 55%), hsl(40, 95%, 50%))'; /* O - Gold */
    if (percentage >= 80) return 'linear-gradient(90deg, hsl(145, 70%, 45%), hsl(150, 75%, 40%))'; /* A+ - Bright Green */
    if (percentage >= 70) return 'linear-gradient(90deg, hsl(220, 80%, 60%), hsl(225, 85%, 55%))'; /* A - Vibrant Blue */
    if (percentage >= 60) return 'linear-gradient(90deg, hsl(190, 70%, 50%), hsl(195, 75%, 45%))'; /* B+ - Cyan */
    if (percentage >= 50) return 'linear-gradient(90deg, hsl(30, 80%, 60%), hsl(25, 85%, 55%))'; /* B - Orange */
    return 'linear-gradient(90deg, hsl(0, 70%, 55%), hsl(0, 75%, 50%))'; /* F - Red */
  };


  return (
    <div className="space-y-6">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-200">{item.subject}</span>
            <div className="flex items-center gap-2">
              {item.status === 'absent' ? (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold text-red-400">ABSENT</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-gray-300">{item.score}<span className="text-gray-500">/{item.maxScore}</span></span>
                </>
              )}
            </div>
          </div>
          <div className="relative h-3 bg-slate-700/70 rounded-full overflow-hidden shadow-inner">
            {item.status !== 'absent' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                transition={{ duration: 1.2, delay: index * 0.15 + 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="h-full rounded-full"
                style={{
                  background: getBarColor(item.score, item.maxScore)
                }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};