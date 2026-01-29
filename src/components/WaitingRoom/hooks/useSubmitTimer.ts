/**
 * @fileoverview 24시간 제출 타이머 훅
 * @description 방 생성 시각으로부터 24시간 카운트다운을 실시간으로 계산하는 훅
 */

import { useState, useEffect } from 'react';
import { calculateRemainingTime } from '@/commons/utils/timer';

/**
 * 24시간 타이머 상태
 */
export interface TimerState {
  /** 남은 시간 (시) */
  hours: number;
  /** 남은 시간 (분) */
  minutes: number;
  /** 남은 시간 (초) */
  seconds: number;
  /** 타이머 만료 여부 */
  expired: boolean;
  /** 긴급 상태 (1시간 미만) */
  isUrgent: boolean;
  /** 위급 상태 (10분 미만) */
  isCritical: boolean;
}

/**
 * 24시간 제출 타이머 훅
 *
 * 방 생성 시각으로부터 24시간 카운트다운을 1초 단위로 계산합니다.
 *
 * @param {string} createdAt - 방 생성 시각 (ISO 8601 형식)
 * @param {() => void} onExpired - 타이머 만료 시 콜백 (선택)
 * @returns {TimerState} 타이머 상태
 *
 * @example
 * ```typescript
 * const timerState = useSubmitTimer('2026-01-29T10:00:00Z', () => {
 *   console.log('타이머 만료!');
 * });
 *
 * if (timerState.expired) {
 *   return <div>자동 제출됨</div>;
 * }
 *
 * if (timerState.isCritical) {
 *   return <div className="text-red-600">🚨 {timerState.minutes}분 {timerState.seconds}초 남음</div>;
 * }
 * ```
 */
export function useSubmitTimer(
  createdAt: string,
  onExpired?: () => void
): TimerState {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const { hours, minutes, seconds, expired } =
      calculateRemainingTime(createdAt);
    return {
      hours,
      minutes,
      seconds,
      expired,
      isUrgent: hours === 0 && minutes < 60,
      isCritical: hours === 0 && minutes < 10,
    };
  });

  useEffect(() => {
    // 1초마다 타이머 업데이트
    const interval = setInterval(() => {
      const { hours, minutes, seconds, expired } =
        calculateRemainingTime(createdAt);

      setTimerState({
        hours,
        minutes,
        seconds,
        expired,
        isUrgent: hours === 0 && minutes < 60,
        isCritical: hours === 0 && minutes < 10,
      });

      // 타이머 만료 시 콜백 호출
      if (expired && onExpired) {
        onExpired();
        clearInterval(interval);
      }
    }, 1000);

    // cleanup
    return () => clearInterval(interval);
  }, [createdAt, onExpired]);

  return timerState;
}
