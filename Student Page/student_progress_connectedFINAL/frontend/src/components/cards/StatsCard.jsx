import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ icon, value, maxValue, label, description, colorClass, textColorClass, onClick, delay = 0 }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${colorClass} backdrop-blur-sm border ${colorClass.replace('from-', 'border-').split(' ')[0]}/60 rounded-xl p-6 hover-lift shadow-lg`}
      onClick={onClick ? handleClick : undefined}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        {icon}
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {value}
            {maxValue && <span className="text-lg text-gray-300">/{maxValue}</span>}
          </p>
          <p className={`${textColorClass} text-sm`}>{label}</p>
        </div>
      </div>
      <p className="text-gray-300 text-xs uppercase tracking-wider">{description}</p>
    </motion.div>
  );
};