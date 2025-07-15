import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ title, value, icon, colorClass, onClick, delay, valueSubtitle }) {
  const IconComponent = icon;
  return (
    <motion.div 
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: delay }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-hover cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          {typeof value === 'object' && value !== null ? (
            <motion.div className="text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 1 }}>
              <p className="text-xl font-bold">{value.main}</p>
              {value.sub && <p className="text-sm text-slate-300">{value.sub}</p>}
            </motion.div>
          ) : (
            <motion.p 
              className="text-3xl font-bold text-white" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: delay + 1 }}
            >
              {value}
            </motion.p>
          )}
          {valueSubtitle && <p className="text-xs text-slate-500 mt-1">{valueSubtitle}</p>}
        </div>
        {IconComponent && (
          <div className={`w-12 h-12 ${colorClass}/20 rounded-lg flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 text-${colorClass}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}