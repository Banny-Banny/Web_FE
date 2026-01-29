/**
 * @fileoverview WaitingRoomInfo 컴포넌트 타입 정의
 * @description 대기실 정보 표시 컴포넌트의 타입 정의
 */

import type {
  WaitingRoomDetailResponse,
  WaitingRoomSettingsResponse,
} from '@/commons/apis/capsules/step-rooms/types';

/**
 * WaitingRoomInfo 컴포넌트 Props
 */
export interface WaitingRoomInfoProps {
  /** 대기실 상세 정보 */
  waitingRoom: WaitingRoomDetailResponse;
  /** 대기실 설정값 (optional - 조회 실패 시 대기실 정보로 fallback) */
  settings?: WaitingRoomSettingsResponse;
  /** 친구 초대하기 버튼 클릭 핸들러 */
  onInviteFriend?: () => void;
}
