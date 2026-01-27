import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 위치 추적 훅
 * Geolocation API를 사용하여 실시간 위치를 추적합니다.
 */
export const useLocationTracking = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;

  /**
   * 위치 추적 시작
   */
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsTracking(true);
    setError(null);

    // 위치 추적 옵션
    const options: PositionOptions = {
      enableHighAccuracy: false, // 배터리 절약을 위해 정밀도 낮춤
      timeout: 10000, // 10초 타임아웃
      maximumAge: 30000, // 30초 동안 캐시된 위치 허용
    };

    /**
     * 위치 업데이트 성공 콜백
     */
    const onSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setError(null);
      retryCountRef.current = 0; // 성공 시 재시도 카운트 초기화
    };

    /**
     * 위치 업데이트 실패 콜백
     */
    const onError = (err: GeolocationPositionError) => {
      let errorMessage = '위치를 가져올 수 없습니다.';

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다.';
          break;
        case err.TIMEOUT:
          errorMessage = '위치 요청 시간이 초과되었습니다.';
          break;
      }

      setError(errorMessage);

      // 재시도 로직
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        console.warn(`위치 추적 재시도 (${retryCountRef.current}/${maxRetries})`);

        // 1초 후 재시도
        setTimeout(() => {
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
          }
          watchIdRef.current = navigator.geolocation.watchPosition(
            onSuccess,
            onError,
            options
          );
        }, 1000);
      } else {
        console.error('위치 추적 최대 재시도 횟수 초과');
        setIsTracking(false);
      }
    };

    // 위치 추적 시작
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options
    );
  }, []);

  /**
   * 위치 추적 중지
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    retryCountRef.current = 0;
  }, []);

  /**
   * 컴포넌트 언마운트 시 위치 추적 중지
   */
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    latitude,
    longitude,
    isTracking,
    error,
    startTracking,
    stopTracking,
  };
};
