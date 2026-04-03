"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import MainScreen from "@/components/MainScreen";

const MIN_SPLASH_MS = 1500;

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) {
      setShowSplash(false);
      return;
    }

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        sessionStorage.setItem("splashShown", "1");
        setShowSplash(false);
      }, 500);
    }, MIN_SPLASH_MS);
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
