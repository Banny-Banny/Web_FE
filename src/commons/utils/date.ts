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
