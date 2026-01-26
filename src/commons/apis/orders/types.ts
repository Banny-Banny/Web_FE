/**
 * @fileoverview 주문 관리 API 타입 정의
 * @description 주문 생성, 조회, 상태 관리 관련 타입
 */

/**
 * 주문 상태 타입
 */
export type OrderStatus =
  | 'PENDING_PAYMENT' // 결제 대기 중
  | 'PAID' // 결제 완료
  | 'CANCELLED' // 취소됨
  | 'FAILED'; // 실패

/**
 * 타임 옵션 타입
 */
export type TimeOption = '1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM';

/**
 * 주문 생성 요청 타입
 */
export interface CreateOrderRequest {
  /** 상품 ID (TIME_CAPSULE 타입, 활성화된 상품) */
  product_id: string;
  /** 타임 옵션 */
  time_option: TimeOption;
  /** 커스텀 오픈 날짜 (CUSTOM일 때만 필수, 미래 날짜) */
  custom_open_at?: string; // ISO 8601 형식
  /** 참여 인원 수 (1~10) */
  headcount: number;
  /** 사진 개수 (0 이상, headcount 이하) */
  photo_count?: number;
  /** 음악 추가 여부 */
  add_music?: boolean;
  /** 비디오 추가 여부 */
  add_video?: boolean;
}

/**
 * 주문 생성 응답 타입
 */
export interface CreateOrderResponse {
  /** 주문 ID */
  order_id: string;
  /** 총 금액 */
  total_amount: number;
  /** 타임 옵션 */
  time_option: TimeOption;
  /** 커스텀 오픈 날짜 (CUSTOM일 때만) */
  custom_open_at?: string | null;
  /** 참여 인원 수 */
  headcount: number;
  /** 사진 개수 */
  photo_count: number;
  /** 음악 추가 여부 */
  add_music: boolean;
  /** 비디오 추가 여부 */
  add_video: boolean;
  /** 주문 상태 */
  status: OrderStatus;
}

/**
 * 주문 정보 타입 (상세 조회 응답의 order 필드)
 */
export interface OrderDetail {
  /** 주문 ID */
  order_id: string;
  /** 타임 옵션 */
  time_option: TimeOption;
  /** 커스텀 오픈 날짜 */
  custom_open_at: string | null;
  /** 참여 인원 수 */
  headcount: number;
  /** 사진 개수 */
  photo_count: number;
  /** 음악 추가 여부 */
  add_music: boolean;
  /** 비디오 추가 여부 */
  add_video: boolean;
  /** 주문 상태 */
  status: OrderStatus;
  /** 총 금액 */
  total_amount: number;
  /** 캡슐 ID */
  capsule_id: string | null;
  /** 초대 코드 */
  invite_code: string | null;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * 상품 정보 타입 (상세 조회 응답의 product 필드)
 */
export interface ProductInfo {
  /** 상품 ID */
  id: string;
  /** 상품명 */
  name: string;
  /** 가격 */
  price: number;
  /** 상품 타입 */
  product_type: string;
  /** 활성화 여부 */
  is_active: boolean;
  /** 최대 미디어 개수 */
  max_media_count: number;
  /** 미디어 타입 목록 */
  media_types: string[];
}

/**
 * 주문 상세 조회 응답 타입
 */
export interface GetOrderResponse {
  /** 주문 정보 */
  order: OrderDetail;
  /** 상품 정보 */
  product: ProductInfo;
}

/**
 * 주문 상태 조회 응답 타입
 */
export interface GetOrderStatusResponse {
  /** 주문 ID */
  order_id: string;
  /** 주문 상태 */
  order_status: OrderStatus;
  /** 총 금액 */
  total_amount: number;
  /** 결제 금액 */
  payment_amount: number | null;
  /** 결제 키 */
  payment_key: string | null;
  /** 결제 상태 */
  payment_status: string | null;
  /** 승인 일시 */
  approved_at: string | null;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * 주문 상태 변경 요청 타입
 */
export interface UpdateOrderStatusRequest {
  /** 주문 상태 */
  status: OrderStatus;
  /** 상태 변경 사유 (선택적) */
  reason?: string;
}

/**
 * 주문 상태 변경 응답 타입
 */
export interface UpdateOrderStatusResponse {
  /** 주문 ID */
  order_id: string;
  /** 변경된 주문 상태 */
  status: OrderStatus;
  /** 업데이트 일시 */
  updated_at: string;
}
