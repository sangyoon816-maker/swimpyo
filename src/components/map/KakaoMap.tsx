'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import type { Coordinates } from '@/lib/geo';
import type { Place } from '@/types';

interface KakaoMapProps {
  places: Place[];
  currentLocation?: Coordinates | null;
  onMarkerClick?: (placeId: string) => void;
  className?: string;
}

function createCurrentLocationDot(): HTMLElement {
  const dot = document.createElement('div');
  dot.style.width = '14px';
  dot.style.height = '14px';
  dot.style.borderRadius = '50%';
  dot.style.background = '#5F8D4E';
  dot.style.border = '3px solid white';
  dot.style.boxShadow = '0 0 0 4px rgba(95,141,78,0.25), 0 1px 4px rgba(0,0,0,0.3)';
  return dot;
}

const SEOUL_CENTER = { lat: 37.5663, lng: 126.9779 };
const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

export default function KakaoMap({
  places,
  currentLocation,
  onMarkerClick,
  className,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const currentLocationOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    if (!scriptReady || mapRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    window.kakao.maps.load(() => {
      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
        level: 8,
      });
    });
  }, [scriptReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!scriptReady || !map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (places.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new window.kakao.maps.Marker({ position, map, title: place.name });

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(place.id));
      }

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    map.setBounds(bounds);
  }, [places, scriptReady, onMarkerClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!scriptReady || !map) return;

    currentLocationOverlayRef.current?.setMap(null);
    currentLocationOverlayRef.current = null;

    if (!currentLocation) return;

    const position = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
    currentLocationOverlayRef.current = new window.kakao.maps.CustomOverlay({
      position,
      content: createCurrentLocationDot(),
      map,
      zIndex: 10,
    });
  }, [currentLocation, scriptReady]);

  if (!KAKAO_MAP_KEY) {
    return (
      <div className={cn('flex items-center justify-center bg-[#F0EDE8] rounded-2xl px-6', className)}>
        <p className="text-sm text-[#6B7280] leading-relaxed text-center whitespace-pre-line">
          {'카카오맵 API 키가 설정되지 않았어요.\n.env.local에 NEXT_PUBLIC_KAKAO_MAP_KEY를 추가해주세요.'}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Script
        id="kakao-maps-sdk"
        src={`https://dapi.kakao.com/v3/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setScriptError(true)}
      />
      {scriptError ? (
        <div className="h-full w-full flex items-center justify-center bg-[#FDF0ED] rounded-2xl px-6">
          <p className="text-sm text-[#E07A5F] text-center">
            지도를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="h-full w-full rounded-2xl overflow-hidden bg-[#F0EDE8]" />
      )}
    </div>
  );
}
