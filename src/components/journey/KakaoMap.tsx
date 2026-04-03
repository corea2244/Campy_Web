"use client";

import { useEffect, useRef } from "react";
import type { CampRecord } from "@/types/database";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  records: CampRecord[];
  selectedRecord: CampRecord | null;
  onMarkerClick: (record: CampRecord) => void;
}

export default function KakaoMap({
  records,
  selectedRecord,
  onMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // SDK 로드 및 지도 초기화
  useEffect(() => {
    const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!KAKAO_KEY) return;

    function initMap() {
      if (!mapRef.current) return;
      const { kakao } = window;

      const center =
        records.length > 0
          ? new kakao.maps.LatLng(records[0].latitude, records[0].longitude)
          : new kakao.maps.LatLng(36.5, 127.5); // 한국 중심

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: records.length > 0 ? 8 : 12,
      });

      mapInstanceRef.current = map;
      addMarkers(map, records);
    }

    // 완전히 로드된 경우 (kakao.maps.Map 생성자가 존재)
    if (window.kakao?.maps?.Map) {
      initMap();
      return;
    }

    // 스크립트는 로드됐지만 초기화 안 된 경우
    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    // 이미 스크립트가 있는지 확인
    const existing = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(initMap);
    };
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // records 변경 시 마커 갱신
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao?.maps) return;
    addMarkers(map, records);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);

  // selectedRecord 변경 시 지도 이동
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRecord || !window.kakao?.maps) return;
    if (selectedRecord.latitude == null || selectedRecord.longitude == null)
      return;

    const { kakao } = window;
    const position = new kakao.maps.LatLng(
      selectedRecord.latitude,
      selectedRecord.longitude,
    );
    map.panTo(position);
  }, [selectedRecord]);

  function addMarkers(map: any, records: CampRecord[]) {
    const { kakao } = window;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    records.forEach((record) => {
      if (record.latitude == null || record.longitude == null) return;

      const position = new kakao.maps.LatLng(
        record.latitude,
        record.longitude,
      );
      const marker = new kakao.maps.Marker({ map, position });

      kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick(record);
        map.panTo(position);
      });

      markersRef.current.push(marker);
    });

    // 여러 마커가 있으면 모두 보이도록 범위 조정
    if (records.length > 1) {
      const bounds = new kakao.maps.LatLngBounds();
      records.forEach((r) => {
        if (r.latitude != null && r.longitude != null) {
          bounds.extend(new kakao.maps.LatLng(r.latitude, r.longitude));
        }
      });
      map.setBounds(bounds);
    }
  }

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
}
