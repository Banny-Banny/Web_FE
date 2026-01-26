/**
 * @fileoverview 결제 관련 유틸리티 함수
 * @description 결제 ID 생성, 금액 포맷팅 등 결제 관련 유틸리티
 */

/**
 * 고유한 결제 ID 생성
 * 
 * UUID v4 형식의 고유한 결제 ID를 생성합니다.
 * 
 * @returns {string} 고유한 결제 ID
 * 
 * @example
 * ```typescript
 * const paymentId = generatePaymentId();
 * // 예: "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generatePaymentId(): string {
  // UUID v4 형식 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 고유한 주문 ID 생성
 * 
 * 타임스탬프와 랜덤 문자열을 조합한 고유한 주문 ID를 생성합니다.
 * 
 * @param {string} prefix - 주문 ID 접두사 (기본값: "order")
 * @returns {string} 고유한 주문 ID
 * 
 * @example
 * ```typescript
 * const orderId = generateOrderId();
 * // 예: "order-1706234567890-abc123"
 * 
 * const customOrderId = generateOrderId('timecapsule');
 * // 예: "timecapsule-1706234567890-abc123"
 * ```
 */
export function generateOrderId(prefix: string = 'order'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
 * 금액을 원화 형식으로 포맷팅
 * 
 * 숫자를 한국 원화 형식(천 단위 구분)으로 변환합니다.
 * 
 * @param {number} amount - 금액
 * @returns {string} 포맷팅된 금액 문자열
 * 
 * @example
 * ```typescript
 * formatAmount(10000); // "10,000"
 * formatAmount(1234567); // "1,234,567"
 * ```
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

/**
 * 금액을 원화 형식으로 포맷팅 (원 단위 포함)
 * 
 * 숫자를 한국 원화 형식으로 변환하고 "원" 단위를 추가합니다.
 * 
 * @param {number} amount - 금액
 * @returns {string} 포맷팅된 금액 문자열 (원 단위 포함)
 * 
 * @example
 * ```typescript
 * formatAmountWithCurrency(10000); // "10,000원"
 * formatAmountWithCurrency(1234567); // "1,234,567원"
 * ```
 */
export function formatAmountWithCurrency(amount: number): string {
  return `${formatAmount(amount)}원`;
}
