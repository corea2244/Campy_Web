"use client";

export default function MainScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col animate-fade-in">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
            <img src="/icon.svg" alt="Campy" className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 tracking-wide">
            Campy
          </h1>
        </div>
        <p className="text-blue-500 text-sm">나만의 백패킹 여정을 기록하세요</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 gap-6 max-w-lg mx-auto w-full">
        {/* 기록하기 Card */}
        <button className="group w-full rounded-2xl bg-white p-8 shadow-lg shadow-blue-100 border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-300/50 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">기록하기</h2>
              <p className="mt-1 text-sm text-blue-400">
                새로운 백패킹 여정을 기록합니다
              </p>
            </div>
          </div>
        </button>

        {/* 여정보기 Card */}
        <button className="group w-full rounded-2xl bg-white p-8 shadow-lg shadow-blue-100 border border-blue-100 hover:shadow-xl hover:shadow-blue-200/50 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-300/50 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">여정보기</h2>
              <p className="mt-1 text-sm text-blue-400">
                지난 여정들을 돌아봅니다
              </p>
            </div>
          </div>
        </button>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-blue-300">Campy &copy; 2026</p>
      </footer>
    </div>
  );
}
