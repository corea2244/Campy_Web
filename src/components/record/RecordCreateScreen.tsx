"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type {
  CampRecordDraft,
  RecordLocation,
  RecordPhoto,
  RecordDateType,
} from "@/types/record";

const MAX_PHOTOS = 20;

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function RecordCreateScreen() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dateType, setDateType] = useState<RecordDateType>("single");
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState<RecordLocation | null>(null);
  const [photos, setPhotos] = useState<RecordPhoto[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  function detectCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let placeName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ko`,
          );
          const data = await res.json();
          if (data.display_name) {
            placeName = data.display_name;
          }
        } catch {
          // 역지오코딩 실패 시 좌표 표시
        }

        setLocation({ placeName, latitude, longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError(
              "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError(
              "위치 정보를 가져올 수 없습니다. 기기의 위치 서비스가 켜져 있는지 확인해주세요.",
            );
            break;
          case err.TIMEOUT:
            setLocationError(
              "위치 요청 시간이 초과되었습니다. 다시 시도해주세요.",
            );
            break;
          default:
            setLocationError("위치를 가져오는 중 오류가 발생했습니다.");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  // 현재 위치 자동 세팅
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  function validate(): string[] {
    const errs: string[] = [];
    if (!title.trim()) errs.push("제목을 입력해주세요.");
    if (!location) errs.push("위치를 선택해주세요.");
    if (!startDate) errs.push("날짜를 입력해주세요.");
    if (dateType === "range") {
      if (!endDate) {
        errs.push("종료일을 입력해주세요.");
      } else if (endDate < startDate) {
        errs.push("종료일은 시작일보다 빠를 수 없습니다.");
      }
    }
    if (photos.length > MAX_PHOTOS) {
      errs.push(`사진은 최대 ${MAX_PHOTOS}개까지 첨부할 수 있습니다.`);
    }
    return errs;
  }

  function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    const draft: CampRecordDraft = {
      title: title.trim(),
      content: content.trim(),
      dateType,
      startDate,
      endDate: dateType === "range" ? endDate : null,
      location,
      photos,
    };

    // TODO: 실제 저장 로직 연동
    console.log("저장 payload:", draft);
    setSubmitted(true);
  }

  function handlePhotoAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_PHOTOS - photos.length;
    const selected = Array.from(files).slice(0, remaining);

    const newPhotos: RecordPhoto[] = selected.map((file) => ({
      uri: URL.createObjectURL(file),
      fileName: file.name,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  }

  function handlePhotoRemove(index: number) {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed.uri.startsWith("blob:")) {
        URL.revokeObjectURL(removed.uri);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleLocationSelect(loc: RecordLocation) {
    setLocation(loc);
    setShowLocationSearch(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          기록이 저장되었습니다
        </h2>
        <p className="text-blue-400 text-sm mb-8">
          새로운 백패킹 여정이 추가되었어요
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
            <span className="text-sm">돌아가기</span>
          </Link>
          <h1 className="text-lg font-bold text-blue-900">기록하기</h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6 pb-32">
        {/* 제목 */}
        <section>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 지리산 1박 2일 백패킹"
            className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
          />
        </section>

        {/* 날짜 */}
        <section>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            날짜 <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setDateType("single")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateType === "single"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              하루
            </button>
            <button
              type="button"
              onClick={() => setDateType("range")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateType === "range"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              기간
            </button>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
            />
            {dateType === "range" && (
              <>
                <span className="text-blue-400 text-sm font-medium">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="flex-1 px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
                />
              </>
            )}
          </div>
        </section>

        {/* 위치 */}
        <section>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            위치 <span className="text-red-400">*</span>
          </label>
          {locationLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-400 text-sm">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              현재 위치를 가져오는 중...
            </div>
          ) : location ? (
            <>
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 bg-white">
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-900 break-words">
                    {location.placeName}
                  </p>
                  <p className="text-xs text-blue-400 mt-0.5">
                    {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationSearch((v) => !v)}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                {showLocationSearch ? "닫기" : "위치 변경하기"}
              </button>
              {showLocationSearch && (
                <LocationManualInput onSelect={handleLocationSelect} />
              )}
            </>
          ) : (
            <>
              {locationError && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 mb-2">
                  <svg
                    className="w-4 h-4 text-amber-500 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-amber-700">{locationError}</p>
                    <button
                      type="button"
                      onClick={detectCurrentLocation}
                      className="mt-1 text-xs text-amber-600 hover:text-amber-800 font-medium underline"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}
              <p className="text-sm text-blue-400 px-1 mb-1">
                장소명으로 검색하여 위치를 선택해주세요.
              </p>
              <LocationManualInput onSelect={handleLocationSelect} />
            </>
          )}
        </section>

        {/* 사진 */}
        <section>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            사진{" "}
            <span className="text-blue-400 font-normal">
              ({photos.length} / {MAX_PHOTOS})
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-blue-200 group"
              >
                <img
                  src={photo.uri}
                  alt={photo.fileName || `사진 ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handlePhotoRemove(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs mt-0.5">추가</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoAdd}
            className="hidden"
          />
        </section>

        {/* 내용 */}
        <section>
          <label className="block text-sm font-semibold text-blue-900 mb-2">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여행 에피소드, 날씨, 식사, 메모 등 자유롭게 기록하세요"
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow resize-none"
          />
        </section>

        {/* Validation 에러 */}
        {errors.length > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-red-500 flex items-center gap-2">
                <span>•</span> {err}
              </p>
            ))}
          </div>
        )}
      </main>

      {/* 저장 버튼 (하단 고정) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-blue-100 p-4">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* 위치 수동 입력 (간이 검색) */
function LocationManualInput({
  onSelect,
}: {
  onSelect: (loc: RecordLocation) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecordLocation[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ko`,
      );
      const data = await res.json();
      setResults(
        data.map(
          (item: { display_name: string; lat: string; lon: string }) => ({
            placeName: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
          }),
        ),
      );
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="장소명으로 검색 (예: 지리산 성삼재)"
          className="flex-1 px-4 py-3 rounded-xl border border-blue-200 bg-white text-blue-900 placeholder:text-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0"
        >
          {searching ? "검색중..." : "검색"}
        </button>
      </div>
      {results.length > 0 && (
        <ul className="mt-2 rounded-xl border border-blue-200 bg-white overflow-hidden divide-y divide-blue-100">
          {results.map((loc, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  onSelect(loc);
                  setResults([]);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
              >
                <p className="text-sm text-blue-900 line-clamp-1">
                  {loc.placeName}
                </p>
                <p className="text-xs text-blue-400 mt-0.5">
                  {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
