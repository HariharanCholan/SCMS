import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardView } from '@/components/views/DashboardView';
import { ClassesListView } from '@/components/views/ClassesListView';
import { StudentsListView } from '@/components/views/StudentsListView';
import { ClassTopPerformersView } from '@/components/views/ClassTopPerformersView';
import { QuizzesListView } from '@/components/views/QuizzesListView';
import { LowPerformersView } from '@/components/views/LowPerformersView';
import { StudentPerformanceView } from '@/components/views/StudentPerformanceView';
import { StudentDetailView } from '@/components/views/StudentDetailView';
import StudentMarksEditor from '@/components/views/StudentMarksEditor';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';
import { generatePerformanceReport } from '@/lib/reportGenerator';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

function App() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Student Insights');
  const [view, setView] = useState('dashboard');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    overallTopPerformersCount: 0,
    totalQuizzes: 0,
    lowPerformersCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, quizzesRes] = await Promise.all([
          fetch('http://localhost:5000/api/insights/student'),
          fetch('http://localhost:5000/api/insights/classes'),
          fetch('http://localhost:5000/api/insights/quizzes'),
        ]);

        const [studentsData, classesData, quizzesData] = await Promise.all([
          studentsRes.json(),
          classesRes.json(),
          quizzesRes.json(),
        ]);

        setAllStudents(studentsData);
        setAllClasses(classesData);
        setAllQuizzes(quizzesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const totalClasses = allClasses.length;
    const totalQuizzes = allStudents.reduce((sum, s) => sum + (s.subjects?.length || 0), 0);
    const topPerformers = allStudents.filter(s => {
      const avg = s.subjects?.length
        ? s.subjects.reduce((sum, sub) => sum + sub.marks, 0) / s.subjects.length
        : 0;
      return avg >= 80;
    });
    const lowPerformers = allStudents.filter(s => {
      const avg = s.subjects?.length
        ? s.subjects.reduce((sum, sub) => sum + sub.marks, 0) / s.subjects.length
        : 0;
      return avg < 50;
    });

    setStats({
      totalClasses,
      overallTopPerformersCount: topPerformers.length,
      totalQuizzes,
      lowPerformersCount: lowPerformers.length,
    });
  }, [allClasses, allStudents]);

  const handleNavClick = (item) => {
    setActiveTab(item);
    setView('dashboard');
    setSelectedClass(null);
    setSelectedStudent(null);
    if (item !== 'Student Insights') {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt!",
      });
    }
  };

  const handleStatCardClick = (type) => {
    setSelectedClass(null);
    setSelectedStudent(null);
    if (type === 'totalClasses') setView('classesList_students');
    else if (type === 'topPerformers') setView('classesList_topPerformers');
    else if (type === 'totalQuizzes') setView('classesList_quizzes');
    else if (type === 'lowPerformers') setView('classesList_lowPerformers');
  };

  const handleClassClick = (cls, nextView) => {
    setSelectedClass(cls);
    setView(nextView);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setView('studentDetail');
  };

  const handleBackClick = () => {
    if (view === 'studentDetail') {
      setView(selectedStudent?.cameFrom === 'classLowPerformersList' ? 'classLowPerformersList' : 'classStudentsList');
    } else if (view === 'classStudentsList') setView('classesList_students');
    else if (view === 'classTopPerformersList') setView('classesList_topPerformers');
    else if (view === 'classQuizzesList') setView('classesList_quizzes');
    else if (view === 'classLowPerformersList') setView('classesList_lowPerformers');
    else {
      setView('dashboard');
      setSelectedClass(null);
      setSelectedStudent(null);
    }
  };

  const handleExportReport = async () => {
    toast({
      title: '📄 Generating Report...',
      description: 'Fetching class-wise student data...',
    });
    try {
      const doc = generatePerformanceReport(allClasses, allStudents);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'SmartClassroom_PerformanceReport.docx');
      toast({
        title: '✅ Report Downloaded',
        description: 'The student performance report has been saved.',
      });
    } catch (error) {
      console.error('Report Error:', error);
      toast({
        title: '❌ Failed to Generate Report',
        description: 'Please check your data and try again.',
        variant: 'destructive',
      });
    }
  };

  const renderBackButton = () => (
    <Button variant="outline" onClick={handleBackClick} className="mb-6 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
      <ChevronLeft className="w-4 h-4 mr-2" /> Back
    </Button>
  );

  const renderContent = () => {
    switch (view) {
      case 'classesList_students':
        return <ClassesListView title="Select a Class to View Students" classes={allClasses} onClassClick={cls => handleClassClick(cls, 'classStudentsList')} renderBackButton={renderBackButton} />;
      case 'classStudentsList':
        return <StudentsListView classData={selectedClass} students={allStudents.filter(s => s.className === selectedClass?.name)} onStudentClick={handleStudentClick} renderBackButton={renderBackButton} />;
      case 'classesList_topPerformers':
        return <ClassesListView title="Select a Class to View Top Performers" classes={allClasses} onClassClick={cls => handleClassClick(cls, 'classTopPerformersList')} renderBackButton={renderBackButton} />;
      case 'classTopPerformersList':
        return <ClassTopPerformersView classData={selectedClass} students={allStudents} renderBackButton={renderBackButton} />;
      case 'classesList_quizzes':
        return <ClassesListView title="Select a Class to View Quizzes" classes={allClasses} onClassClick={cls => handleClassClick(cls, 'classQuizzesList')} renderBackButton={renderBackButton} />;
      case 'classQuizzesList':
        return <QuizzesListView classData={selectedClass} quizzes={allQuizzes.filter(q => q.classId === selectedClass?.id)} renderBackButton={renderBackButton} />;
      case 'classesList_lowPerformers':
        return <ClassesListView title="Select a Class to View Low Performers" classes={allClasses} onClassClick={cls => handleClassClick(cls, 'classLowPerformersList')} renderBackButton={renderBackButton} />;
      case 'classLowPerformersList':
        return <LowPerformersView classData={selectedClass} students={allStudents} onStudentClick={handleStudentClick} renderBackButton={renderBackButton} />;
      case 'studentDetail':
        return <StudentDetailView student={selectedStudent} renderBackButton={renderBackButton} />;
      case 'updateMarks':
        return <StudentMarksEditor onBack={handleBackClick} />;
      default:
        return <DashboardView stats={stats} onStatCardClick={handleStatCardClick} onExportReport={handleExportReport} allClasses={allClasses} allStudents={allStudents} />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar
        activeTab={activeTab}
        onNavClick={handleNavClick}
        onLogoClick={() => {
          setView('dashboard');
          setActiveTab('Student Insights');
          setSelectedClass(null);
          setSelectedStudent(null);
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Student Insights</h1>
            <p className="text-slate-400 mb-4">Monitor student performance and quiz analytics across classes</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white"
                onClick={() => setView('updateMarks')}
              >
                + Update Marks
              </Button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedClass?.name || '') + (selectedStudent?._id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
