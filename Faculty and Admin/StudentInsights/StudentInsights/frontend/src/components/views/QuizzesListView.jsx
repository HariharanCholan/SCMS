import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function QuizzesListView({ classData, quizzes, renderBackButton }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = useMemo(() => {
    if (!searchTerm) return quizzes;
    return quizzes.filter(quiz => 
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {renderBackButton()}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Quizzes for {classData?.name}</h2>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text"
            placeholder="Search quizzes by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 focus:border-primary text-white w-full sm:w-64"
          />
        </div>
      </div>
      
      {filteredQuizzes.length > 0 ? (
        <div className="space-y-3">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              className="bg-slate-800/70 p-4 rounded-lg card-hover border border-slate-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-lg font-semibold text-white">{quiz.name}</p>
              <p className="text-sm text-slate-400">Subject: {quiz.subject} | Date: {quiz.date}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">
          {quizzes.length > 0 ? 'No quizzes match your search.' : 'No quizzes found for this class.'}
        </p>
      )}
    </motion.div>
  );
}