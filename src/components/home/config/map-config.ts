/**
 * 카카오 지도 초기 설정값
 */

/**
 * 지도 초기 설정
 */
export const MAP_CONFIG = {
  /** 지도 초기 중심 좌표 (서울시청) */
  DEFAULT_CENTER: {
    lat: 37.5665,
    lng: 126.9780,
  },
  /** 지도 초기 확대/축소 레벨 (3: 전국 단위) */
  DEFAULT_LEVEL: 3,
  /** 지도 최소 확대/축소 레벨 */
  MIN_LEVEL: 1,
  /** 지도 최대 확대/축소 레벨 */
  MAX_LEVEL: 14,
} as const;

/**
 * 주소 조회 설정
 */
export const ADDRESS_CONFIG = {
  /** 주소 조회 디바운싱 시간 (ms) */
  DEBOUNCE_TIME: 500,
} as const;
