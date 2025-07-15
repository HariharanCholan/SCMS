import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import DashboardSelector from '@/components/DashboardSelector';
import AdminDashboard from '@/components/admin/AdminDashboard';
import FacultyDashboard from '@/components/faculty/FacultyDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0F172A]">
        <Routes>
          <Route path="/" element={<DashboardSelector />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/faculty/*" element={<FacultyDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;