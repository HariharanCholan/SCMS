import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

const QuizHeader = ({ navigate, isQuizActive }) => {
  const handleNavigation = () => {
    if (typeof navigate === 'function') {
      navigate();
    }
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center mb-6 md:mb-8 px-2"
    >
      <motion.button 
        onClick={handleNavigation}
        className="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors p-2 rounded-lg glass-effect"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isQuizActive && navigate.name === 'bound navigate'}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Dashboard</span>
      </motion.button>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 p-2 rounded-lg shadow-md">
          <span className="text-blue-900 font-bold text-xs sm:text-sm">CHENNAI INSTITUTE OF TECHNOLOGY</span>
        </div>
      </div>
      <motion.button
        onClick={handleNavigation}
        className="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors p-2 rounded-lg glass-effect"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isQuizActive && navigate.name === 'bound navigate'}
      >
        <Home className="w-5 h-5" />
        <span className="hidden sm:inline">Home</span>
      </motion.button>
    </motion.header>
  );
};

export default QuizHeader;