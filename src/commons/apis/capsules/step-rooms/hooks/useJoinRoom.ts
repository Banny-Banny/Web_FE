/**
 * @fileoverview 초대 코드로 방 참여 React Query 훅
 */

import { useMutation } from '@tanstack/react-query';
import { joinRoom } from '../index';
import type { JoinRoomRequest, JoinRoomResponse } from '../types';

interface JoinRoomVariables extends JoinRoomRequest {
  capsuleId: string;
}

/**
 * 방 참여 훅
 *
 * 409 ALREADY_JOINED 는 상위에서 처리하기 위해 그대로 throw 합니다.
 */
export function useJoinRoom() {
  return useMutation<JoinRoomResponse, unknown, JoinRoomVariables>({
    mutationFn: ({ capsuleId, invite_code }: JoinRoomVariables) =>
      joinRoom(capsuleId, { invite_code }),
  });
}

