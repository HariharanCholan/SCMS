import React from 'react';
import { 
  UserCheck, 
  User,
  LogOut,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import axios from 'axios';

const Navigation = ({ activeTab, setActiveTab, user, onLogout }) => {
  const navItems = [
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
  ];

  const handleLogout = async () => {
    window.location.href = "http://localhost:5179/faculty/home"
  };

  return (
    <nav className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Smart Classroom</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-item flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === item.id ? 'active text-white' : 'text-slate-300 hover:text-green-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost"
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium"
              onClick={handleLogout}
            >
              ←  Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
