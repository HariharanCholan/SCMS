import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const StudentProgressPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progressData, setProgressData] = useState(null);

  const handleLogin = () => {
    if (!username.trim() || !studentId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and student ID.",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('studentData', JSON.stringify({ username, studentId }));
    setIsLoggedIn(true);
    fetchProgressData(); 
    toast({
      title: "Login Successful",
      description: `Welcome, ${username}!`
    });
  };

  const fetchProgressData = () => {
    setProgressData({
      overallCompletion: 75,
      courses: [
        { name: "Introduction to Web Development", progress: 90, grade: "A" },
        { name: "Data Structures and Algorithms", progress: 60, grade: "B+" },
        { name: "Database Management", progress: 75, grade: "A-" },
      ],
      recentActivity: [
        "Completed 'Responsive Design' module in Web Development",
        "Submitted Assignment 3 for Data Structures",
        "Scored 85% on Quiz 2 in Database Management"
      ]
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('studentData');
    setIsLoggedIn(false);
    setUsername('');
    setStudentId('');
    setProgressData(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };


  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors z-10 p-2 rounded-lg glass-effect"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </motion.button>

      <div className="max-w-4xl mx-auto pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-3xl p-6 md:p-10 shadow-2xl"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">
            Student Progress & Tracking
          </h1>

          {!isLoggedIn ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="STUDENT ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
              </div>
              
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                LOGIN TO VIEW PROGRESS
              </Button>
            </motion.div>
          ) : (
            progressData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Welcome, {JSON.parse(localStorage.getItem('studentData')).username}!</h2>
                  <Button onClick={handleLogout} variant="destructive" className="bg-red-500 hover:bg-red-600">Logout</Button>
                </div>

                {/* Overall Progress */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Overall Completion</h3>
                  <div className="w-full bg-white/20 rounded-full h-6">
                    <motion.div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressData.overallCompletion}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <span className="text-sm font-medium text-white">{progressData.overallCompletion}%</span>
                    </motion.div>
                  </div>
                </div>

                {/* Courses */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
                  <div className="space-y-4">
                    {progressData.courses.map((course, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index }}
                        className="p-4 bg-white/10 rounded-lg shadow-md"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-blue-200">{course.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${course.grade.startsWith('A') ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>{course.grade}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-4">
                          <motion.div 
                            className="bg-gradient-to-r from-sky-400 to-cyan-400 h-4 rounded-full flex items-center justify-end pr-1"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 * index + 0.2 }}
                          >
                            <span className="text-xs font-medium text-white">{course.progress}%</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
                  <ul className="list-disc list-inside space-y-2 pl-2 text-blue-200">
                    {progressData.recentActivity.map((activity, index) => (
                       <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + 0.1 * index }}
                       >
                        {activity}
                       </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProgressPage;