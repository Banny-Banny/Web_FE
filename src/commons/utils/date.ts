/**
 * @fileoverview 날짜/시간 포맷팅 유틸리티
 * 공통으로 사용하는 날짜 포맷 함수 모음
 */

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜를 M.D HH:mm 형식으로 포맷 (예: 1.28 14:30)
 */
export function formatShortDateWithTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * 날짜를 로케일 짧은 형식(MM/DD)으로 포맷 (ko-KR, 월/일만)
 */
export function formatLocaleDateShort(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * D-Day 계산
 *
 * 목표 날짜까지 남은 일수를 계산합니다.
 *
 * @param {string} targetDate - 목표 날짜 (ISO 8601 형식)
 * @returns {number} 남은 일수 (양수: 미래, 음수: 과거)
 *
 * @example
 * ```typescript
 * calculateDDay('2026-12-31T00:00:00Z'); // 335 (2026-01-29 기준)
 * ```
 */
export function calculateDDay(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷팅
 *
 * @param {string} dateString - 날짜 문자열 (ISO 8601 형식)
 * @returns {string} 포맷팅된 날짜 ("YYYY년 MM월 DD일")
 *
 * @example
 * ```typescript
 * formatDateKorean('2026-12-31T00:00:00Z'); // "2026년 12월 31일"
 * ```
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜와 시간을 "YYYY년 MM월 DD일 HH:mm" 형식으로 포맷팅
 *
 * @param {string} dateString - 날짜 문자열 (ISO 8601 형식)
 * @returns {string} 포맷팅된 날짜와 시간 ("YYYY년 MM월 DD일 HH:mm")
 *
 * @example
 * ```typescript
 * formatDateTimeKorean('2026-01-29T14:30:00Z'); // "2026년 1월 29일 14:30"
 * ```
 */
export function formatDateTimeKorean(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

/**
 * ISO 날짜 문자열을 상대 시간으로 포맷 (예: "N일 전", "방금", "N시간 전")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;
  return `${Math.floor(diffDay / 365)}년 전`;
}
