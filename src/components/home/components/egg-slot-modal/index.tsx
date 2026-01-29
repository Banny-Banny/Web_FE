/**
 * EggSlotModal Component
 * Version: 2.0.0
 * Created: 2026-01-27
 * Updated: 2026-01-27 (MyEggsModal과 통합)
 *
 * 이스터에그 슬롯 정보 모달 컴포넌트
 * - 슬롯 정보 조회 및 표시
 * - 슬롯 초기화 기능
 * - MyEggsModal의 UI 디자인 적용
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

import { useState } from 'react';
import Image from 'next/image';
import { RiInformationLine } from '@remixicon/react';
import { Modal } from '@/commons/components/modal';
import type { EggSlotModalProps } from './types';
import styles from './styles.module.css';
import { useSlotManagement } from '../../hooks/useSlotManagement';
import { ResetConfirmDialog } from './components/reset-confirm-dialog';

// 알 이미지 경로
const FILLED_EGG_SRC = '/assets/images/filled_egg.svg';
const UNFILLED_EGG_SRC = '/assets/images/unfilled_egg.svg';

/**
 * 이스터에그 슬롯 정보 모달
 * 
 * 슬롯 정보를 표시하고 초기화 기능을 제공합니다.
 * 
 * @example
 * ```tsx
 * <EggSlotModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export function EggSlotModal({ isOpen, onClose }: EggSlotModalProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const {
    slotInfo,
    isLoading,
    error,
    refetch,
    resetSlots,
    isResetting,
    resetError,
  } = useSlotManagement();

  const handleResetClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmReset = () => {
    // 초기화 실행
    resetSlots();
    // 확인 다이얼로그 즉시 닫기
    setIsConfirmDialogOpen(false);
    // 메인 모달도 즉시 닫기
    onClose();
  };

  const handleCancelReset = () => {
    setIsConfirmDialogOpen(false);
  };

  // 최대 알 개수 (고정값)
  const maxEggs = 3;
  
  // 안전한 개수 (0-3 범위로 제한)
  const safeEggCount = slotInfo ? Math.min(Math.max(0, slotInfo.remainingSlots), maxEggs) : 0;

  return (
    <>
      <Modal
        visible={isOpen}
        onClose={onClose}
        height="auto"
        padding={0}
        closeOnBackdropPress={true}
      >
        <div className={styles.modalContent} data-testid="egg-slot-modal">
          {/* 헤더 */}
          <header className={styles.header}>
            <h2 className={styles.title}>MY EGGS</h2>
            <p className={styles.subtitle}>현재 보유한 이스터에그 개수</p>
          </header>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className={styles.loadingContainer}>
              <p className={styles.loadingText}>로딩 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>
                {error.message || '슬롯 정보를 불러오는 데 실패했습니다.'}
              </p>
              <button
                type="button"
                className={styles.retryButton}
                onClick={() => refetch()}
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 슬롯 정보 */}
          {slotInfo && !isLoading && !error && (
            <>
              {/* 알 표시 섹션 */}
              <section className={styles.eggsSection}>
                {/* 알 슬롯 */}
                <div 
                  className={styles.eggsContainer} 
                  role="img" 
                  aria-label={`보유 이스터에그 ${safeEggCount}개 중 최대 ${maxEggs}개`}
                >
                  {Array.from({ length: maxEggs }, (_, index) => {
                    const isFilled = index < safeEggCount;
                    const eggSrc = isFilled ? FILLED_EGG_SRC : UNFILLED_EGG_SRC;
                    
                    return (
                      <div key={index} className={styles.eggItem}>
                        <Image
                          src={eggSrc}
                          alt=""
                          width={48}
                          height={48}
                          className={isFilled ? styles.eggIcon : styles.eggIconEmpty}
                          aria-hidden="true"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* 카운트 표시 */}
                <div className={styles.countDisplay}>
                  <span className={styles.currentCount}>{safeEggCount}</span>
                  <span className={styles.maxCount}>/{maxEggs}</span>
                </div>
              </section>

              {/* 상세 정보 */}
              <div className={styles.detailInfo}>
                <div className={styles.detailInfoItem}>
                  <span className={styles.detailInfoLabel}>전체 슬롯</span>
                  <span className={styles.detailInfoValue}>{slotInfo.totalSlots}개</span>
                </div>
                <div className={styles.detailInfoItem}>
                  <span className={styles.detailInfoLabel}>사용 중</span>
                  <span className={styles.detailInfoValue}>{slotInfo.usedSlots}개</span>
                </div>
                <div className={styles.detailInfoItem}>
                  <span className={styles.detailInfoLabel}>남은 슬롯</span>
                  <span className={styles.detailInfoValue}>{slotInfo.remainingSlots}개</span>
                </div>
              </div>

              {/* 안내 문구 */}
              <aside className={styles.infoSection}>
                <RiInformationLine 
                  className={styles.infoIcon}
                  size={20}
                  aria-hidden="true"
                />
                <p className={styles.infoText}>
                  이스터에그는 최대 3개까지 보유할 수 있으며, 지도에서 획득되거나 시간 경과 시 자동으로 제거됩니다.
                </p>
              </aside>

              {/* 초기화 에러 메시지 */}
              {resetError && (
                <div className={styles.resetErrorContainer}>
                  <p className={styles.resetErrorText}>
                    {resetError.message || '초기화에 실패했습니다.'}
                  </p>
                </div>
              )}

              {/* 버튼 그룹 */}
              <div className={styles.buttonGroup}>
                {/* 초기화 버튼 */}
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={handleResetClick}
                  disabled={isResetting}
                  data-testid="reset-button"
                >
                  {isResetting ? '초기화 중...' : '슬롯 초기화'}
                </button>

                {/* 확인 버튼 */}
                <button
                  type="button"
                  className={styles.confirmButton}
                  onClick={onClose}
                  aria-label="모달 닫기"
                  data-testid="close-modal-button"
                >
                  확인
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 초기화 확인 다이얼로그 */}
      <ResetConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelReset}
        onConfirm={handleConfirmReset}
        isLoading={isResetting}
      />
    </>
  );
}

export default EggSlotModal;
