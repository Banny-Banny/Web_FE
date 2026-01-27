/**
 * Map View 컴포넌트 타입 정의
 */

import type { KakaoMap } from '@/commons/utils/kakao-map/types';

/**
 * Map View 컴포넌트 Props
 */
export interface MapViewProps {
  /** 지도 초기화 콜백 */
  onMapInit: (container: HTMLElement) => void;
  /** 지도 인스턴스 */
  map: KakaoMap | null;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 에러 메시지 */
  error?: string | null;
  /** 추가 CSS 클래스 */
  className?: string;
}
