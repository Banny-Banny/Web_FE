/**
 * EggSlot Component
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

import type { EggSlotProps } from './types';
import styles from './styles.module.css';
import Image from 'next/image';

// 알 아이콘 경로
const FILLED_EGG_SRC = '/assets/images/filled_egg.svg';
const UNFILLED_EGG_SRC = '/assets/images/unfilled_egg.svg';

export function EggSlot({ count, onClick, className }: EggSlotProps) {
  // 총 슬롯 개수 (고정값)
  const totalSlots = 3;
  
  // 남은 개수가 전체 개수를 초과하지 않도록 제한
  const safeRemainingCount = Math.min(Math.max(0, count), totalSlots);

  const handlePress = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePress();
    }
  };

  const content = (
    <div className={styles.container}>
      {Array.from({ length: totalSlots }, (_, index) => {
        // remaining slots를 기준으로 찬 알 표시
        // 앞에서부터 remainingCount만큼 꽉찬 알, 그 다음부터 빈 알
        const isFilled = index < safeRemainingCount;
        const slotNumber = index + 1;
        const eggSrc = isFilled ? FILLED_EGG_SRC : UNFILLED_EGG_SRC;

        return (
          <div key={slotNumber} className={styles.eggSlotItem}>
            <Image
              src={eggSrc}
              alt={`에그 슬롯 ${slotNumber} - ${isFilled ? '사용됨' : '비어있음'}`}
              className={isFilled ? styles.eggSlotIcon : styles.eggSlotIconEmpty}
              width={20}
              height={25}
            />
          </div>
        );
      })}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.pressableWrapper} ${className || ''}`}
        onClick={handlePress}
        onKeyDown={handleKeyDown}
        aria-label="이스터에그 슬롯 정보 보기"
      >
        {content}
      </button>
    );
  }

  return <div className={`${styles.pressableWrapper} ${className || ''}`}>{content}</div>;
}

export default EggSlot;
