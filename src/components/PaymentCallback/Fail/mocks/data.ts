/**
 * @fileoverview 결제 실패 콜백 페이지 Mock 데이터
 * @description UI 구현 단계에서 사용할 Mock 데이터
 */

import type { PaymentFailState } from '../types';

/**
 * Mock 결제 실패 상태 (일반 실패)
 */
export const mockPaymentFailState: PaymentFailState = {
  errorCode: 'PAYMENT_FAILED',
  errorMessage: '결제가 실패했습니다.',
  orderId: 'mock-order-123',
};

/**
 * Mock 결제 실패 상태 (카드 한도 초과)
 */
export const mockPaymentFailStateCardLimit: PaymentFailState = {
  errorCode: 'CARD_LIMIT_EXCEEDED',
  errorMessage: '카드 한도가 초과되었습니다.',
  orderId: 'mock-order-123',
};

/**
 * Mock 결제 실패 상태 (잔액 부족)
 */
export const mockPaymentFailStateInsufficientBalance: PaymentFailState = {
  errorCode: 'INSUFFICIENT_BALANCE',
  errorMessage: '계좌 잔액이 부족합니다.',
  orderId: 'mock-order-123',
};

/**
 * Mock 결제 실패 상태 (결제 취소)
 */
export const mockPaymentFailStateCancelled: PaymentFailState = {
  errorCode: 'PAYMENT_CANCELLED',
  errorMessage: '결제가 취소되었습니다.',
  orderId: 'mock-order-123',
};
