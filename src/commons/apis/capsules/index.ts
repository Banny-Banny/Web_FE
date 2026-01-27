/**
 * @fileoverview 캡슐 API 함수
 * @description 타임캡슐 대기실 생성 등 캡슐 관련 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { CAPSULE_ENDPOINTS } from '../endpoints';
import type {
  CreateWaitingRoomRequest,
  CreateWaitingRoomResponse,
} from './types';

/**
 * 타임캡슐 대기실 생성 API
 * 
 * 결제 승인 성공 후 타임캡슐 대기실을 생성합니다.
 * JWT Bearer 토큰이 자동으로 포함됩니다.
 * 
 * @param {CreateWaitingRoomRequest} data - 대기실 생성 요청 데이터
 * @returns {Promise<CreateWaitingRoomResponse>} 대기실 생성 응답
 * 
 * @example
 * ```typescript
 * const result = await createWaitingRoom({
 *   orderId: 'order-123',
 * });
 * ```
 */
export async function createWaitingRoom(
  data: CreateWaitingRoomRequest
): Promise<CreateWaitingRoomResponse> {
  const response = await apiClient.post<CreateWaitingRoomResponse>(
    CAPSULE_ENDPOINTS.CREATE_WAITING_ROOM,
    data
  );
  return response.data;
}
