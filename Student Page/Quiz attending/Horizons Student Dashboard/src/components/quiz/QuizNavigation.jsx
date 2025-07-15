import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const QuizNavigation = ({ onNext, isNextDisabled, isLastQuestion }) => {
  return (
    <div className="flex justify-end mt-6 md:mt-8">
      <Button 
        onClick={onNext}
        disabled={isNextDisabled}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl text-base md:text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
      >
        <span>{isLastQuestion ? 'Finish Quiz' : 'Next Question'}</span>
        {isLastQuestion ? <CheckCircle className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default QuizNavigation;