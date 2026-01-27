/**
 * 캡슐 발견 기록 저장 훅
 * 
 * 캡슐 발견 시 기록을 저장하는 React Query Mutation 훅입니다.
 * Optimistic Update를 적용하고, 에러 발생 시에도 사용자 경험에 영향이 없도록 처리합니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useCallback } from 'react';
import { recordCapsuleView } from '@/commons/apis/easter-egg';
import type { RecordCapsuleViewRequest, RecordCapsuleViewResponse } from '@/commons/apis/easter-egg/types';

/**
 * 캡슐 발견 기록 저장 훅
 * 
 * @example
 * ```tsx
 * const { recordView, isRecording } = useRecordCapsuleView();
 * 
 * const handleDiscovery = async () => {
 *   await recordView('capsule-id', { lat: 37.5, lng: 127.0 });
 * };
 * ```
 */
export function useRecordCapsuleView() {
  const queryClient = useQueryClient();
  const isRecordingRef = useRef<Set<string>>(new Set());

  /**
   * React Query Mutation
   */
  const mutation = useMutation({
    mutationFn: async ({
      capsuleId,
      data,
    }: {
      capsuleId: string;
      data?: RecordCapsuleViewRequest;
    }): Promise<RecordCapsuleViewResponse> => {
      // 중복 요청 방지
      if (isRecordingRef.current.has(capsuleId)) {
        // 이미 처리 중인 요청이 있으면 기존 요청 결과를 반환하지 않고 조용히 무시
        throw new Error('이미 처리 중인 요청입니다.');
      }

      // 처리 중인 요청으로 표시
      isRecordingRef.current.add(capsuleId);

      try {
        // 실제 API 호출
        return await recordCapsuleView(capsuleId, data);
      } finally {
        // 처리 완료 후 제거
        isRecordingRef.current.delete(capsuleId);
      }
    },
    onSuccess: (data, variables) => {
      // Optimistic Update: 캡슐 상세 정보 쿼리 무효화
      // 발견 기록이 저장되면 캡슐의 view_count가 업데이트될 수 있으므로
      queryClient.invalidateQueries({
        queryKey: ['capsule', variables.capsuleId],
      });

      // 캡슐 목록 쿼리도 무효화 (view_count 업데이트 반영)
      queryClient.invalidateQueries({
        queryKey: ['capsules'],
      });
    },
    onError: (_error) => {
      // 에러 발생 시에도 사용자 경험에 영향 없도록 조용히 처리
      // 콘솔에만 로그를 남기고 사용자에게는 에러를 표시하지 않음
      // 네트워크 오류나 일시적인 오류의 경우, 사용자가 모달을 볼 수 있도록
      // 에러를 조용히 처리하고 계속 진행
    },
  });

  /**
   * 발견 기록 저장 함수
   * 
   * @param capsuleId - 캡슐 ID
   * @param data - 발견 위치 정보 (선택)
   * @returns Promise<RecordCapsuleViewResponse>
   */
  const recordView = useCallback(
    async (
      capsuleId: string,
      data?: RecordCapsuleViewRequest
    ): Promise<RecordCapsuleViewResponse | undefined> => {
      try {
        const result = await mutation.mutateAsync({
          capsuleId,
          data,
        });
        return result;
      } catch {
        // 에러는 이미 onError에서 처리되므로, 여기서는 undefined 반환
        // 사용자 경험에 영향 없도록 조용히 처리
        return undefined;
      }
    },
    [mutation]
  );

  return {
    recordView,
    isRecording: mutation.isPending,
  };
}
