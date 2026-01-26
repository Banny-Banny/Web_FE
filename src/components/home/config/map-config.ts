/**
 * 카카오 지도 초기 설정
 */

import type { LatLng } from '@/commons/utils/kakao-map/types';

/**
 * 기본 위치: 서울시청
 */
export const DEFAULT_CENTER: LatLng = {
  lat: 37.5665,
  lng: 126.9780,
};

/**
 * 기본 확대/축소 레벨
 * 1-14 사이의 값 (1: 가장 확대, 14: 가장 축소)
 */
export const DEFAULT_LEVEL = 3;
