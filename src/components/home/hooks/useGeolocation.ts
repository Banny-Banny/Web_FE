/**
 * Geolocation API를 사용하여 사용자의 현재 위치를 가져오는 훅
 */

import { useState, useEffect } from 'react';

export interface GeolocationState {
  /** 위도 */
  latitude: number | null;
  /** 경도 */
  longitude: number | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 사용자의 현재 위치를 가져오는 훅
 * Geolocation API를 사용합니다.
 * 
 * @returns 현재 위치 정보 및 상태
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Geolocation API 지원 확인
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        isLoading: false,
        error: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
      });
      return;
    }

    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          isLoading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return state;
}
