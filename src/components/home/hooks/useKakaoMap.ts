/**
 * 카카오 지도 인스턴스 생성 및 관리 훅
 */

import { useState, useCallback, useRef } from 'react';
import type { KakaoMap } from '@/commons/utils/kakao-map/types';
import { DEFAULT_CENTER, DEFAULT_LEVEL } from '../config/map-config';

export interface UseKakaoMapReturn {
  /** 지도 인스턴스 */
  map: KakaoMap | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 지도 초기화 함수 */
  initializeMap: (container: HTMLElement) => void;
  /** 지도 리셋 함수 */
  resetMap: () => void;
}

/**
 * 카카오 지도 인스턴스를 생성하고 관리하는 훅
 */
export function useKakaoMap(): UseKakaoMapReturn {
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);

  /**
   * 지도를 초기화합니다
   */
  const initializeMap = useCallback((container: HTMLElement) => {
    try {
      setIsLoading(true);
      setError(null);

      // kakao 객체 확인
      if (!window.kakao?.maps) {
        throw new Error('카카오 지도 API가 로드되지 않았습니다.');
      }

      // 지도 옵션 설정
      const center = new window.kakao.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng
      );

      const options = {
        center,
        level: DEFAULT_LEVEL,
      };

      // 지도 인스턴스 생성
      const mapInstance = new window.kakao.maps.Map(container, options);
      
      // 지도 조작 기능 활성화
      mapInstance.setDraggable(true); // 드래그 이동 활성화
      mapInstance.setZoomable(true);  // 확대/축소 활성화
      
      mapRef.current = mapInstance;
      setMap(mapInstance);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '지도를 초기화하는데 실패했습니다.';
      setError(errorMessage);
      setIsLoading(false);
    }
  }, []);

  /**
   * 지도를 기본 상태로 리셋합니다
   */
  const resetMap = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps) {
      return;
    }

    try {
      const center = new window.kakao.maps.LatLng(
        DEFAULT_CENTER.lat,
        DEFAULT_CENTER.lng
      );
      
      mapRef.current.setCenter(center);
      mapRef.current.setLevel(DEFAULT_LEVEL);
    } catch (err) {
      console.error('지도 리셋 실패:', err);
    }
  }, []);

  return {
    map,
    isLoading,
    error,
    initializeMap,
    resetMap,
  };
}
