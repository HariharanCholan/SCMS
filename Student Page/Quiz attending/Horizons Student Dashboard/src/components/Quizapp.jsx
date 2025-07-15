import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Quiz = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const optionIndexToLetter = (index) => String.fromCharCode(65 + index);

  // 🚨 Fullscreen + forbidden key detection only during quiz
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const logout = () => {
      alert('Quiz ended due to tab switch, fullscreen exit, or forbidden key press.');
      navigate('/logout');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) logout();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) logout();
    };

    const handleKeyDown = (e) => {
      if (['Escape', 'Tab', 'Meta'].includes(e.key)) {
        e.preventDefault();
        logout();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quizStarted, quizCompleted, navigate]);

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/tests`);
      if (!res.ok) throw new Error('Failed to fetch tests');
      const data = await res.json();
      setTests(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load tests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (documentId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/quiz-questions?documentId=${documentId}`);
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      const formatted = (data || []).map((q, idx) => ({
        id: q._id || idx,
        type: q.type,
        text: q.text || '',
        options: Array.isArray(q.options) ? q.options : [],
        answer: q.answer,
      }));
      setQuestions(formatted);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    if (selectedTestId) {
      fetchQuestions(selectedTestId);
      setQuizStarted(false);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0);
      setAllAnswers([]);
      setSelectedAnswers([]);
    }
  }, [selectedTestId]);

  const handleStartQuiz = () => {
    if (!selectedTestId) {
      toast({
        title: 'Select a Test',
        description: 'Please select a test before starting.',
        variant: 'destructive',
      });
      return;
    }
    if (questions.length === 0) {
      toast({
        title: 'No Questions',
        description: 'Selected test has no questions.',
        variant: 'destructive',
      });
      return;
    }

    // ✅ Request fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    }

    setQuizStarted(true);
    setTimeLeft(10);
  };

  const handleAnswerToggle = (optionIndex) => {
    const letter = optionIndexToLetter(optionIndex);
    setSelectedAnswers((prev) =>
      prev.includes(letter)
        ? prev.filter((a) => a !== letter)
        : [...prev, letter]
    );
  };

  const handleNextQuestion = () => {
    const updatedAnswers = [...allAnswers];
    updatedAnswers[currentQuestionIndex] = selectedAnswers.sort().join(',');
    setAllAnswers(updatedAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      completeQuiz(updatedAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setTimeLeft(10);
    }
  };

  const completeQuiz = (finalAnswers) => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const correctSet = new Set(q.answer.split(',').map((a) => a.trim().toUpperCase()));
      const userSet = new Set(
        (finalAnswers[idx] || '')
          .split(',')
          .map((a) => a.trim().toUpperCase())
          .filter((a) => a)
      );

      if (
        userSet.size > 0 &&
        correctSet.size === userSet.size &&
        [...correctSet].every((v) => userSet.has(v))
      ) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setQuizCompleted(true);
    setQuizStarted(false);

    toast({
      title: 'Quiz Completed!',
      description: `You scored ${correctCount} out of ${questions.length} (${((correctCount / questions.length) * 100).toFixed(0)}%)`,
      variant: 'default',
    });
  };

  useEffect(() => {
    if (!quizStarted || quizCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, currentQuestionIndex, selectedAnswers]);

  // ... UI rendering logic below remains unchanged ...
  // (Keep your loading spinner, quiz selector, questions, and result screen)

  // If you'd like me to resend the rest of the UI rendering code below this logic, just say so. ✅
};

export default Quiz;
