"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainScreen from "@/components/MainScreen";

const MIN_SPLASH_MS = 1500;

export default function Home() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("splashShown");
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          sessionStorage.setItem("splashShown", "1");
          setShowSplash(false);
        }, 500);
      }, remaining);
    };

    finish();
  }, [showSplash]);

  return (
    <>
      {showSplash && (
        <div
          className={`transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <SplashScreen />
        </div>
      )}
      {!showSplash && <MainScreen />}
    </>
  );
}
