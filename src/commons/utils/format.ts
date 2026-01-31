/**
 * @fileoverview 포맷팅 유틸리티 함수
 * @description 숫자, 날짜, 텍스트 등의 포맷팅 함수
 */

/**
 * 숫자를 통화 형식으로 변환
 *
 * @param amount - 변환할 금액
 * @param currency - 통화 기호 (기본값: '원')
 * @returns 포맷팅된 통화 문자열
 *
 * @example
 * ```typescript
 * formatCurrency(10000); // "10,000원"
 * formatCurrency(10000, '₩'); // "₩10,000"
 * formatCurrency(1234567); // "1,234,567원"
 * ```
 */
export function formatCurrency(amount: number, currency: string = '원'): string {
  const formatted = new Intl.NumberFormat('ko-KR').format(amount);
  return currency === '원' ? `${formatted}${currency}` : `${currency}${formatted}`;
}

/**
 * 날짜를 지정된 형식으로 변환
 *
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param format - 출력 형식 ('YYYY-MM-DD', 'YYYY.MM.DD', 'MM/DD', etc.)
 * @returns 포맷팅된 날짜 문자열
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-15'), 'YYYY-MM-DD'); // "2024-01-15"
 * formatDate('2024-01-15T10:30:00', 'YYYY.MM.DD'); // "2024.01.15"
 * ```
 */
export function formatDate(
  date: Date | string,
  format: 'YYYY-MM-DD' | 'YYYY.MM.DD' | 'MM/DD' = 'YYYY-MM-DD'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'MM/DD':
      return `${month}/${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * 전화번호를 포맷팅
 *
 * @param phoneNumber - 변환할 전화번호
 * @returns 포맷팅된 전화번호
 *
 * @example
 * ```typescript
 * formatPhoneNumber('01012345678'); // "010-1234-5678"
 * formatPhoneNumber('0212345678'); // "02-1234-5678"
 * ```
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  return phoneNumber;
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 *
 * @param text - 자를 텍스트
 * @param maxLength - 최대 길이
 * @param suffix - 말줄임표 (기본값: '...')
 * @returns 잘린 텍스트
 *
 * @example
 * ```typescript
 * truncateText('안녕하세요 반갑습니다', 5); // "안녕하세요..."
 * truncateText('Hello World', 5, '…'); // "Hello…"
 * ```
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + suffix;
}
