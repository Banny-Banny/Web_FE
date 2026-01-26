/**
 * Home Feature 타입 정의
 */

import type { KakaoMap } from '@/commons/utils/kakao-map/types';

/**
 * Home Feature Container Props
 */
export interface HomeFeatureProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 지도 상태
 */
export interface MapState {
  /** 지도 인스턴스 */
  map: KakaoMap | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}
