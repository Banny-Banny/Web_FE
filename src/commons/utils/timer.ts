/**
 * @fileoverview 타이머 계산 유틸리티 함수
 * @description 24시간 자동 제출 타이머 계산 유틸리티
 */

/**
 * 24시간 마감 시각 계산
 *
 * 방 생성 시각으로부터 24시간 후의 마감 시각을 계산합니다.
 *
 * @param {string} createdAt - 방 생성 시각 (ISO 8601 형식)
 * @returns {Date} 마감 시각 (생성 시각 + 24시간)
 *
 * @example
 * ```typescript
 * const deadline = calculateDeadline('2026-01-29T10:00:00Z');
 * // 2026-01-30T10:00:00Z
 * ```
 */
export function calculateDeadline(createdAt: string): Date {
  const created = new Date(createdAt);
  return new Date(created.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * 남은 시간 계산
 *
 * 현재 시각 기준으로 24시간 마감까지 남은 시간을 계산합니다.
 *
 * @param {string} createdAt - 방 생성 시각 (ISO 8601 형식)
 * @returns 남은 시간 (시, 분, 초) 및 만료 여부
 *
 * @example
 * ```typescript
 * const remaining = calculateRemainingTime('2026-01-29T10:00:00Z');
 * // { hours: 23, minutes: 45, seconds: 30, expired: false }
 * ```
 */
export function calculateRemainingTime(createdAt: string): {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const deadline = calculateDeadline(createdAt);
  const now = new Date();
  const remaining = deadline.getTime() - now.getTime();

  if (remaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: false };
}

/**
 * 타이머 텍스트 포맷팅
 *
 * 남은 시간을 사용자 친화적인 텍스트로 변환합니다.
 *
 * @param {number} hours - 남은 시간 (시)
 * @param {number} minutes - 남은 시간 (분)
 * @param {number} seconds - 남은 시간 (초)
 * @returns {string} 포맷팅된 타이머 텍스트
 *
 * @example
 * ```typescript
 * formatTimerText(23, 45, 30); // "23시간 45분 남음"
 * formatTimerText(0, 45, 30); // "45분 30초 남음"
 * ```
 */
export function formatTimerText(
  hours: number,
  minutes: number,
  seconds: number
): string {
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }
  return `${minutes}분 ${seconds}초 남음`;
}
