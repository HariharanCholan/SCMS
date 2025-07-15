import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any local storage/session if needed here
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home or login
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">You have been logged out</h1>
      <p className="text-center max-w-md">
        You exited fullscreen mode or switched tabs during the quiz.
        For exam integrity, you have been logged out.
      </p>
      <p className="mt-6 text-sm text-gray-400">Redirecting to home...</p>
    </div>
  );
};

export default Logout;
