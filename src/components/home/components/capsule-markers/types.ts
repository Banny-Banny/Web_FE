/**
 * 캡슐 마커 컴포넌트 타입 정의
 */

import type { KakaoMap } from '@/commons/utils/kakao-map/types';
import type { CapsuleItem } from '@/commons/apis/easter-egg/types';

/**
 * 캡슐 마커 컴포넌트 Props
 */
export interface CapsuleMarkersProps {
  /** 카카오 지도 인스턴스 */
  map: KakaoMap | null;
  /** 캡슐 목록 */
  capsules: CapsuleItem[];
  /** 마커 클릭 핸들러 */
  onMarkerClick: (capsule: CapsuleItem) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
