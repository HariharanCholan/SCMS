import React from 'react';

const CheatingDetected = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-red-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Cheating Detected</h1>
        <p className="mt-4 text-lg">You have been disqualified from the quiz.</p>
      </div>
    </div>
  );
};

export default CheatingDetected;
