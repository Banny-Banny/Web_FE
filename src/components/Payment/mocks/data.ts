/**
 * @fileoverview 결제 페이지 Mock 데이터
 * @description UI 구현 단계에서 사용할 Mock 데이터
 */

import type {
  GetOrderResponse,
  GetOrderStatusResponse,
  OrderDetail,
  ProductInfo,
} from '@/commons/apis/orders/types';
import type { OrderSummaryData, PaymentState } from '../types';

/**
 * Mock 주문 상세 정보
 */
export const mockOrderDetail: OrderDetail = {
  order_id: 'mock-order-123',
  time_option: '1_MONTH',
  custom_open_at: null,
  headcount: 5,
  photo_count: 3,
  add_music: true,
  add_video: false,
  status: 'PENDING_PAYMENT',
  total_amount: 15000,
  capsule_id: null,
  invite_code: null,
  created_at: '2026-01-26T10:00:00Z',
  updated_at: '2026-01-26T10:00:00Z',
};

/**
 * Mock 상품 정보
 */
export const mockProductInfo: ProductInfo = {
  id: 'time-capsule-product-1',
  name: '타임캡슐',
  price: 10000,
  product_type: 'TIME_CAPSULE',
  is_active: true,
  max_media_count: 10,
  media_types: ['image', 'video', 'audio'],
};

/**
 * Mock 주문 상세 조회 응답
 */
export const mockGetOrderResponse: GetOrderResponse = {
  order: mockOrderDetail,
  product: mockProductInfo,
};

/**
 * Mock 주문 상태 조회 응답 (결제 대기)
 */
export const mockOrderStatusPending: GetOrderStatusResponse = {
  order_id: 'mock-order-123',
  order_status: 'PENDING_PAYMENT',
  total_amount: 15000,
  payment_amount: null,
  payment_key: null,
  payment_status: null,
  approved_at: null,
  created_at: '2026-01-26T10:00:00Z',
  updated_at: '2026-01-26T10:00:00Z',
};

/**
 * Mock 주문 상태 조회 응답 (결제 완료)
 */
export const mockOrderStatusPaid: GetOrderStatusResponse = {
  order_id: 'mock-order-123',
  order_status: 'PAID',
  total_amount: 15000,
  payment_amount: 15000,
  payment_key: 'payment-key-123',
  payment_status: 'DONE',
  approved_at: '2026-01-26T10:05:00Z',
  created_at: '2026-01-26T10:00:00Z',
  updated_at: '2026-01-26T10:05:00Z',
};

/**
 * Mock 주문 상태 조회 응답 (결제 실패)
 */
export const mockOrderStatusFailed: GetOrderStatusResponse = {
  order_id: 'mock-order-123',
  order_status: 'FAILED',
  total_amount: 15000,
  payment_amount: null,
  payment_key: null,
  payment_status: 'FAILED',
  approved_at: null,
  created_at: '2026-01-26T10:00:00Z',
  updated_at: '2026-01-26T10:05:00Z',
};

/**
 * Mock 주문 정보 요약 데이터
 */
export const mockOrderSummaryData: OrderSummaryData = {
  orderId: 'mock-order-123',
  capsuleName: '우리의 추억',
  headcount: 5,
  timeOption: '1_MONTH',
  customOpenAt: null,
  photoCount: 3,
  addMusic: true,
  addVideo: false,
  totalAmount: 15000,
};

/**
 * Mock 결제 상태 (대기)
 */
export const mockPaymentStateIdle: PaymentState = {
  status: 'idle',
};

/**
 * Mock 결제 상태 (로딩)
 */
export const mockPaymentStateLoading: PaymentState = {
  status: 'loading',
};

/**
 * Mock 결제 상태 (진행 중)
 */
export const mockPaymentStatePending: PaymentState = {
  status: 'pending',
};

/**
 * Mock 결제 상태 (성공)
 */
export const mockPaymentStateSuccess: PaymentState = {
  status: 'success',
  paymentId: 'payment-key-123',
};

/**
 * Mock 결제 상태 (실패)
 */
export const mockPaymentStateFailed: PaymentState = {
  status: 'failed',
  error: '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
};
