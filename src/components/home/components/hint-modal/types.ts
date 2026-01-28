/**
 * 힌트 모달 타입 정의
 */

import type { GetCapsuleResponse } from '@/commons/apis/easter-egg/types';

/**
 * 힌트 모달 Props
 */
export interface HintModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 캡슐 정보 */
  capsule: GetCapsuleResponse | null;
  /** 거리 (미터) */
  distance?: number;
  /** 방향 (도, 0-360) */
  direction?: number;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}
