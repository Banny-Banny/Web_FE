/**
 * @fileoverview SubmitButton 컴포넌트
 * @description 타임캡슐 제출 버튼 컴포넌트
 */

'use client';

import type { SubmitButtonProps } from './types';
import styles from './styles.module.css';

/**
 * 타임캡슐 제출 버튼 컴포넌트
 *
 * 제출 조건 충족 여부에 따라 버튼 활성화/비활성화를 제어합니다.
 *
 * @param {SubmitButtonProps} props - 컴포넌트 props
 * @returns {JSX.Element} SubmitButton 컴포넌트
 *
 * @example
 * ```tsx
 * <SubmitButton
 *   disabled={false}
 *   onClick={() => console.log('제출 클릭')}
 *   isLoading={false}
 * />
 * ```
 */
export function SubmitButton({
  disabled,
  disabledReason,
  onClick,
  isLoading = false,
}: SubmitButtonProps) {
  return (
    <div className={styles.container}>
      {/* 비활성화 사유 표시 */}
      {disabled && disabledReason && (
        <div className={styles.disabledReason}>{disabledReason}</div>
      )}

      {/* 제출 버튼 */}
      <button
        type="button"
        className={`${styles.button} ${disabled ? styles.disabled : styles.active}`}
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle} />
            <span>제출 중...</span>
          </div>
        ) : (
          '타임캡슐 묻기'
        )}
      </button>
    </div>
  );
}
