/**
 * 캡슐 기본 정보 조회 훅
 * React Query를 활용한 캡슐 상세 정보 조회
 * 
 * ⚠️ 참고: 이스터에그만 대상입니다. 타임캡슐은 이 task에서 기능 대상이 아닙니다.
 */

import { useQuery } from '@tanstack/react-query';
import type { GetCapsuleResponse } from '@/commons/apis/easter-egg/types';
import { getCapsule } from '@/commons/apis/easter-egg';

export interface UseCapsuleDetailParams {
  /** 캡슐 ID (UUID) */
  id: string | null;
  /** 사용자 현재 위도 */
  lat: number | null;
  /** 사용자 현재 경도 */
  lng: number | null;
}

export interface UseCapsuleDetailReturn {
  /** 캡슐 상세 정보 */
  capsule: GetCapsuleResponse | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
}

/**
 * 캡슐 기본 정보를 조회하는 훅
 * 
 * @param params 캡슐 정보 조회 파라미터
 */
export function useCapsuleDetail(
  params: UseCapsuleDetailParams
): UseCapsuleDetailReturn {
  const { id, lat, lng } = params;

  // React Query를 활용한 캡슐 기본 정보 조회
  const { data, isLoading, error } = useQuery<GetCapsuleResponse>({
    queryKey: ['capsule', id, lat, lng],
    queryFn: async () => {
      if (!id || lat === null || lng === null) {
        throw new Error('캡슐 ID와 위치 정보가 필요합니다.');
      }

      // 실제 API 호출
      return await getCapsule(id, lat, lng);
    },
    enabled: !!id && lat !== null && lng !== null, // id와 위치가 있을 때만 활성화
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });

  return {
    capsule: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}
