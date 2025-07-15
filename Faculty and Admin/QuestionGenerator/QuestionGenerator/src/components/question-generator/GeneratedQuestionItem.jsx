import React from 'react';
import { motion } from 'framer-motion';
import { ListChecks, HelpCircle, CheckSquare, Edit3 } from 'lucide-react'; // Changed Edit to Edit3 to avoid conflict if any

const questionTypeIcons = {
  mcq: <ListChecks className="h-5 w-5 mr-2 text-blue-400" />,
  trueFalse: <HelpCircle className="h-5 w-5 mr-2 text-green-400" />,
  shortAnswer: <Edit3 className="h-5 w-5 mr-2 text-yellow-400" />,
  fillInBlank: <CheckSquare className="h-5 w-5 mr-2 text-orange-400" />,
  custom: <HelpCircle className="h-5 w-5 mr-2 text-gray-400" />,
};

const GeneratedQuestionItem = ({ question }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-md bg-slate-700/50 border border-slate-600"
    >
      <div className="flex items-center font-semibold text-white mb-1">
        {questionTypeIcons[question.type] || questionTypeIcons.custom}
        <span className="capitalize">{question.type.replace(/([A-Z])/g, ' $1')}</span>
        {question.mode && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-slate-600 text-slate-300">{question.mode}</span>}
      </div>
      <p className="text-gray-200 mb-1">{question.text}</p>
      {question.options && question.options.length > 0 && (
        <ul className="list-disc list-inside pl-4 text-sm text-gray-300 space-y-0.5">
          {question.options.map((opt, i) => <li key={i}>{opt}</li>)}
        </ul>
      )}
      <p className="text-xs text-green-400 mt-1.5">Answer: {question.answer}</p>
      <p className="text-xs text-gray-500 mt-1">Topics: {question.topics.join(', ')}</p>
      <p className="text-xs text-gray-500">Source: {question.docName}</p>
    </motion.div>
  );
};

export default GeneratedQuestionItem;