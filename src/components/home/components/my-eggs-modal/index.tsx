/**
 * MyEggsModal Component
 * Version: 1.0.0
 * Created: 2025-01-26
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.module.css → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] 접근성: 시맨틱/포커스/명도 대비/탭타겟 통과
 */

'use client';

import Image from 'next/image';
import { RiInformationLine } from '@remixicon/react';
import { Modal } from '@/commons/components/modal';
import type { MyEggsModalProps } from './types';
import styles from './styles.module.css';

// 알 이미지 경로
const FILLED_EGG_SRC = '/assets/images/filled_egg.svg';
const UNFILLED_EGG_SRC = '/assets/images/unfilled_egg.svg';

export function MyEggsModal({ visible, eggCount, onClose }: MyEggsModalProps) {
  // 최대 알 개수 (고정값)
  const maxEggs = 3;
  
  // 안전한 개수 (0-3 범위로 제한)
  const safeEggCount = Math.min(Math.max(0, eggCount), maxEggs);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      height="auto"
      padding={0}
    >
      <div className={styles.modalContent}>
        {/* 헤더 */}
        <header className={styles.header}>
          <h2 className={styles.title}>MY EGGS</h2>
          <p className={styles.subtitle}>현재 보유한 이스터에그 개수</p>
        </header>

        {/* 알 표시 섹션 */}
        <section className={styles.eggsSection}>
          {/* 알 슬롯 */}
          <div className={styles.eggsContainer} role="img" aria-label={`보유 이스터에그 ${safeEggCount}개 중 최대 ${maxEggs}개`}>
            {Array.from({ length: maxEggs }, (_, index) => {
              const isFilled = index < safeEggCount;
              const eggSrc = isFilled ? FILLED_EGG_SRC : UNFILLED_EGG_SRC;
              
              return (
                <div key={index} className={styles.eggItem}>
                  <Image
                    src={eggSrc}
                    alt=""
                    width={64}
                    height={64}
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

        {/* 안내 문구 */}
        <aside className={styles.infoSection}>
          <RiInformationLine 
            className={styles.infoIcon}
            size={20}
            aria-hidden="true"
          />
          <p className={styles.infoText}>
            이스터에그는 최대 3개까지 보유할 수 있으며, 지도에서 획득되거나 자동지연 자동으로 제거됩니다.
          </p>
        </aside>

        {/* 확인 버튼 */}
        <button
          type="button"
          className={styles.confirmButton}
          onClick={onClose}
          aria-label="모달 닫기"
        >
          확인
        </button>
      </div>
    </Modal>
  );
}

export default MyEggsModal;
