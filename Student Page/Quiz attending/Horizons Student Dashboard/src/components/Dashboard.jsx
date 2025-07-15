import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, LogOut, Home, BookOpen, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StudentProgressContent from '@/components/StudentProgressContent';
import QuizLandingContent from '@/components/QuizLandingContent';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('quiz');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const panelVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setActiveView(newDirection > 0 ? 'progress' : 'quiz');
  };


  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center p-4 md:p-6 shadow-lg glass-effect z-20"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 p-2.5 rounded-xl shadow-md">
            <Home className="w-6 h-6 text-blue-900" />
          </div>
          <span className="text-white font-bold text-sm md:text-lg hidden sm:block">
            CHENNAI INSTITUTE OF TECHNOLOGY
          </span>
           <span className="text-white font-bold text-sm md:text-lg sm:hidden">
            CIT Dashboard
          </span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-white hover:bg-white/20"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/20"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setShowProfile(!showProfile)}
            className="text-white hover:bg-white/20"
          >
            <User className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline"
            className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-1 md:mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-grow flex relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeView}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute top-0 left-0 w-full h-full p-4 md:p-8 flex flex-col items-center justify-center"
            style={{
              background: activeView === 'quiz' 
                ? 'linear-gradient(135deg, #00B4D8, #0096C7)' 
                : 'linear-gradient(135deg, #0077B6, #023E8A)'
            }}
          >
            {activeView === 'quiz' ? (
              <QuizLandingContent onNavigate={() => navigate('/quiz')} />
            ) : (
              <StudentProgressContent onNavigate={() => navigate('/student-progress')} />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows and Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="p-3 bg-white/20 rounded-full text-white disabled:opacity-50"
            disabled={activeView === 'quiz'}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="flex space-x-3">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeView === 'quiz' ? 'bg-white scale-125' : 'bg-white/50'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeView === 'progress' ? 'bg-white scale-125' : 'bg-white/50'}`}></div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="p-3 bg-white/20 rounded-full text-white disabled:opacity-50"
            disabled={activeView === 'progress'}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </main>

      {/* Modals */}
      {showProfile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowProfile(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-card rounded-3xl p-8 max-w-md w-full text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Your name</h3>
                  <p className="text-gray-600">yourname@gmail.com</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-gray-600">Name</span><span>Your Name</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Email</span><span>yourname@gmail.com</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Student ID</span><span>CIT12345</span></div>
            </div>
            <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white">
              Edit Profile
            </Button>
          </motion.div>
        </motion.div>
      )}

      {showSettings && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-card rounded-3xl p-8 max-w-md w-full text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Theme</span>
                <select className="bg-gray-100 border rounded px-3 py-1">
                  <option>System Default</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span>Language</span>
                <select className="bg-gray-100 border rounded px-3 py-1">
                  <option>English</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
             <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white">
              Save Settings
            </Button>
          </motion.div>
        </motion.div>
      )}

      {showNotifications && (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowNotifications(false)}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-card rounded-3xl p-8 max-w-md w-full text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
                <p className="text-gray-600">No new notifications.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;