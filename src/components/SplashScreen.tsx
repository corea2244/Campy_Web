"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 z-50">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200 animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,320 L0,240 Q120,100 240,200 Q360,80 480,160 Q600,40 720,120 Q840,20 960,100 Q1080,60 1200,140 Q1320,80 1440,180 L1440,320 Z"
            fill="#1e3a8a"
            opacity="0.4"
          />
          <path
            d="M0,320 L0,260 Q180,140 360,220 Q540,100 720,180 Q900,80 1080,160 Q1260,120 1440,200 L1440,320 Z"
            fill="#1e3a8a"
            opacity="0.6"
          />
          <path
            d="M0,320 L0,280 Q200,200 400,260 Q600,180 800,240 Q1000,200 1200,250 Q1350,230 1440,260 L1440,320 Z"
            fill="#172554"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Icon + Text */}
      <div className="relative flex flex-col items-center gap-6 animate-fade-in">
        {/* App Icon */}
        <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/30 animate-float">
          <img src="/icon.svg" alt="Campy" className="w-full h-full" />
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            Campy
          </h1>
          <p className="mt-2 text-blue-300 text-sm tracking-widest">
            백패킹 기록
          </p>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="relative mt-16 w-48">
        <div className="h-1 w-full rounded-full bg-blue-800/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-sky-300 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center text-xs text-blue-400 tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
}
