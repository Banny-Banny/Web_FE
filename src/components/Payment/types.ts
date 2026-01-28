/**
 * @fileoverview 결제 페이지 컴포넌트 타입 정의
 * @description 결제 페이지에서 사용하는 모든 타입 정의
 */

import type { OrderDetail, TimeOption } from '@/commons/apis/orders/types';

/**
 * 결제 페이지 Props
 */
export interface PaymentPageProps {
  /** 주문 ID (URL 쿼리 파라미터에서 추출) */
  orderId?: string;
}

/**
 * 주문 정보 요약 데이터
 */
export interface OrderSummaryData {
  /** 주문 ID */
  orderId: string;
  /** 캡슐명 (주문 정보에 포함되지 않을 수 있음) */
  capsuleName?: string;
  /** 참여 인원수 */
  headcount: number;
  /** 타임 옵션 */
  timeOption: TimeOption;
  /** 커스텀 오픈 날짜 */
  customOpenAt: string | null;
  /** 사진 개수 */
  photoCount: number;
  /** 음악 추가 여부 */
  addMusic: boolean;
  /** 비디오 추가 여부 */
  addVideo: boolean;
  /** 총 결제 금액 */
  totalAmount: number;
}

/**
 * 결제 상태
 */
export type PaymentStateStatus = 'idle' | 'loading' | 'pending' | 'success' | 'failed';

/**
 * 결제 상태 정보
 */
export interface PaymentState {
  /** 결제 상태 */
  status: PaymentStateStatus;
  /** 오류 메시지 */
  error?: string;
  /** 결제 ID */
  paymentId?: string;
}

/**
 * OrderDetail을 OrderSummaryData로 변환하는 헬퍼 함수
 */
export function transformOrderDetailToSummary(order: OrderDetail): OrderSummaryData {
  return {
    orderId: order.order_id,
    capsuleName: order.capsule_name || undefined,
    headcount: order.headcount,
    timeOption: order.time_option,
    customOpenAt: order.custom_open_at,
    photoCount: order.photo_count,
    addMusic: order.add_music,
    addVideo: order.add_video,
    totalAmount: order.total_amount,
  };
}
