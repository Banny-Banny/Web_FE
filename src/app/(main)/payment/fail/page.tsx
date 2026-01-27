/**
 * @fileoverview 결제 실패 콜백 페이지 라우팅
 * @description PaymentFail 컴포넌트를 렌더링하는 페이지
 */

import React from 'react';
import { PaymentFail } from '@/components/PaymentCallback/Fail';

/**
 * 결제 실패 콜백 페이지
 * 
 * 토스페이먼츠에서 결제 실패 후 리다이렉트되는 페이지입니다.
 * 
 * URL 쿼리 파라미터:
 * - code: 에러 코드
 * - message: 에러 메시지
 * - orderId: 주문 ID
 * 
 * @example
 * /payment/fail?code=PAYMENT_FAILED&message=결제가 실패했습니다.&orderId=order-123
 */
export default function PaymentFailPage() {
  return <PaymentFail />;
}
