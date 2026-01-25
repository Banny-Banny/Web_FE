/**
 * @fileoverview Modal 컴포넌트 타입 정의
 * @description 모달 컴포넌트의 Props 및 관련 타입
 */

import type { ReactNode } from 'react';

/**
 * Modal 설정 타입
 */
export interface ModalConfig {
  /** 모달 내부에 표시할 컨텐츠 */
  children: ReactNode;
  /** 모달 가로 크기 (number: px, string: '%' 또는 'auto') */
  width?: number | string;
  /** 모달 세로 크기 (number: px, string: '%' 또는 'auto') */
  height?: number | string;
  /** 모달 컨테이너 패딩 (기본값: 0) */
  padding?: number;
  /** 뒷배경 클릭 시 모달 닫기 여부 (기본값: true) */
  closeOnBackdropPress?: boolean;
  /** 모달 닫힐 때 호출되는 콜백 함수 */
  onClose?: () => void;
  /** 애니메이션 비활성화 여부 (기본값: false) */
  disableAnimation?: boolean;
}

/**
 * Modal Props 타입
 */
export interface ModalProps extends ModalConfig {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
}

/**
 * 모달 상태 타입
 */
export interface ModalState {
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 모달 설정 */
  config: ModalConfig | null;
}
