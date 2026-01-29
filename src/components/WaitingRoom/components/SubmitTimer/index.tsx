/**
 * @fileoverview SubmitTimer 컴포넌트
 * @description 24시간 자동 제출 타이머 표시 컴포넌트
 */

'use client';

import { useSubmitTimer } from '../../hooks/useSubmitTimer';
import { formatTimerText } from '@/commons/utils/timer';
import type { SubmitTimerProps } from './types';
import styles from './styles.module.css';

/**
 * 24시간 자동 제출 타이머 컴포넌트
 *
 * 방 생성 시각으로부터 24시간 카운트다운을 실시간으로 표시합니다.
 * 남은 시간에 따라 색상과 아이콘이 변경됩니다.
 *
 * @param {SubmitTimerProps} props - 컴포넌트 props
 * @returns {JSX.Element} SubmitTimer 컴포넌트
 *
 * @example
 * ```tsx
 * <SubmitTimer
 *   createdAt="2026-01-29T10:00:00Z"
 *   onExpired={() => console.log('타이머 만료!')}
 * />
 * ```
 */
export function SubmitTimer({ createdAt, onExpired }: SubmitTimerProps) {
  const timerState = useSubmitTimer(createdAt, onExpired);

  // 타이머 만료 시
  if (timerState.expired) {
    return (
      <div className={styles.container}>
        <div className={styles.expiredText}>자동 제출됨</div>
      </div>
    );
  }

  // 위급 상태 (10분 미만)
  if (timerState.isCritical) {
    return (
      <div className={styles.container}>
        <div className={`${styles.timerText} ${styles.critical}`}>
          🚨 {formatTimerText(timerState.hours, timerState.minutes, timerState.seconds)}
        </div>
      </div>
    );
  }

  // 긴급 상태 (1시간 미만)
  if (timerState.isUrgent) {
    return (
      <div className={styles.container}>
        <div className={`${styles.timerText} ${styles.urgent}`}>
          ⚠️ {formatTimerText(timerState.hours, timerState.minutes, timerState.seconds)}
        </div>
      </div>
    );
  }

  // 기본 상태
  return (
    <div className={styles.container}>
      <div className={styles.timerText}>
        {formatTimerText(timerState.hours, timerState.minutes, timerState.seconds)}
      </div>
    </div>
  );
}
