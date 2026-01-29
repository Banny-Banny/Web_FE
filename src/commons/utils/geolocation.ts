/**
 * @fileoverview GPS 위치 유틸리티 함수
 * @description GPS 위치 정보 검증 및 포맷팅 유틸리티
 */

/**
 * GPS 위치 정보 검증
 *
 * 위도와 경도가 유효한 범위 내에 있는지 확인합니다.
 *
 * @param {number} latitude - 위도 (-90 ~ 90)
 * @param {number} longitude - 경도 (-180 ~ 180)
 * @returns {boolean} 유효한 위치 정보인지 여부
 *
 * @example
 * ```typescript
 * validateGeolocation(37.5665, 126.9780); // true
 * validateGeolocation(100, 200); // false
 * ```
 */
export function validateGeolocation(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * GPS 위치 정보 포맷팅
 *
 * 위도와 경도를 소수점 6자리까지 표시하여 문자열로 반환합니다.
 *
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {string} 포맷팅된 위치 정보 ("위도, 경도" 형식)
 *
 * @example
 * ```typescript
 * formatGeolocation(37.5665, 126.9780); // "37.566500, 126.978000"
 * ```
 */
export function formatGeolocation(
  latitude: number,
  longitude: number
): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
