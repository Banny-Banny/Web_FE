/**
 * @fileoverview 참여자 목록 조회 React Query 훅
 * @description 대기실 참여자 목록을 조회하는 React Query 훅
 */

import { useWaitingRoom } from './useWaitingRoom';

/**
 * 참여자 목록 조회 훅
 * 
 * 대기실 상세 조회 훅을 사용하여 참여자 목록과 참여 인원수 정보를 반환합니다.
 * 
 * @param {string} capsuleId - 대기실 ID (캡슐 ID)
 * @returns 참여자 목록 및 참여 인원수 정보
 * 
 * @example
 * ```typescript
 * const { participants, currentHeadcount, maxHeadcount } = useParticipants('capsule-123');
 * 
 * return (
 *   <div>
 *     <p>참여 인원: {currentHeadcount} / {maxHeadcount}</p>
 *     <ul>
 *       {participants.map(participant => (
 *         <li key={participant.participantId}>{participant.userName}</li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */
export function useParticipants(capsuleId: string | null | undefined) {
  const { data: waitingRoom } = useWaitingRoom(capsuleId);
  
  return {
    participants: waitingRoom?.participants || [],
    currentHeadcount: waitingRoom?.currentHeadcount || 0,
    maxHeadcount: waitingRoom?.maxHeadcount || 0,
  };
}
