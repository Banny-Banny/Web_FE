/**
 * Map Controls 컴포넌트 타입 정의
 */

import type { KakaoMap } from '@/commons/utils/kakao-map/types';

/**
 * Map Controls 컴포넌트 Props
 */
export interface MapControlsProps {
  /** 지도 인스턴스 */
  map: KakaoMap | null;
  /** 사용자 위치 위도 */
  userLat?: number | null;
  /** 사용자 위치 경도 */
  userLng?: number | null;
  /** 추가 CSS 클래스 */
  className?: string;
}
