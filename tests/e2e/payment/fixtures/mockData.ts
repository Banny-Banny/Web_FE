/**
 * @fileoverview 결제 페이지 E2E 테스트용 Mock 데이터
 * @description 주문 정보, 결제 응답 등 테스트에 사용할 Mock 데이터
 */

import type {
  GetOrderResponse,
  GetOrderStatusResponse,
  OrderDetail,
  ProductInfo,
} from '@/commons/apis/orders/types';
import type {
  ConfirmPaymentResponse,
} from '@/commons/apis/payment/types';
import type {
  CreateWaitingRoomResponse,
} from '@/commons/apis/capsules/types';

/**
 * Mock 주문 상세 정보
 */
export const mockOrderDetail: OrderDetail = {
  order_id: 'test-order-123',
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
  order_id: 'test-order-123',
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
  order_id: 'test-order-123',
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
  order_id: 'test-order-123',
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
 * 커스텀 오픈 날짜가 있는 Mock 주문 상세 정보
 */
export const mockOrderDetailWithCustomDate: OrderDetail = {
  ...mockOrderDetail,
  time_option: 'CUSTOM',
  custom_open_at: '2026-12-31T00:00:00Z',
};

/**
 * 추가 옵션이 없는 Mock 주문 상세 정보
 */
export const mockOrderDetailMinimal: OrderDetail = {
  ...mockOrderDetail,
  photo_count: 0,
  add_music: false,
  add_video: false,
  total_amount: 10000,
};

/**
 * Mock 토스페이먼츠 결제 승인 성공 응답
 */
export const mockConfirmPaymentSuccess: ConfirmPaymentResponse = {
  order_id: 'test-order-123',
  payment_key: 'pay-1234-5678',
  status: 'PAID',
  amount: 15000,
  approved_at: '2026-01-27T10:00:00.000Z',
  capsule_id: 'capsule-uuid-123',
  receipt_url: 'https://mock.toss/receipt/pay-1234-5678',
};

/**
 * Mock 토스페이먼츠 결제 승인 실패 응답
 */
export const mockConfirmPaymentFailed: ConfirmPaymentResponse = {
  order_id: 'test-order-123',
  payment_key: 'pay-1234-5678',
  status: 'FAILED',
  amount: 15000,
  approved_at: '2026-01-27T10:00:00.000Z',
  capsule_id: '',
  receipt_url: '',
};

/**
 * Mock 타임캡슐 대기실 생성 성공 응답
 */
export const mockCreateWaitingRoomSuccess: CreateWaitingRoomResponse = {
  waitingRoomId: 'waiting-room-uuid-123',
  orderId: 'test-order-123',
  capsuleName: '우리들의 추억',
  headcount: 5,
  inviteCode: 'ABC123',
  createdAt: '2026-01-27T10:00:00.000Z',
};

/**
 * Mock 결제 실패 콜백 파라미터
 */
export const mockPaymentFailParams = {
  code: 'CARD_AUTHORIZATION_FAILED',
  message: '카드 승인에 실패했습니다.',
  orderId: 'test-order-123',
};

/**
 * Mock 결제 성공 콜백 파라미터
 */
export const mockPaymentSuccessParams = {
  paymentKey: 'pay-1234-5678',
  orderId: 'test-order-123',
  amount: '15000',
};
