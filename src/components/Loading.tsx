// components/Loading.tsx

"use client";

import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [loadingText, setLoadingText] = useState('Initializing');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev.length < 20 ? prev + '.' : 'Initializing'));
    }, 500);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black text-green-500">
      <div className="text-center">
        <div className="text-3xl font-mono">{loadingText}</div>
        <div className="text-xl font-mono mt-2">Please wait{dots}</div>
      </div>
    </div>
  );
};

export default Loading;
