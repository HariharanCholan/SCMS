import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, AlertCircle, ShieldCheck, ArrowLeft, Home, FileText } from 'lucide-react';
import axios from 'axios';

const QuizStartView = ({ onStartQuiz, navigate }) => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/tests'); // Adjust endpoint if needed
        console.log("API response data:", response.data);

        // Adjust this line based on your API response shape
        const testsData = Array.isArray(response.data) ? response.data : response.data.tests || [];
        setTests(testsData);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const rules = [
    { icon: <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />, text: "Don't navigate out or switch tabs." },
    { icon: <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />, text: "Don't try to copy questions or options." },
    { icon: <Clock className="w-5 h-5 text-sky-400 mr-2 flex-shrink-0" />, text: "Each question has a 10-second timer." },
    { icon: <ShieldCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />, text: "Answer questions one by one." },
    { icon: <ShieldCheck className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />, text: "You cannot revisit previous questions." },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 md:p-6"
      >
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors p-2 rounded-lg glass-effect"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </motion.button>
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
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="quiz-card rounded-3xl p-6 md:p-10 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex flex-col items-center text-center mb-6 md:mb-8">
          <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-blue-500 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Get Ready for the Quiz!
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Select a test and click "Start Quiz" when you're prepared. Good luck!
          </p>
        </div>

        <div className="mb-6 md:mb-8 bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-3 text-center">Select a Test</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading tests...</p>
          ) : (
            <select
              className="w-full p-2 rounded border border-gray-300 text-gray-800"
              value={selectedTestId || ''}
              onChange={(e) => setSelectedTestId(e.target.value)}
            >
              <option value="" disabled>Select a test</option>
              {Array.isArray(tests) && tests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.title} (Uploaded on {new Date(test.uploadedAt).toLocaleString()})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-6 md:mb-8 bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-3 text-center">Important Rules</h2>
          <ul className="space-y-2">
            {rules.map((rule, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start text-gray-700 text-sm md:text-base"
              >
                {rule.icon}
                <span>{rule.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onStartQuiz(selectedTestId)}
              disabled={!selectedTestId}
              className={`${
                selectedTestId
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-semibold text-lg md:text-xl flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transition-all`}
            >
              <FileText className="w-6 h-6" />
              <span>Start Quiz</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizStartView;
