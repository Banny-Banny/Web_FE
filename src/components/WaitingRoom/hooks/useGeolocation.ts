/**
 * @fileoverview GPS 위치 수집 훅
 * @description Web Geolocation API를 통한 GPS 위치 정보 수집 훅
 */

import { useState, useCallback } from 'react';

/**
 * GPS 위치 정보
 */
export interface GeolocationData {
  latitude: number;
  longitude: number;
}

/**
 * GPS 위치 수집 훅
 *
 * Web Geolocation API를 사용하여 사용자의 현재 GPS 위치를 수집합니다.
 *
 * @returns GPS 위치 정보 및 수집 함수
 *
 * @example
 * ```typescript
 * const { location, error, isLoading, getCurrentLocation } = useGeolocation();
 *
 * const handleSubmit = async () => {
 *   try {
 *     const location = await getCurrentLocation();
 *     console.log('위치:', location);
 *   } catch (error) {
 *     console.error('위치 수집 실패:', error);
 *   }
 * };
 * ```
 */
export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 현재 GPS 위치 정보 수집
   *
   * @returns {Promise<GeolocationData>} GPS 위치 정보
   * @throws {Error} GPS 수집 실패 시 에러
   */
  const getCurrentLocation = useCallback(async (): Promise<GeolocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      // Geolocation API 지원 확인
      if (!navigator.geolocation) {
        throw new Error('GPS를 지원하지 않는 브라우저입니다');
      }

      // GPS 위치 정보 수집
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true, // 정확도 우선
            timeout: 10000, // 10초 타임아웃
            maximumAge: 0, // 캐시 사용 안 함 (최신 위치 정보)
          });
        }
      );

      const data: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(data);
      setIsLoading(false);
      return data;
    } catch (err: any) {
      // 에러 메시지 변환
      let errorMessage: string;

      if (err.code === 1) {
        // PERMISSION_DENIED
        errorMessage = '위치 권한을 허용해주세요';
      } else if (err.code === 2) {
        // POSITION_UNAVAILABLE
        errorMessage = 'GPS 신호를 받을 수 있는 곳으로 이동해주세요';
      } else if (err.code === 3) {
        // TIMEOUT
        errorMessage = '위치 정보를 가져오는 데 시간이 오래 걸립니다. 다시 시도해주세요';
      } else {
        errorMessage = err.message || '위치 정보를 가져올 수 없습니다';
      }

      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return { location, error, isLoading, getCurrentLocation };
}
