/**
 * @fileoverview 결제 성공 콜백 페이지 Mock 데이터
 * @description UI 구현 단계에서 사용할 Mock 데이터
 */

import type { ConfirmPaymentResponse } from '@/commons/apis/payment/types';
import type { CreateWaitingRoomResponse } from '@/commons/apis/capsules/types';
import type { PaymentSuccessState } from '../types';

/**
 * Mock 결제 승인 응답 데이터 (성공)
 */
export const mockConfirmPaymentResponse: ConfirmPaymentResponse = {
  order_id: 'mock-order-123',
  payment_key: 'payment-key-1234567890',
  status: 'PAID',
  amount: 15000,
  approved_at: '2026-01-27T10:05:00Z',
  capsule_id: 'capsule-123',
  receipt_url: 'https://api.tosspayments.com/receipt/1234567890',
};

/**
 * Mock 결제 승인 응답 데이터 (실패)
 */
export const mockConfirmPaymentResponseFailed: Partial<ConfirmPaymentResponse> = {
  order_id: 'mock-order-123',
  payment_key: 'payment-key-1234567890',
  status: 'FAILED',
  amount: 15000,
};

/**
 * Mock 대기실 생성 응답 데이터
 */
export const mockCreateWaitingRoomResponse: CreateWaitingRoomResponse = {
  room_id: 'waiting-room-123',
  order_id: 'mock-order-123',
  capsule_name: '우리의 추억',
  max_participants: 5,
  invite_code: 'ABC123',
  created_at: '2026-01-27T10:05:30Z',
};

/**
 * Mock 결제 성공 상태 (idle)
 */
export const mockPaymentSuccessStateIdle: PaymentSuccessState = {
  status: 'idle',
};

/**
 * Mock 결제 성공 상태 (결제 승인 중)
 */
export const mockPaymentSuccessStateConfirming: PaymentSuccessState = {
  status: 'confirming',
  orderId: 'mock-order-123',
};

/**
 * Mock 결제 성공 상태 (대기실 생성 중)
 */
export const mockPaymentSuccessStateCreating: PaymentSuccessState = {
  status: 'creating',
  orderId: 'mock-order-123',
  confirmResponse: mockConfirmPaymentResponse,
};

/**
 * Mock 결제 성공 상태 (성공)
 */
export const mockPaymentSuccessStateSuccess: PaymentSuccessState = {
  status: 'success',
  orderId: 'mock-order-123',
  waitingRoomId: 'waiting-room-123',
  confirmResponse: mockConfirmPaymentResponse,
};

/**
 * Mock 결제 성공 상태 (실패 - 금액 불일치)
 */
export const mockPaymentSuccessStateFailedAmountMismatch: PaymentSuccessState = {
  status: 'failed',
  orderId: 'mock-order-123',
  error: '결제 금액이 주문 금액과 일치하지 않습니다.',
};

/**
 * Mock 결제 성공 상태 (실패 - 이미 결제 완료)
 */
export const mockPaymentSuccessStateFailedAlreadyPaid: PaymentSuccessState = {
  status: 'failed',
  orderId: 'mock-order-123',
  error: '이미 결제가 완료된 주문입니다.',
};

/**
 * Mock 결제 성공 상태 (실패 - 주문을 찾을 수 없음)
 */
export const mockPaymentSuccessStateFailedOrderNotFound: PaymentSuccessState = {
  status: 'failed',
  orderId: 'mock-order-123',
  error: '주문을 찾을 수 없습니다.',
};

/**
 * Mock 결제 성공 상태 (실패 - 네트워크 오류)
 */
export const mockPaymentSuccessStateFailedNetwork: PaymentSuccessState = {
  status: 'failed',
  orderId: 'mock-order-123',
  error: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
};
