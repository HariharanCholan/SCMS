import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  UploadCloud,
  FileText,
  MessageSquarePlus,
  LayoutDashboard,
  Brain,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload Docs', icon: UploadCloud },
  { href: '/documents', label: 'Manage Docs', icon: FileText },
  { href: '/generate-questions', label: 'Generate Questions', icon: MessageSquarePlus },
  { href: '/questions-dashboard', label: 'Questions Dashboard', icon: LayoutDashboard },
];

// ✅ Button placed at the end of navbar
const BackToDashboardButton = () => (
  <a
    href="http://localhost:5179/faculty/home"
    className="bg-blue-700 text-white px-3 py-1.5 rounded-md shadow hover:bg-blue-800 transition text-sm"
  >
    ← Back to Dashboard
  </a>
);

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background: 'linear-gradient(to bottom right, #3a7bd5, #004c8f, #3a6073)',
      }}
    >
      <header className="p-4 shadow-lg bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <nav className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Left: logo only */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white hover:opacity-90 transition-opacity"
          >
            <Brain size={32} />
            <span>Question Generation</span>
          </Link>

          {/* Right: nav items + back button */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {navItems.map((item) => (
              <li key={item.href} className="list-none">
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:bg-black hover:text-white',
                    location.pathname === item.href ? 'bg-black text-white shadow-md' : 'text-white/80'
                  )}
                >
                  <item.icon size={18} className="hidden md:inline-block" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <BackToDashboardButton />
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
