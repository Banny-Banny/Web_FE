/**
 * 지도 관리 기능 로직을 담당하는 훅
 */

import { useState, useCallback, useEffect } from 'react';
import type { KakaoMap } from '@/commons/utils/kakao-map/types';
import { DEFAULT_CENTER, DEFAULT_LEVEL, USER_LOCATION_LEVEL } from '../constants';

export interface UseMapControlProps {
  /** 지도 인스턴스 */
  map: KakaoMap | null;
  /** 사용자 위치 위도 */
  userLat?: number | null;
  /** 사용자 위치 경도 */
  userLng?: number | null;
}

export interface UseMapControlReturn {
  /** 지도를 리셋할 수 있는지 여부 */
  canReset: boolean;
  /** 지도 초기화 함수 */
  resetMap: () => void;
}

/**
 * 지도 관리 기능을 제공하는 훅
 */
export function useMapControl({ map, userLat, userLng }: UseMapControlProps): UseMapControlReturn {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // 사용자 위치가 있으면 사용, 없으면 기본 위치 사용
  const hasUserLocation = userLat !== null && userLat !== undefined && 
                          userLng !== null && userLng !== undefined;
  const initialLat = hasUserLocation ? userLat! : DEFAULT_CENTER.lat;
  const initialLng = hasUserLocation ? userLng! : DEFAULT_CENTER.lng;
  const initialLevel = hasUserLocation ? USER_LOCATION_LEVEL : DEFAULT_LEVEL;

  /**
   * 지도가 초기 상태와 다른지 확인
   */
  const checkIfMapChanged = useCallback(() => {
    if (!map || !window.kakao?.maps) {
      return false;
    }

    try {
      const currentCenter = map.getCenter();
      const currentLevel = map.getLevel();

      // 현재 위치와 초기 위치 비교
      const isPositionChanged =
        Math.abs(currentCenter.getLat() - initialLat) > 0.0001 ||
        Math.abs(currentCenter.getLng() - initialLng) > 0.0001;

      // 현재 레벨과 초기 레벨 비교
      const isLevelChanged = currentLevel !== initialLevel;

      return isPositionChanged || isLevelChanged;
    } catch (err) {
      console.error('지도 상태 확인 실패:', err);
      return false;
    }
    // updateTrigger는 의도적으로 의존성에 포함하여 지도 상태 변경 시 재계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, initialLat, initialLng, initialLevel, updateTrigger]);

  // canReset을 계산된 값으로 사용
  const canReset = checkIfMapChanged();

  /**
   * 지도를 초기 상태로 복원 (사용자 위치 또는 기본 위치)
   */
  const resetMap = useCallback(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    try {
      const center = new window.kakao.maps.LatLng(initialLat, initialLng);

      map.setCenter(center);
      map.setLevel(initialLevel);

      // 상태 업데이트 트리거
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('지도 리셋 실패:', err);
    }
  }, [map, initialLat, initialLng, initialLevel]);

  /**
   * 지도 이벤트 리스너 등록
   */
  useEffect(() => {
    if (!map || !window.kakao?.maps) {
      return;
    }

    // 지도 이동 이벤트
    const handleDragEnd = () => {
      setUpdateTrigger((prev) => prev + 1);
    };

    // 지도 확대/축소 이벤트
    const handleZoomChanged = () => {
      setUpdateTrigger((prev) => prev + 1);
    };

    window.kakao.maps.event.addListener(map, 'dragend', handleDragEnd);
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChanged);

    return () => {
      if (window.kakao?.maps) {
        window.kakao.maps.event.removeListener(map, 'dragend', handleDragEnd);
        window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChanged);
      }
    };
  }, [map]);

  return {
    canReset,
    resetMap,
  };
}
