import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Award, Home } from 'lucide-react';

const QuizCompletedView = ({ score, totalQuestions, navigate }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
       <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6"
      >
        <div />
        <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 p-2 rounded-lg shadow-md">
          <span className="text-blue-900 font-bold text-xs sm:text-sm">CHENNAI INSTITUTE OF TECHNOLOGY</span>
        </div>
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors p-2 rounded-lg glass-effect"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">Home</span>
        </motion.button>
      </motion.header>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-effect rounded-3xl p-6 md:p-12 shadow-2xl max-w-lg w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="mx-auto mb-6 md:mb-8"
        >
          <Award className="w-20 h-20 md:w-28 md:h-28 text-yellow-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">
          Quiz Completed!
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-6">
          Well done! Here's your result:
        </p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="my-8 md:my-10"
        >
          <div className="relative w-36 h-36 md:w-48 md:h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" strokeWidth="10" stroke="rgba(255,255,255,0.2)" fill="none"/>
              <motion.circle 
                cx="50" cy="50" r="45" strokeWidth="10"
                stroke="url(#scoreGradient)"
                fill="none" strokeLinecap="round"
                initial={{ strokeDasharray: "0, 283" }}
                animate={{ strokeDasharray: `${(percentage/100)*283}, 283` }}
                transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              />
               <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#48CAE4" />
                  <stop offset="100%" stopColor="#0077B6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-3xl md:text-4xl font-bold">{score}/{totalQuestions}</span>
              <span className="text-sm md:text-base text-blue-200">({percentage}%)</span>
            </div>
          </div>
        </motion.div>
        
        <Button 
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl text-lg md:text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default QuizCompletedView;