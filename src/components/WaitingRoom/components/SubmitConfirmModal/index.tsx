/**
 * @fileoverview SubmitConfirmModal 컴포넌트
 * @description 타임캡슐 제출 확인 모달 컴포넌트
 */

'use client';

import { formatDateKorean } from '@/commons/utils/date';
import type { SubmitConfirmModalProps } from './types';
import styles from './styles.module.css';

/**
 * 타임캡슐 제출 확인 모달 컴포넌트
 *
 * 제출 전 최종 확인 모달을 표시합니다.
 *
 * @param {SubmitConfirmModalProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} SubmitConfirmModal 컴포넌트
 *
 * @example
 * ```tsx
 * <SubmitConfirmModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => handleSubmit()}
 *   openDate="2026-12-31T00:00:00Z"
 *   remainingHours={23}
 *   isLoading={false}
 * />
 * ```
 */
export function SubmitConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  openDate,
  remainingHours,
  isLoading = false,
}: SubmitConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 제목 */}
        <h2 className={styles.title}>타임캡슐을 묻으시겠어요?</h2>

        {/* 내용 */}
        <div className={styles.content}>
          <p className={styles.openDate}>
            {formatDateKorean(openDate)}에 개봉됩니다
          </p>
          <p className={styles.remainingTime}>
            자동 제출까지 {remainingHours}시간 남았습니다
          </p>
        </div>

        {/* 버튼 */}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.spinner}>
                <div className={styles.spinnerCircle} />
                <span>제출 중...</span>
              </div>
            ) : (
              '묻기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
