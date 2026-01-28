/**
 * @fileoverview 방 생성(타임캡슐 대기실 생성) React Query 훅
 */

import { useMutation } from '@tanstack/react-query';
import { createRoom } from '../index';
import type { CreateRoomRequest, CreateRoomResponse } from '../types';

/**
 * 방 생성 훅
 *
 * 결제 완료 후 타임캡슐 대기실을 생성하고 초대 코드를 발급받습니다.
 */
export function useCreateRoom() {
  return useMutation<CreateRoomResponse, unknown, CreateRoomRequest>({
    mutationFn: (payload: CreateRoomRequest) => createRoom(payload),
  });
}

