"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainScreen from "@/components/MainScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 4500);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

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
