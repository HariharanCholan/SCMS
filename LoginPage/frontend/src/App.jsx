import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RedirectToExternal from "@/components/RedirectToExternal";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-based Dashboard Redirection */}
          <Route
            path="/dashboard/faculty"
            element={<RedirectToExternal url="http://localhost:5179/faculty/home" />}
          />
          <Route
            path="/dashboard/student"
            element={<RedirectToExternal url="http://localhost:5180/" />}
          />
          <Route
            path="/dashboard/admin"
            element={<RedirectToExternal url="http://localhost:5179/admin/home" />}
          />

        </Routes>

        {/* Toast Notifications */}
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
