/**
 * @fileoverview 주문 관리 API 상수
 * @description 주문 생성에 필요한 상수 정의
 */

/**
 * 타임캡슐 상품 ID
 * 
 * 환경 변수 `NEXT_PUBLIC_TIMECAPSULE_PRODUCT_ID`에서 가져옵니다.
 * 
 * @example
 * .env.local 파일에 추가:
 * NEXT_PUBLIC_TIMECAPSULE_PRODUCT_ID=time-capsule-product-1
 */
export const TIME_CAPSULE_PRODUCT_ID =
  process.env.NEXT_PUBLIC_TIMECAPSULE_PRODUCT_ID || '';

if (!TIME_CAPSULE_PRODUCT_ID) {
  console.warn(
    '⚠️ NEXT_PUBLIC_TIMECAPSULE_PRODUCT_ID 환경 변수가 설정되지 않았습니다.'
  );
}
