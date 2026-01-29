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
