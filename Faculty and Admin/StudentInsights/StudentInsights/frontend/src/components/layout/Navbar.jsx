import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Home, Users, Calendar, FileText,
  AlertTriangle, Settings, BookOpen
} from 'lucide-react';

export function Navbar({ activeTab, onNavClick, onLogoClick }) {
  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: Users, label: 'Student Insights' },
    { icon: Calendar, label: 'Attendance' },
    { icon: FileText, label: 'Quiz Generator' },
    { icon: AlertTriangle, label: 'Emergency Alerts' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side: Logo + nav items */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onLogoClick}>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Smart<br />Classroom</span>
            </div>

            {/* Nav Items */}
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavClick(item.label)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeTab === item.label
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-300 hover:bg-slate-700/40 hover:text-white'}
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Back to Dashboard */}
          <div className="flex-shrink-0">
            <Button
              className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium"
              onClick={() => window.location.href = 'http://localhost:5179/faculty/home'}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
