/**
 * @fileoverview ParticipantList 컴포넌트 타입 정의
 * @description 참여자 목록 컴포넌트의 타입 정의
 */

import type { Participant } from '@/commons/apis/capsules/step-rooms/types';

/**
 * ParticipantList 컴포넌트 Props
 */
export interface ParticipantListProps {
  /** 참여자 목록 */
  participants: Participant[];
  /** 현재 참여 인원수 */
  currentHeadcount: number;
  /** 최대 참여 인원수 */
  maxHeadcount: number;
  /** 현재 사용자 ID (내 참여자 항목 강조용) */
  currentUserId?: string;
  /** 친구 초대 핸들러 */
  onInviteFriend?: () => void;
  /** 내 글 작성하기 핸들러 */
  onWriteMyContent?: () => void;
}
