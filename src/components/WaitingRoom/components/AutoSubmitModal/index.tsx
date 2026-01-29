/**
 * @fileoverview AutoSubmitModal 컴포넌트
 * @description 자동 제출된 타임캡슐 안내 모달 컴포넌트
 */

'use client';

import { useRouter } from 'next/navigation';
import { formatDateTimeKorean, formatDateKorean } from '@/commons/utils/date';
import type { AutoSubmitModalProps } from './types';
import styles from './styles.module.css';

/**
 * 자동 제출 안내 모달 컴포넌트
 *
 * 자동 제출된 타임캡슐 재접속 시 안내 모달을 표시합니다.
 *
 * @param {AutoSubmitModalProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} AutoSubmitModal 컴포넌트
 *
 * @example
 * ```tsx
 * <AutoSubmitModal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   buriedAt="2026-01-29T14:30:00Z"
 *   openDate="2026-12-31T00:00:00Z"
 *   onNavigateToVault={() => router.push('/vault')}
 * />
 * ```
 */
export function AutoSubmitModal({
  isOpen,
  onClose,
  buriedAt,
  openDate,
  onNavigateToVault,
}: AutoSubmitModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 정보 아이콘 */}
        <div className={styles.iconContainer}>
          <div className={styles.infoIcon}>ℹ️</div>
        </div>

        {/* 제목 */}
        <h2 className={styles.title}>이미 제출된 타임캡슐입니다</h2>

        {/* 내용 */}
        <div className={styles.content}>
          <p className={styles.autoSubmitNotice}>
            24시간이 경과하여 자동으로 제출되었습니다
          </p>
          <div className={styles.info}>
            <p className={styles.infoLabel}>제출 시각</p>
            <p className={styles.infoValue}>{formatDateTimeKorean(buriedAt)}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.infoLabel}>개봉 예정일</p>
            <p className={styles.infoValue}>{formatDateKorean(openDate)}</p>
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.vaultButton}
            onClick={onNavigateToVault}
          >
            보관함으로 이동
          </button>
          <button
            type="button"
            className={styles.homeButton}
            onClick={handleGoHome}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
