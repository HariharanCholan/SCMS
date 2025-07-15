// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Outlet />
    </div>
  );
}

export default App;