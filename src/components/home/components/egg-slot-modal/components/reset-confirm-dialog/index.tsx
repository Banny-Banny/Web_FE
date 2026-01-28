/**
 * ResetConfirmDialog Component
 * Version: 1.0.0
 * Created: 2026-01-27
 *
 * 슬롯 초기화 확인 다이얼로그 컴포넌트
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.module.css → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

'use client';

import type { ResetConfirmDialogProps } from './types';
import styles from './styles.module.css';

/**
 * 슬롯 초기화 확인 다이얼로그
 * 
 * 사용자가 슬롯 초기화를 확인하거나 취소할 수 있는 다이얼로그입니다.
 * 
 * @example
 * ```tsx
 * <ResetConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleReset}
 *   isLoading={isResetting}
 * />
 * ```
 */
export function ResetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ResetConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
      data-testid="reset-confirm-dialog"
    >
      <div 
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <h2 id="reset-dialog-title" className={styles.header}>
          ⚠️ 슬롯 초기화 확인
        </h2>

        {/* 경고 메시지 */}
        <div className={styles.content}>
          <p className={styles.warningText}>다음 작업이 수행됩니다:</p>
          <ul className={styles.warningList}>
            <li>• 모든 이스터에그가 삭제됩니다</li>
            <li>• 관련 데이터가 함께 삭제됩니다</li>
            <li>• 슬롯이 3개로 초기화됩니다</li>
            <li>• 이 작업은 되돌릴 수 없습니다</li>
          </ul>
          <p className={styles.confirmText}>정말 초기화하시겠습니까?</p>
        </div>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
            data-testid="cancel-reset-button"
          >
            취소
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isLoading}
            data-testid="confirm-reset-button"
          >
            {isLoading ? '초기화 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetConfirmDialog;
