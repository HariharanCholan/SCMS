// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@/App';
import '@/index.css';

import Dashboard from '@/components/Dashboard';
import QuizPage from '@/pages/QuizPage';
import StudentProgressPage from '@/pages/StudentProgressPage';
import Logout from '@/pages/Logout'; // ✅ Logout page

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'student-progress', element: <StudentProgressPage /> },
      { path: 'logout', element: <Logout /> },
      { path: '*', element: <Dashboard /> }, // catch-all route
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
