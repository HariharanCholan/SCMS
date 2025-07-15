import React from 'react';

const QuizQuestion = ({ question }) => {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
      {question}
    </h2>
  );
};

export default QuizQuestion;