/**
 * @fileoverview 결제 성공 콜백 페이지 라우팅
 * @description PaymentSuccess 컴포넌트를 렌더링하는 페이지
 */

import React from 'react';
import { PaymentSuccess } from '@/components/PaymentCallback/Success';

/**
 * 결제 성공 콜백 페이지
 * 
 * 토스페이먼츠에서 결제 성공 후 리다이렉트되는 페이지입니다.
 * 
 * URL 쿼리 파라미터:
 * - paymentKey: 결제 키 (토스페이먼츠에서 발급)
 * - orderId: 주문 ID
 * - amount: 결제 금액
 * 
 * @example
 * /payment/success?paymentKey=payment-key-123&orderId=order-123&amount=15000
 */
export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
