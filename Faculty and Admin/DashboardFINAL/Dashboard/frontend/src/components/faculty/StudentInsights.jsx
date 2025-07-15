import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Award, BookOpen, BarChart3, Target } from 'lucide-react';

const StudentInsights = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from backend API
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students');
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (loading) return <p className="text-white">Loading student data...</p>;

  const classStats = {
    totalStudents: students.length,
    averageScore: students.length
      ? Math.round(students.reduce((sum, student) => sum + student.avgScore, 0) / students.length)
      : 0,
    totalQuizzes: students.reduce((sum, student) => sum + student.quizzesCompleted, 0),
    topPerformer: students.length
      ? students.reduce((top, student) => (student.avgScore > top.avgScore ? student : top), students[0])
      : { name: '-', avgScore: 0 },
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBg = (score) => {
    if (score >= 90) return 'bg-green-500/20';
    if (score >= 80) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Student Insights</h1>
        <p className="text-gray-400">Monitor student performance and quiz analytics</p>
      </motion.div>

      {/* Class Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-white">{classStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Class Average</p>
                  <p className="text-3xl font-bold text-white">{classStats.averageScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Quizzes</p>
                  <p className="text-3xl font-bold text-white">{classStats.totalQuizzes}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Top Performer</p>
                  <p className="text-lg font-bold text-white">{classStats.topPerformer.name}</p>
                  <p className="text-sm text-green-400">{classStats.topPerformer.avgScore}%</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Student Performance List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Student Performance
            </CardTitle>
            <CardDescription className="text-gray-400">
              Individual student quiz performance and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-effect border border-gray-600 rounded-lg p-4 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{student.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {student.quizzesCompleted} quizzes completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Average Score</p>
                        <p className={`text-2xl font-bold ${getPerformanceColor(student.avgScore)}`}>
                          {student.avgScore}%
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Last Quiz</p>
                        <div className={`px-3 py-1 rounded-full ${getPerformanceBg(student.lastQuiz)}`}>
                          <span className={`font-semibold ${getPerformanceColor(student.lastQuiz)}`}>
                            {student.lastQuiz}%
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Progress</p>
                        <div className="flex items-center">
                          {student.lastQuiz > student.avgScore ? (
                            <TrendingUp className="h-5 w-5 text-green-400" />
                          ) : (
                            <Target className="h-5 w-5 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Student score ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Excellent (90-100%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-green-400 font-semibold">
                      {students.filter(s => s.avgScore >= 90).length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Good (80-89%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                      {students.filter(s => s.avgScore >= 80 && s.avgScore < 90).length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Needs Improvement (&lt;80%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-700 rounded-full">
                      <div className="w-1/4 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-red-400 font-semibold">
                      {students.filter(s => s.avgScore < 80).length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Manage student performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Export Performance Report
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Send Progress Updates
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <Award className="h-4 w-4 mr-2" />
                Generate Certificates
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentInsights;
