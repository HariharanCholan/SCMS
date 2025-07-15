import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacultyLayout from '@/components/faculty/FacultyLayout';
import FacultyHome from '@/components/faculty/FacultyHome';
import Settings from '@/components/faculty/Settings';
import RedirectToExternal from '@/components/common/RedirectToExternal';

const FacultyDashboard = () => {
  return (
    <FacultyLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/faculty/home" replace />} />
        <Route path="/home" element={<FacultyHome />} />

        {/* 🔁 Redirects to external apps */}
        <Route
          path="/student-insights"
          element={<RedirectToExternal url="http://localhost:5175" />}
        />
        <Route
          path="/attendance"
          element={<RedirectToExternal url="http://localhost:5176" />}
        />
        <Route
          path="/quiz-generator"
          element={<RedirectToExternal url="http://localhost:5177" />}
        />
        <Route
          path="/emergency-alerts"
          element={<RedirectToExternal url="http://localhost:5178/adminalert" />}
        />t

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </FacultyLayout>
  );
};

export default FacultyDashboard;
