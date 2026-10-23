import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  BarChart3,
  ListChecks,
  Clock,
  Loader2,
  LogOut
} from 'lucide-react';

import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { toast } from './components/ui/use-toast';
import { StudentInfoCard } from './components/cards/StudentInfoCard';
import { StatsCard } from './components/cards/StatsCard';
import { HorizontalBarChart } from './components/charts/HorizontalBarChart';
import { ClassComparisonChart } from './components/charts/ClassComparisonChart';
import { Modal } from './Modal';
import { TestHistoryTable } from './components/tables/TestHistoryTable';
import { getGrade } from './lib/utils';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:5000';


const App = () => {
  const [subjectData, setSubjectData] = useState([]);
  const [cgpaHistoryData, setCgpaHistoryData] = useState([]);
  const [testHistoryData, setTestHistoryData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTestsAttendedModalOpen, setIsTestsAttendedModalOpen] = useState(false);
  const [isCgpaHistoryModalOpen, setIsCgpaHistoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [subjectRes, cgpaRes, perfRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/subjects`),
          fetch(`${API_BASE_URL}/api/cgpahistory`),
          fetch(`${API_BASE_URL}/api/performance`)
        ]);

        if (!subjectRes.ok || !cgpaRes.ok || !perfRes.ok) {
          throw new Error('Error fetching one or more datasets');
        }

        const [subjectJSON, cgpaJSON, perfJSON] = await Promise.all([
          subjectRes.json(),
          cgpaRes.json(),
          perfRes.json()
        ]);

        const cleanedSubjects = (Array.isArray(subjectJSON) ? subjectJSON : [])
          .filter((s) => s && s.subject?.trim())
          .map((s) => ({
            ...s,
            score: typeof s.score === 'number' ? s.score : 0,
            maxScore: typeof s.maxScore === 'number' && s.maxScore > 0 ? s.maxScore : 100,
            status: s.status || 'attended',
            date: s.date ? new Date(s.date) : null
          }));
        setSubjectData(cleanedSubjects);

        const testHistories = cleanedSubjects.map((s) => ({
          subject: s.subject || 'N/A',
          date: s.date ? s.date.toLocaleDateString() : 'N/A',
          status: s.status,
          marks: `${s.score}/${s.maxScore}`,
          grade: getGrade(s.score, s.maxScore),
          score: s.score,
          maxScore: s.maxScore
        }));
        setTestHistoryData(testHistories);

        const cgpa = Array.isArray(cgpaJSON) ? cgpaJSON : [];
        const cleanedCgpa = cgpa.filter(
          (c) => typeof c.cgpa === 'number' && typeof c.semester === 'string' && c.semester.trim()
        );
        setCgpaHistoryData(cleanedCgpa);

        let performanceRaw = [];
        if (Array.isArray(perfJSON)) {
          if (perfJSON.length && perfJSON[0]?.performance && Array.isArray(perfJSON[0].performance)) {
            performanceRaw = perfJSON[0].performance;
          } else if (perfJSON.length && perfJSON[0]?.month && perfJSON[0]?.score !== undefined) {
            performanceRaw = perfJSON;
          }
        }

        const cleanedPerformance = performanceRaw
          .filter((p) => p && typeof p.month === 'string' && !isNaN(Number(p.score)))
          .map((p) => ({ month: p.month, score: Number(p.score) }));
        setPerformanceData(cleanedPerformance);
      } catch (err) {
        toast({
          title: '❌ Failed to load data',
          description: 'Check your backend server or database connection.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const attendedTests = useMemo(() => {
    return testHistoryData.filter((t) =>
      ['attended', 'present', 'Attended'].includes(t.status?.toLowerCase())
    );
  }, [testHistoryData]);

  const latestAttendedTest = useMemo(() => {
    return (
      attendedTests
        .filter((t) => t.date !== 'N/A')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    );
  }, [attendedTests]);

  const classComparisonData = useMemo(() => {
    return subjectData
      .filter((s) => s.status === 'attended' && s.maxScore > 0)
      .map((s) => ({
        subject: s.subject,
        averagePercentage: Math.round((s.score / s.maxScore) * 100)
      }));
  }, [subjectData]);

  const currentCGPA = useMemo(() => {
    const sorted = [...cgpaHistoryData]
      .filter((c) => typeof c.cgpa === 'number' && (c.date || c.semester))
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return sorted[0]?.cgpa?.toFixed(1) ?? 'N/A';
  }, [cgpaHistoryData]);

  const academicYear = useMemo(() => {
    const current = new Date().getFullYear();
    return `${current}-${(current + 1).toString().slice(-2)}`;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-gray-100 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-4" />
        <p className="text-xl text-gray-300">Loading Academic Dashboard...</p>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-gray-100">
      <Toaster />

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Academic Progress</h1>
          </div>

          <nav className="flex items-center gap-4">
            <span className="text-white font-semibold px-2 text-sm cursor-default border-b-2 border-white">
              Dashboard
            </span>
            {['Courses'].map((label) => (
              <Button
                key={label}
                variant="ghost"
                className="text-gray-300 hover:text-white px-2 text-sm"
                onClick={() =>
                  toast({
                    title: '🚧 Feature Coming Soon!',
                    description: `"${label}" is not implemented yet.`
                  })
                }
              >
                {label}
              </Button>
            ))}
            <a href="http://localhost:5174/quiz" className="text-gray-300 hover:text-white px-2 text-sm">
              📝 Attend Quiz
            </a>
            <a href="http://localhost:5178/studentalert" className="text-gray-300 hover:text-white px-2 text-sm">
              🔔 Notifications
            </a>
          </nav>

          {/* Logout + Year */}
          <div className="flex items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400">Academic Year {academicYear}</div>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = 'http://localhost:5173/')}
              className="text-gray-300 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <StudentInfoCard performanceData={performanceData} subjectData={subjectData} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={<TrendingUp className="w-8 h-8 text-green-400" />}
            value={latestAttendedTest?.score?.toString() || '-'}
            maxValue={latestAttendedTest?.maxScore?.toString() || '-'}
            label={latestAttendedTest?.subject || 'N/A'}
            description="LATEST TEST SCORE"
            colorClass="from-green-700/30 to-emerald-700/30 border-green-600/40"
            textColorClass="text-green-400"
            delay={0.1}
          />
          <StatsCard
            icon={<Calendar className="w-8 h-8 text-blue-400" />}
            value={attendedTests.length.toString()}
            maxValue={testHistoryData.length.toString()}
            label={`${testHistoryData.length > 0 ? Math.round((attendedTests.length / testHistoryData.length) * 100) : 0}% Attendance`}
            description="TESTS ATTENDED"
            colorClass="from-blue-700/30 to-indigo-700/30 border-blue-600/40"
            textColorClass="text-blue-400"
            onClick={() => setIsTestsAttendedModalOpen(true)}
            delay={0.2}
          />
          <StatsCard
            icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
            value={currentCGPA}
            maxValue="10.0"
            label="Click to view history"
            description="CURRENT CGPA"
            colorClass="from-purple-700/30 to-violet-700/30 border-purple-600/40"
            textColorClass="text-purple-400"
            onClick={() => setIsCgpaHistoryModalOpen(true)}
            delay={0.3}
          />
        </div>

        <ClassComparisonChart data={classComparisonData} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Test History & Reports</h3>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">Subject Performance</h4>
            {subjectData.length > 0 ? (
              <HorizontalBarChart data={subjectData} />
            ) : (
              <p className="text-gray-400 text-center py-4">No data available.</p>
            )}
          </div>

          {testHistoryData.length > 0 ? (
            <TestHistoryTable data={testHistoryData} getGrade={getGrade} />
          ) : (
            <p className="text-gray-400 text-center py-4">No test history found.</p>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isTestsAttendedModalOpen}
        onClose={() => setIsTestsAttendedModalOpen(false)}
        title="Attended Tests Summary"
        icon={<ListChecks className="w-6 h-6 text-blue-400" />}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {attendedTests.map((test, i) => (
            <div key={i} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/70">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-white">{test.subject}</h5>
                <span className="text-sm text-green-400 font-medium">Attended</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Score: {test.score}/{test.maxScore} (Grade: {getGrade(test.score, test.maxScore)})
              </p>
              <p className="text-xs text-gray-400">Date: {test.date}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isCgpaHistoryModalOpen}
        onClose={() => setIsCgpaHistoryModalOpen(false)}
        title="CGPA History"
        icon={<Clock className="w-6 h-6 text-purple-400" />}
      >
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {cgpaHistoryData.slice().reverse().map((c, i) => (
            <div
              key={i}
              className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/70 flex justify-between items-center"
            >
              <div>
                <h5 className="font-semibold text-white">{c.semester || 'N/A'}</h5>
                <p className="text-xs text-gray-400">
                  {c.date ? new Date(c.date).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
              <span className="text-xl font-bold text-purple-300">
                {typeof c.cgpa === 'number' ? c.cgpa.toFixed(1) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default App;
