/**
 * 내 캡슐 모달 타입 정의
 */

import type { GetCapsuleResponse } from '@/commons/apis/easter-egg/types';

/**
 * 내 캡슐 모달 Props
 */
export interface MyCapsuleModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 캡슐 정보 (viewers 포함) */
  capsule: GetCapsuleResponse | null;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}
