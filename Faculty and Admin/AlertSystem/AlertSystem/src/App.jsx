import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import { Toaster } from '@/components/ui/toaster';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('fireAlarmUser');
    const savedMessages = localStorage.getItem('fireAlarmMessages');
    const currentPath = window.location.pathname;

    let userData;

    if (savedUser) {
      try {
        userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('fireAlarmUser');
      }
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (err) {
        console.error('Failed to parse messages:', err);
        localStorage.removeItem('fireAlarmMessages');
      }
    }

    setLoading(false);

    // ✅ Redirect only if path is root "/"
    if (userData && currentPath === '/') {
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/adminalert');
        } else {
          navigate('/studentalert');
        }
      }, 0);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fireAlarmUser', JSON.stringify(userData));

    if (userData.role === 'admin') {
      navigate('/adminalert');
    } else {
      navigate('/studentalert');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fireAlarmUser');
    navigate('/login');
  };

  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('fireAlarmMessages', JSON.stringify(newMessages));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/adminalert"
          element={
            user?.role === 'admin' ? (
              <AdminDashboard
                user={user}
                onLogout={handleLogout}
                messages={messages}
                updateMessages={updateMessages}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/studentalert"
          element={
            user?.role === 'student' ? (
              <StudentDashboard
                user={user}
                onLogout={handleLogout}
                initialMessages={messages}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default AppWrapper;
