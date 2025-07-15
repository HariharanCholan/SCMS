import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizNavigation from '@/components/quiz/QuizNavigation';

const QuizOptions = ({ options, selectedAnswer, onAnswerSelect, isFillType, isMultiSelect }) => {
  if (isFillType) {
    return (
      <textarea
        value={selectedAnswer}
        onChange={(e) => onAnswerSelect(e.target.value)}
        className="w-full p-2 rounded text-black"
        placeholder="Write your answer here"
      />
    );
  }

  return (
    <div className="space-y-2">
      {options.map((option, idx) => (
        <label key={idx} className="flex items-center space-x-2 cursor-pointer text-black">
          <input
            type={isMultiSelect ? 'checkbox' : 'radio'}
            name="quiz-option"
            value={option}
            checked={
              isMultiSelect
                ? selectedAnswer.includes(option)
                : selectedAnswer === option
            }
            onChange={() => onAnswerSelect(option)}
            className="form-checkbox"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${API_BASE_URL}/documents`);
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to load document list.', variant: 'destructive' });
      }
    }
    fetchDocuments();
  }, [API_BASE_URL]);

  const fetchQuestions = useCallback(async () => {
    if (!selectedDocumentId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/quiz-questions?documentId=${selectedDocumentId}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const questionsArray = Array.isArray(data) ? data : data.questions;
      if (!questionsArray) throw new Error('Invalid data format');
      const formattedQuestions = questionsArray.map((q, index) => ({
        _id: index.toString(),
        question: q.text,
        options: q.options && q.options.length > 0 ? q.options : ['(Write your answer below)'],
        correctAnswer: q.answer,
        type: q.type,
      }));
      setQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(formattedQuestions[0]?.type === 'MSQ' ? [] : '');
      setQuizCompleted(false);
      setScore(0);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({ title: 'Error', description: 'Failed to load questions. Please try again later.', variant: 'destructive' });
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, selectedDocumentId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const completeQuiz = async (finalAnswers) => {
    try {
      const res = await fetch(`${API_BASE_URL}/submit-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: selectedDocumentId, answers: finalAnswers }),
      });
      if (!res.ok) throw new Error('Failed to submit answers');
      const data = await res.json();
      setScore(data.score);
      setQuizCompleted(true);
      setQuizStarted(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.warn("Error exiting fullscreen:", err));
      }
      toast({ title: 'Quiz Completed!', description: `You scored ${data.score} out of ${data.total}.`, variant: 'default' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to calculate final score.', variant: 'destructive' });
    }
  };
  const forceSubmitAndLogout = useCallback(() => {
  setQuizStarted(false);
  setQuizCompleted(true);

  toast({
    title: 'You are logged out',
    description: 'System detected that you are cheating. Your quiz is now submitted.',
    variant: 'destructive',
  });

  completeQuiz(answers);

  setTimeout(() => navigate('/'), 3000);
  }, [answers, completeQuiz, navigate]);

  const handleNextQuestion = useCallback(() => {
    const newAnswers = [...answers];
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.type === 'MSQ') {
      const selectedLetters = selectedAnswer.map(opt => String.fromCharCode(65 + currentQ.options.indexOf(opt)));
      newAnswers[currentQuestionIndex] = selectedLetters.sort().join(',');
    } else if (currentQ.type === 'FILL') {
      newAnswers[currentQuestionIndex] = selectedAnswer;
    } else {
      const letterIndex = currentQ.options.indexOf(selectedAnswer);
      const letter = String.fromCharCode(65 + letterIndex);
      newAnswers[currentQuestionIndex] = letter;
    }
    setAnswers(newAnswers);
    if (currentQuestionIndex >= questions.length - 1) {
      completeQuiz(newAnswers);
      return;
    }
    const nextQuestion = questions[currentQuestionIndex + 1];
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(nextQuestion?.type === 'MSQ' ? [] : '');
    setTimeLeft(10);
  }, [answers, currentQuestionIndex, selectedAnswer, questions, completeQuiz]);

  useEffect(() => {
    if (!quizStarted || quizCompleted || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNextQuestion();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizCompleted, currentQuestionIndex, handleNextQuestion]);

  useEffect(() => {
    if (!quizStarted) return;
    const goFullscreen = async () => {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    };
    goFullscreen();
    const handleVisibilityChange = () => document.hidden && forceSubmitAndLogout();
    const handleFullscreenChange = () => !document.fullscreenElement && forceSubmitAndLogout();
    const handleKeydown = (e) => {
      if (['Escape', 'Tab', 'Meta'].includes(e.key)) forceSubmitAndLogout();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [quizStarted, forceSubmitAndLogout]);

  const handleStartQuiz = () => {
    if (!selectedDocumentId) {
      toast({ title: 'Please select a test before starting', variant: 'destructive' });
      return;
    }
    setQuizStarted(true);
    setTimeLeft(10);
    const firstQuestion = questions[0];
    setSelectedAnswer(firstQuestion?.type === 'MSQ' ? [] : '');
  };

  const handleAnswerSelect = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    if (currentQuestion.type === 'MSQ') {
      setSelectedAnswer(prev => prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]);
    } else {
      setSelectedAnswer(answer);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>;
  }

  if (quizCompleted) {
    return <motion.div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <h2 className="text-white text-3xl mb-4 font-bold">🎉 Quiz Completed! 🎉</h2>
      <motion.p className="text-white text-lg mb-6">You scored {score} out of {questions.length}</motion.p>
      <Button variant="secondary" className="mt-2" onClick={() => window.location.href = 'http://localhost:5180/'}>Go Home</Button>
    </motion.div>;
  }

  if (!quizStarted) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-center">
      <h2 className="text-white text-2xl mb-4">Select a Test</h2>
      <select className="mb-4 p-2 rounded text-black max-w-sm w-full" value={selectedDocumentId} onChange={e => setSelectedDocumentId(e.target.value)}>
        <option value="">-- Select a Test --</option>
        {documents.map(doc => <option key={doc._id} value={doc._id}>{doc.name || doc.title || doc._id}</option>)}
      </select>
      <Button disabled={!selectedDocumentId} onClick={handleStartQuiz}>Start Quiz</Button>
      <Button variant="secondary" className="mt-2" onClick={() => window.location.href = 'http://localhost:5180/'}>Go Home</Button>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800">
    <QuizHeader navigate={() => forceSubmitAndLogout()} isQuizActive={quizStarted} />
    <motion.div className="max-w-4xl mx-auto">
      <div className="quiz-card rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <span className="text-blue-600 font-semibold">Question: {currentQuestionIndex + 1}/{questions.length}</span>
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">{timeLeft}</span>
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestionIndex} className="space-y-6 md:space-y-8">
            <QuizQuestion question={currentQuestion?.question} />
            <QuizOptions options={currentQuestion?.options} selectedAnswer={selectedAnswer} onAnswerSelect={handleAnswerSelect} isFillType={currentQuestion?.type === 'FILL'} isMultiSelect={currentQuestion?.type === 'MSQ'} />
            <QuizNavigation onNext={handleNextQuestion} isNextDisabled={currentQuestion.type === 'MSQ' ? selectedAnswer.length === 0 : !selectedAnswer} isLastQuestion={currentQuestionIndex >= questions.length - 1} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  </div>;
};

export default Quiz;


