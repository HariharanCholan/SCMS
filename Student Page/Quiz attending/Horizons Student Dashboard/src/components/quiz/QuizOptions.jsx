import React from 'react';
import { motion } from 'framer-motion';

const QuizOptions = ({ options, selectedAnswer, onAnswerSelect }) => {
  if (!options) return null;

  return (
    <div className="space-y-3 md:space-y-4">
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnswerSelect(option)}
          className={`w-full p-3 md:p-4 text-left rounded-xl border-2 transition-all duration-200 ${
            selectedAnswer === option
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
              : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-400'
            }`}>
              {selectedAnswer === option && (
                <motion.div 
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  className="w-2.5 h-2.5 rounded-full bg-white"
                />
              )}
            </div>
            <span className="font-medium text-sm md:text-base">{option}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default QuizOptions;