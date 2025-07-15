import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DocumentManagerPage from './pages/DocumentManagerPage';
import QuestionGeneratorPage from './pages/QuestionGeneratorPage';
import QuestionsDashboardPage from './pages/QuestionsDashboardPage';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/documents" element={<DocumentManagerPage />} />
          <Route path="/generate-questions" element={<QuestionGeneratorPage />} />
          <Route path="/questions-dashboard" element={<QuestionsDashboardPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;