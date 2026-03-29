"use client";

import { useEffect, useState } from "react";

const STARS = [
  { w: 2.1, h: 1.5, t: 4.9, l: 0.9, d: 0.2, dur: 3.5, o: 0.5 },
  { w: 2.4, h: 3.5, t: 13.1, l: 39.8, d: 0.4, dur: 3.5, o: 0.65 },
  { w: 1.5, h: 1.9, t: 5.0, l: 7.2, d: 2.4, dur: 2.1, o: 0.54 },
  { w: 1.6, h: 3.1, t: 33.2, l: 59.9, d: 0.0, dur: 3.6, o: 0.32 },
  { w: 2.8, h: 2.1, t: 26.4, l: 34.6, d: 2.1, dur: 2.6, o: 0.55 },
  { w: 1.4, h: 1.1, t: 38.5, l: 86.2, d: 2.7, dur: 2.7, o: 0.74 },
  { w: 1.1, h: 3.4, t: 34.8, l: 26.6, d: 1.3, dur: 2.8, o: 0.35 },
  { w: 3.3, h: 3.8, t: 23.6, l: 7.0, d: 3.0, dur: 3.5, o: 0.7 },
  { w: 3.2, h: 2.8, t: 30.6, l: 76.8, d: 1.7, dur: 2.8, o: 0.57 },
  { w: 2.5, h: 1.6, t: 7.5, l: 25.3, d: 2.0, dur: 3.4, o: 0.69 },
  { w: 2.1, h: 3.7, t: 31.0, l: 26.1, d: 1.9, dur: 3.7, o: 0.47 },
  { w: 2.3, h: 3.3, t: 26.2, l: 76.9, d: 0.3, dur: 2.6, o: 0.56 },
  { w: 3.1, h: 3.6, t: 34.5, l: 96.3, d: 1.3, dur: 2.9, o: 0.53 },
  { w: 3.6, h: 3.4, t: 29.5, l: 33.3, d: 0.4, dur: 3.3, o: 0.79 },
  { w: 2.8, h: 1.7, t: 36.8, l: 8.6, d: 1.5, dur: 3.1, o: 0.57 },
  { w: 3.2, h: 2.4, t: 39.1, l: 20.1, d: 0.5, dur: 2.8, o: 0.6 },
  { w: 1.9, h: 3.1, t: 15.6, l: 8.1, d: 1.1, dur: 3.2, o: 0.48 },
  { w: 1.5, h: 1.3, t: 0.6, l: 78.7, d: 2.1, dur: 3.7, o: 0.68 },
  { w: 1.8, h: 2.5, t: 22.7, l: 86.6, d: 1.7, dur: 2.5, o: 0.75 },
  { w: 2.4, h: 1.5, t: 33.7, l: 57.0, d: 0.2, dur: 3.4, o: 0.58 },
];

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
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200 animate-pulse"
            style={{
              width: `${star.w}px`,
              height: `${star.h}px`,
              top: `${star.t}%`,
              left: `${star.l}%`,
              animationDelay: `${star.d}s`,
              animationDuration: `${star.dur}s`,
              opacity: star.o,
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
