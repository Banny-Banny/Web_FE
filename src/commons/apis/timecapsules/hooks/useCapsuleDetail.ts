/**
 * 열린 타임캡슐 상세 조회 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getCapsuleDetail } from '../detail';
import type { CapsuleDetailResponse } from '@/commons/apis/me/capsules/types';
import { useAuthState } from '@/commons/hooks/useAuth';

const STALE_TIME = 1000 * 60; // 1분

/**
 * 타임캡슐 상세 조회 훅
 * capsuleId와 현재 사용자 ID가 있을 때만 요청 (enabled)
 */
export function useCapsuleDetail(capsuleId: string | null) {
  const { user } = useAuthState();
  const userId = user?.id ?? '';

  return useQuery<CapsuleDetailResponse>({
    queryKey: ['timecapsules', 'detail', capsuleId],
    queryFn: () => getCapsuleDetail(capsuleId!, userId),
    enabled: !!capsuleId && !!userId,
    staleTime: STALE_TIME,
  });
}
