import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Home, Users, UserCheck, FileText, AlertTriangle, Settings, User, LogOut } from 'lucide-react';

const FacultyLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/faculty/home', icon: Home },
    { label: 'Student Insights', path: '/faculty/student-insights', icon: Users },
    { label: 'Attendance', path: '/faculty/attendance', icon: UserCheck },
    { label: 'Quiz Generator', path: '/faculty/quiz-generator', icon: FileText },
    { label: 'Emergency Alerts', path: '/faculty/emergency-alerts', icon: AlertTriangle },
    { label: 'Settings', path: '/faculty/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold text-white">Smart Classroom</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm ${
                    isActive(item.path) 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = 'http://localhost:5173/'}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-6 py-8"
        >
          {children}
        </motion.div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-700">
        <div className="grid grid-cols-6 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 p-2 ${
                  isActive(item.path) ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default FacultyLayout;