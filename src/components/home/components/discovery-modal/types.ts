/**
 * 발견 성공 모달 타입 정의
 */

import type { GetCapsuleResponse } from '@/commons/apis/easter-egg/types';

/**
 * 발견 성공 모달 Props
 */
export interface DiscoveryModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 캡슐 정보 */
  capsule: GetCapsuleResponse | null;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 발견 기록 완료 후 콜백 (선택) */
  onDiscoveryRecorded?: () => void;
}
