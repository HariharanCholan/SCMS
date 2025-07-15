import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentProgressContent = ({ onNavigate }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center text-white p-4 md:p-8 h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white/10 rounded-full mb-8 shadow-xl"
        animate={{ rotate: [0, 10, -10, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <BarChart3 className="w-16 h-16 md:w-24 md:h-24 text-cyan-300" />
      </motion.div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
        Student Progress & Tracking
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl text-blue-100">
        Monitor your academic journey, view grades, and track course completion. Login to see your personalized progress.
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onNavigate}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 rounded-xl font-semibold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all"
        >
          View My Progress
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default StudentProgressContent;