/**
 * @fileoverview 대기실 API 함수
 * @description 타임캡슐 대기실 조회 API 호출 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { CAPSULE_ENDPOINTS } from '../../endpoints';
import type {
  WaitingRoomSettingsResponse,
  WaitingRoomSettingsApiResponse,
  WaitingRoomDetailResponse,
  WaitingRoomDetailApiResponse,
  Participant,
  SlotApiResponse,
} from './types';

/**
 * 슬롯 데이터를 참여자 데이터로 변환 (snake_case → camelCase)
 */
function transformSlotToParticipant(slot: SlotApiResponse): Participant {
  return {
    participantId: `slot-${slot.slot_number}`,
    userId: slot.user_id,
    userName: slot.nickname,
    userAvatarUrl: slot.avatar_url,
    slotNumber: slot.slot_number,
    role: slot.is_host ? 'HOST' : 'PARTICIPANT',
    status: slot.status,
  };
}

/**
 * 대기실 상세 정보 변환 (snake_case → camelCase)
 */
function transformWaitingRoomDetail(
  data: WaitingRoomDetailApiResponse,
  maxHeadcount?: number
): WaitingRoomDetailResponse {
  // slots 배열에서 참여자 목록 가져오기
  const slots = data.slots || [];
  const participants = slots.map(transformSlotToParticipant);

  return {
    waitingRoomId: data.room_id,
    capsuleName: data.capsule_name,
    openDate: data.open_date,
    deadline: data.deadline,
    status: data.status ?? 'WAITING',
    currentHeadcount: participants.length,
    maxHeadcount: maxHeadcount ?? participants.length,
    participants,
  };
}

/**
 * 대기실 설정값 변환 (snake_case → camelCase)
 */
function transformWaitingRoomSettings(
  data: WaitingRoomSettingsApiResponse
): WaitingRoomSettingsResponse {
  return {
    roomId: data.room_id,
    capsuleName: data.capsule_name,
    openDate: data.open_date,
    maxHeadcount: data.max_participants,
    maxImagesPerPerson: data.max_images_per_person,
    hasMusic: data.has_music,
    hasVideo: data.has_video,
  };
}

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
  const response = await apiClient.get<WaitingRoomSettingsApiResponse>(
    CAPSULE_ENDPOINTS.WAITING_ROOM_SETTINGS(capsuleId)
  );
  // snake_case → camelCase 변환
  return transformWaitingRoomSettings(response.data);
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
  const response = await apiClient.get<WaitingRoomDetailApiResponse>(
    CAPSULE_ENDPOINTS.WAITING_ROOM_DETAIL(capsuleId)
  );
  // 디버깅: 실제 API 응답 확인
  console.log('[getWaitingRoomDetail] API 응답 (원본):', response.data);
  // snake_case → camelCase 변환 (maxHeadcount는 settings에서 가져와야 함)
  const transformed = transformWaitingRoomDetail(response.data);
  console.log('[getWaitingRoomDetail] API 응답 (변환됨):', transformed);
  return transformed;
}
