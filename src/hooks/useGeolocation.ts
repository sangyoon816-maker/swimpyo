'use client';

import { useCallback, useState } from 'react';
import type { Coordinates } from '@/lib/geo';

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unsupported' | 'error';

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unsupported');
      setError('이 브라우저에서는 위치 정보를 사용할 수 없어요');
      return;
    }

    setStatus('loading');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus('success');
      },
      (err) => {
        setCoords(null);
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setError('위치 권한이 거부되었어요');
        } else {
          setStatus('error');
          setError('위치 정보를 가져오지 못했어요');
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { status, coords, error, request };
}
