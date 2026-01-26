/**
 * @fileoverview 결제 페이지 라우팅
 * @description Payment 컴포넌트를 렌더링하는 페이지
 */

import React from 'react';
import { Payment } from '@/components/Payment';

/**
 * 결제 페이지
 * 
 * URL 쿼리 파라미터:
 * - orderId: 주문 ID (필수)
 * 
 * @example
 * /payment?orderId=order-123
 */
export default function PaymentPage() {
  return <Payment />;
}
