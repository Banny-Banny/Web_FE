/**
 * @fileoverview DualButton 컴포넌트 타입 정의
 */

import type { ButtonSize, ButtonVariant } from '../button/types';

/**
 * DualButton 컴포넌트 Props
 */
export interface DualButtonProps {
  /**
   * 취소 버튼 텍스트 (필수)
   */
  cancelLabel: string;

  /**
   * 확인 버튼 텍스트 (필수)
   */
  confirmLabel: string;

  /**
   * 버튼 크기 (선택, 기본값: 'L')
   */
  size?: ButtonSize;

  /**
   * 취소 버튼 variant (선택, 기본값: 'outline')
   */
  cancelVariant?: ButtonVariant;

  /**
   * 확인 버튼 variant (선택, 기본값: 'primary')
   */
  confirmVariant?: ButtonVariant;

  /**
   * 전체 너비 사용 여부 (선택, 기본값: true)
   * width가 지정되면 무시됨
   */
  fullWidth?: boolean;

  /**
   * 커스텀 너비 (선택)
   * 숫자(px) 또는 퍼센트 문자열 지정 가능
   * @example width={300} // 300px
   * @example width="80%" // 80%
   */
  width?: string | number;

  /**
   * 확인 버튼 비활성화 상태 (선택, 기본값: false)
   * Note: 취소 버튼(왼쪽)은 항상 활성화 상태입니다.
   */
  confirmDisabled?: boolean;

  /**
   * 취소 버튼 클릭 핸들러 (필수)
   */
  onCancelPress: () => void;

  /**
   * 확인 버튼 클릭 핸들러 (필수)
   */
  onConfirmPress: () => void;

  /**
   * 추가 className (선택)
   */
  className?: string;
}
