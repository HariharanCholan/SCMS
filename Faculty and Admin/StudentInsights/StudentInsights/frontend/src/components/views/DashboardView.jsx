import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/common/StatCard';
import { PerformanceChart } from '@/components/common/PerformanceChart';
import { Users, BarChart3, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import axios from 'axios';

export function DashboardView({ onStatCardClick }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8002/api/student')
      .then(res => setStudents(res.data))
      .catch(err => console.error('Error fetching students:', err));
  }, []);

  const calculateAverage = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;
    const total = subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
    return total / subjects.length;
  };

  const topPerformers = students.filter(s => calculateAverage(s.subjects) >= 80);
  const lowPerformers = students.filter(s => calculateAverage(s.subjects) < 50);

  const performanceData = [
    {
      label: 'Excellent (>=90%)',
      value: students.filter(s => calculateAverage(s.subjects) >= 90).length,
      percentage: students.length ? Math.round((students.filter(s => calculateAverage(s.subjects) >= 90).length / students.length) * 100) : 0
    },
    {
      label: 'Good (80-89%)',
      value: students.filter(s => {
        const avg = calculateAverage(s.subjects);
        return avg >= 80 && avg < 90;
      }).length,
      percentage: students.length ? Math.round((students.filter(s => {
        const avg = calculateAverage(s.subjects);
        return avg >= 80 && avg < 90;
      }).length / students.length) * 100) : 0
    },
    {
      label: 'Needs Improvement (<80%)',
      value: students.filter(s => calculateAverage(s.subjects) < 80).length,
      percentage: students.length ? Math.round((students.filter(s => calculateAverage(s.subjects) < 80).length / students.length) * 100) : 0
    }
  ];

  const classNames = Array.from(new Set(students.map(s => s.className)));

  const getClassComparisonChartData = () => {
    const classAverages = classNames.map(name => {
      const studentsInClass = students.filter(s => s.className === name);
      const allSubjects = studentsInClass.flatMap(s => s.subjects || []);
      return {
        name,
        averageScore: calculateAverage(allSubjects),
      };
    });

    return {
      labels: classAverages.map(c => c.name),
      datasets: [
        {
          label: 'Class Average Score',
          data: classAverages.map(c => c.averageScore),
          backgroundColor: classAverages.map((_, idx) => `hsla(${idx * (360 / classAverages.length)}, 70%, 60%, 0.6)`),
          borderColor: classAverages.map((_, idx) => `hsla(${idx * (360 / classAverages.length)}, 70%, 60%, 1)`),
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Classes" 
          value={classNames.length} 
          icon={Users} 
          colorClass="blue-400"
          onClick={() => onStatCardClick('totalClasses')} 
          delay={0.1} 
        />
        <StatCard 
          title="Top Performers" 
          value={topPerformers.length}
          valueSubtitle="(>80% Avg)"
          icon={TrendingUp} 
          colorClass="green-400"
          onClick={() => onStatCardClick('topPerformers')} 
          delay={0.2} 
        />
        <StatCard 
          title="Total Test" 
          value={students.reduce((count, s) => count + (s.subjects?.length || 0), 0)} 
          icon={FileText} 
          colorClass="purple-400"
          onClick={() => onStatCardClick('totalQuizzes')} 
          delay={0.3} 
        />
        <StatCard 
          title="Low Performers" 
          value={lowPerformers.length}
          valueSubtitle="(<50% Avg)"
          icon={TrendingDown} 
          colorClass="red-400"
          onClick={() => onStatCardClick('lowPerformers')} 
          delay={0.4} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-8 card-hover"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Class Performance Comparison</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">Average scores of all classes</p>
        <div className="h-96 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            {classNames.length > 0 ? (
                <PerformanceChart data={getClassComparisonChartData()} title="Class Averages" />
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500">No class data available for comparison.</p>
                </div>
            )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 card-hover"
      >
        <h2 className="text-xl font-bold text-white mb-2">Overall Performance Distribution</h2>
        <p className="text-slate-400 text-sm mb-6">Student score ranges across all classes</p>
        <div className="space-y-4">
          {performanceData.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-slate-300 text-sm">{item.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-slate-700 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${
                      item.label.includes('Excellent') ? 'progress-bar' :
                      item.label.includes('Good') ? 'progress-bar-orange' : 'progress-bar-red'
                    }`}
                    initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.8 }}
                  />
                </div>
                <span className="text-white font-semibold text-sm w-8 text-right">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
