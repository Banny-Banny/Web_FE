/**
 * @fileoverview useCreateWaitingRoom 훅
 * @description 타임캡슐 대기실 생성을 위한 React Query mutation 훅
 */

import { useMutation } from '@tanstack/react-query';
import { createWaitingRoom } from '../index';
import type {
  CreateWaitingRoomRequest,
  CreateWaitingRoomResponse,
} from '../types';

/**
 * 타임캡슐 대기실 생성 React Query mutation 훅
 * 
 * 대기실 생성 API를 호출하는 mutation을 제공합니다.
 * 
 * @returns React Query mutation 객체
 * 
 * @example
 * ```typescript
 * const createWaitingRoomMutation = useCreateWaitingRoom();
 * 
 * const handleCreate = async () => {
 *   try {
 *     const result = await createWaitingRoomMutation.mutateAsync({
 *       orderId: 'order-123',
 *     });
 *     console.log('대기실 생성 성공:', result);
 *   } catch (error) {
 *     console.error('대기실 생성 실패:', error);
 *   }
 * };
 * ```
 */
export function useCreateWaitingRoom() {
  return useMutation<
    CreateWaitingRoomResponse,
    Error,
    CreateWaitingRoomRequest
  >({
    mutationFn: createWaitingRoom,
  });
}
