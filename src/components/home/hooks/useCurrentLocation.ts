/**
 * 현재 위치 추적 훅
 * 지도 중앙점의 좌표를 추적합니다.
 */

import { useState, useCallback, useEffect } from 'react';
import type { KakaoMap } from '@/commons/utils/kakao-map/types';

export interface UseCurrentLocationReturn {
  /** 현재 중앙점 좌표 */
  center: { lat: number; lng: number } | null;
  /** 중앙점 업데이트 함수 */
  updateCenter: (lat: number, lng: number) => void;
}

/**
 * 지도 중앙점의 좌표를 추적하는 훅
 * 
 * @param map 카카오 지도 인스턴스
 * @returns 현재 중앙점 좌표 및 업데이트 함수
 */
export function useCurrentLocation(map: KakaoMap | null): UseCurrentLocationReturn {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);

  /**
   * 중앙점 좌표를 업데이트합니다
   */
  const updateCenter = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng });
  }, []);

  /**
   * 지도 인스턴스가 변경되면 초기 중앙점을 설정합니다
   */
  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    // 초기 중앙점 가져오기를 비동기로 처리
    const initializeCenter = () => {
      try {
        const mapCenter = map.getCenter();
        if (mapCenter) {
          const lat = mapCenter.getLat();
          const lng = mapCenter.getLng();
          updateCenter(lat, lng);
        }
      } catch (error) {
        console.error('지도 중앙점 가져오기 실패:', error);
      }
    };

    // 다음 틱에 실행
    const timeoutId = setTimeout(initializeCenter, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [map, updateCenter]);

  return {
    center,
    updateCenter,
  };
}
