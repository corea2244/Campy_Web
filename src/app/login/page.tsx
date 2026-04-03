"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithProvider } from "@/services/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    errorParam === "auth_failed" ? "로그인에 실패했습니다. 다시 시도해주세요." : null,
  );

  async function handleLogin() {
    setLoading("kakao");
    setError(null);
    try {
      await signInWithProvider("kakao");
    } catch {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-6">
      {/* Logo & Title */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20">
          <img src="/icon.svg" alt="Campy" className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Campy</h1>
        <p className="text-blue-300 text-sm mt-2">
          나만의 백패킹 여정을 기록하세요
        </p>
      </div>

      {/* Login Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Kakao Login */}
        <button
          onClick={handleLogin}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#FEE500] text-[#191919] font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
            <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.58 1.68 4.85 4.22 6.13-.18.67-.67 2.43-.77 2.81-.12.47.17.47.36.34.15-.1 2.37-1.61 3.32-2.27.28.03.57.05.87.05 5.52 0 10-3.48 10-7.78S17.52 3 12 3z" />
          </svg>
          {loading === "kakao" ? "로그인 중..." : "카카오로 로그인"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 max-w-sm w-full">
          <p className="text-sm text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-xs text-blue-400/50">
        로그인하면 개인 백패킹 기록을 저장하고 관리할 수 있습니다
      </p>
    </div>
  );
}
