"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyRecords } from "@/services/records";
import type { CampRecord } from "@/types/database";

const KakaoMap = dynamic(() => import("@/components/journey/KakaoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
      <p className="text-blue-400 text-sm">지도 로딩 중...</p>
    </div>
  ),
});

export default function JourneyPage() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<CampRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CampRecord | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    getMyRecords()
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <p className="text-blue-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-blue-900 mb-2">
            아직 여정이 없습니다
          </h2>
          <p className="text-blue-400 text-sm mb-8">여정을 기록하세요</p>
          <Link
            href="/record/create"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium shadow-lg shadow-blue-300/50 hover:-translate-y-0.5 transition-all"
          >
            기록하러 가기
          </Link>
        </div>
        <Link
          href="/"
          className="mt-8 text-sm text-blue-400 hover:text-blue-600 underline transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const recordsWithLocation = records.filter(
    (r) => r.latitude != null && r.longitude != null,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center gap-3 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-lg font-bold text-blue-900">여정보기</h1>
      </header>

      {/* Map */}
      <div className="h-[45vh] relative">
        <KakaoMap
          records={recordsWithLocation}
          selectedRecord={selectedRecord}
          onMarkerClick={setSelectedRecord}
        />
        {/* Summary Card */}
        {selectedRecord && (
          <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl p-4 shadow-lg border border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-blue-900">
                  {selectedRecord.title}
                </h3>
                <p className="text-xs text-blue-400 mt-1">
                  {selectedRecord.start_date}
                  {selectedRecord.end_date &&
                    ` ~ ${selectedRecord.end_date}`}
                </p>
                {selectedRecord.place_name && (
                  <p className="text-xs text-blue-500 mt-1">
                    {selectedRecord.place_name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-blue-300 hover:text-blue-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="text-sm font-semibold text-blue-400 mb-3">
          전체 기록 ({records.length})
        </h2>
        <div className="flex flex-col gap-3">
          {records.map((record) => (
            <button
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`w-full text-left rounded-xl p-4 border transition-all ${
                selectedRecord?.id === record.id
                  ? "bg-blue-50 border-blue-300 shadow-md"
                  : "bg-white border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200"
              }`}
            >
              <h3 className="font-bold text-blue-900">{record.title}</h3>
              <p className="text-xs text-blue-400 mt-1">
                {record.start_date}
                {record.end_date && ` ~ ${record.end_date}`}
              </p>
              {record.place_name && (
                <p className="text-xs text-blue-500 mt-1">
                  {record.place_name}
                </p>
              )}
              {record.content && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {record.content}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
