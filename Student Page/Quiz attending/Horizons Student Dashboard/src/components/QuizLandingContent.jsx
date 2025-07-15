import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuizLandingContent = ({ onNavigate }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center text-white p-4 md:p-8 h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white/10 rounded-full mb-8 shadow-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <BookOpen className="w-16 h-16 md:w-24 md:h-24 text-yellow-300" />
      </motion.div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
        Ready to Test Your Knowledge?
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl text-blue-100">
        Challenge yourself with our interactive quizzes. Sharpen your skills and learn something new today!
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onNavigate}
          className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-blue-900 px-10 py-4 rounded-xl font-semibold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all"
        >
          Start Quiz Now
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default QuizLandingContent;