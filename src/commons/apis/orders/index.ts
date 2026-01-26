/**
 * @fileoverview 주문 관리 API 함수
 * @description 주문 생성, 조회, 상태 관리 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { ORDER_ENDPOINTS } from '../endpoints';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrderStatusResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from './types';

/**
 * 주문 생성 API
 * 
 * 타임캡슐 주문을 생성합니다. 결제 전에 호출됩니다.
 * 
 * @param {CreateOrderRequest} data - 주문 생성 요청 데이터
 * @returns {Promise<CreateOrderResponse>} 주문 생성 응답
 * 
 * @example
 * ```typescript
 * const order = await createOrder({
 *   product_id: 'time-capsule-product-1',
 *   time_option: '1_MONTH',
 *   headcount: 5,
 *   photo_count: 10,
 *   add_music: false,
 *   add_video: false,
 * });
 * ```
 */
export async function createOrder(
  data: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const response = await apiClient.post<CreateOrderResponse>(
    ORDER_ENDPOINTS.CREATE,
    data
  );
  return response.data;
}

/**
 * 주문 상세 조회 API
 * 
 * 주문 ID로 주문 상세 정보를 조회합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @returns {Promise<GetOrderResponse>} 주문 상세 정보
 * 
 * @example
 * ```typescript
 * const order = await getOrder('order-123');
 * ```
 */
export async function getOrder(orderId: string): Promise<GetOrderResponse> {
  const response = await apiClient.get<GetOrderResponse>(
    ORDER_ENDPOINTS.DETAIL(orderId)
  );
  return response.data;
}

/**
 * 주문 상태 및 결제 정보 조회 API
 * 
 * 주문 ID로 주문 상태와 결제 정보를 조회합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @returns {Promise<GetOrderStatusResponse>} 주문 상태 및 결제 정보
 * 
 * @example
 * ```typescript
 * const status = await getOrderStatus('order-123');
 * ```
 */
export async function getOrderStatus(
  orderId: string
): Promise<GetOrderStatusResponse> {
  const response = await apiClient.get<GetOrderStatusResponse>(
    ORDER_ENDPOINTS.STATUS(orderId)
  );
  return response.data;
}

/**
 * 주문 상태 변경 API (수동)
 * 
 * 주문 상태를 수동으로 변경합니다.
 * 
 * @param {string} orderId - 주문 ID
 * @param {UpdateOrderStatusRequest} data - 상태 변경 요청 데이터
 * @returns {Promise<UpdateOrderStatusResponse>} 상태 변경 응답
 * 
 * @example
 * ```typescript
 * const result = await updateOrderStatus('order-123', {
 *   status: 'CANCELLED',
 *   reason: '사용자 요청',
 * });
 * ```
 */
export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusResponse> {
  const response = await apiClient.post<UpdateOrderStatusResponse>(
    ORDER_ENDPOINTS.UPDATE_STATUS(orderId),
    data
  );
  return response.data;
}
