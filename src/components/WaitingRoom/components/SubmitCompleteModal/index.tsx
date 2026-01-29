/**
 * @fileoverview SubmitCompleteModal 컴포넌트
 * @description 타임캡슐 제출 완료 모달 컴포넌트
 */

'use client';

import { useRouter } from 'next/navigation';
import { calculateDDay, formatDateKorean } from '@/commons/utils/date';
import type { SubmitCompleteModalProps } from './types';
import styles from './styles.module.css';

/**
 * 타임캡슐 제출 완료 모달 컴포넌트
 *
 * 제출 완료 후 성공 안내 모달을 표시합니다.
 *
 * @param {SubmitCompleteModalProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} SubmitCompleteModal 컴포넌트
 *
 * @example
 * ```tsx
 * <SubmitCompleteModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   capsuleId="caps_abc123"
 *   openDate="2026-12-31T00:00:00Z"
 *   isAutoSubmitted={false}
 * />
 * ```
 */
export function SubmitCompleteModal({
  isOpen,
  onClose,
  capsuleId: _capsuleId,
  openDate,
  isAutoSubmitted,
}: SubmitCompleteModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const dDay = calculateDDay(openDate);

  const handleConfirm = () => {
    onClose();
    // 홈 화면으로 이동
    router.push('/');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 성공 아이콘 */}
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>✓</div>
        </div>

        {/* 제목 */}
        <h2 className={styles.title}>
          {isAutoSubmitted ? '타임캡슐이 자동으로 묻혔어요' : '타임캡슐이 묻혔어요!'}
        </h2>

        {/* 내용 */}
        <div className={styles.content}>
          <p className={styles.dDay}>D-{dDay}일 후 개봉됩니다</p>
          <p className={styles.openDate}>{formatDateKorean(openDate)}</p>
          {isAutoSubmitted && (
            <p className={styles.autoSubmitNotice}>
              24시간이 경과하여 자동으로 제출되었습니다
            </p>
          )}
        </div>

        {/* 버튼 */}
        <button
          type="button"
          className={styles.confirmButton}
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
