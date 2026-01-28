/**
 * @fileoverview 대기실 API 함수
 * @description 타임캡슐 대기실 조회 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { CAPSULE_ENDPOINTS } from '../../endpoints';
import type {
  WaitingRoomSettingsResponse,
  WaitingRoomDetailResponse,
} from './types';

/**
 * 대기실 설정값 조회 API
 * 
 * 캡슐 설정에서 설정한 정보를 조회합니다.
 * JWT Bearer 토큰이 자동으로 포함됩니다.
 * 
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {Promise<WaitingRoomSettingsResponse>} 대기실 설정값 응답
 * 
 * @throws {404} STEP_ROOM_NOT_FOUND - 대기실을 찾을 수 없음
 * @throws {401} UNAUTHORIZED - 인증되지 않은 사용자
 * @throws {403} FORBIDDEN - 권한 없는 사용자
 * 
 * @example
 * ```typescript
 * const settings = await getWaitingRoomSettings('capsule-123');
 * ```
 */
export async function getWaitingRoomSettings(
  capsuleId: string
): Promise<WaitingRoomSettingsResponse> {
  const response = await apiClient.get<WaitingRoomSettingsResponse>(
    CAPSULE_ENDPOINTS.WAITING_ROOM_SETTINGS(capsuleId)
  );
  return response.data;
}

/**
 * 대기실 상세 정보 조회 API
 * 
 * 대기실 상세 정보 및 참여자 목록을 조회합니다.
 * JWT Bearer 토큰이 자동으로 포함됩니다.
 * 
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns {Promise<WaitingRoomDetailResponse>} 대기실 상세 정보 응답
 * 
 * @throws {404} STEP_ROOM_NOT_FOUND - 대기실을 찾을 수 없음
 * @throws {401} UNAUTHORIZED - 인증되지 않은 사용자
 * @throws {403} FORBIDDEN - 권한 없는 사용자
 * 
 * @example
 * ```typescript
 * const detail = await getWaitingRoomDetail('capsule-123');
 * ```
 */
export async function getWaitingRoomDetail(
  capsuleId: string
): Promise<WaitingRoomDetailResponse> {
  const response = await apiClient.get<WaitingRoomDetailResponse>(
    CAPSULE_ENDPOINTS.WAITING_ROOM_DETAIL(capsuleId)
  );
  return response.data;
}
