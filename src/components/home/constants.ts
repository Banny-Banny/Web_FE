/**
 * Home Feature 상수 정의
 */

/**
 * 카카오 지도 기본 설정
 */

/**
 * 기본 위치: 서울시청 (Geolocation 실패 시 사용)
 */
export const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.9780,
} as const;

/**
 * 기본 확대/축소 레벨
 * 1-14 사이의 값 (1: 가장 확대, 14: 가장 축소)
 */
export const DEFAULT_LEVEL = 5;

/**
 * 사용자 위치 기준 확대/축소 레벨
 * 사용자 위치를 가져왔을 때 사용하는 레벨
 */
export const USER_LOCATION_LEVEL = 7;

/**
 * 지도 최소 확대/축소 레벨
 */
export const MIN_LEVEL = 1;

/**
 * 지도 최대 확대/축소 레벨
 */
export const MAX_LEVEL = 14;

/**
 * 주소 조회 디바운싱 시간 (ms)
 */
export const ADDRESS_DEBOUNCE_TIME = 500;
