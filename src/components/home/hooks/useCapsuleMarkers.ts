/**
 * 캡슐 마커 관리 훅
 * React Query를 활용한 캡슐 목록 조회 및 관리
 * 
 * ⚠️ 참고: 지도에는 이스터에그와 타임캡슐 마커가 모두 표시되지만,
 * 이 task(007-easter-egg-map-display) 내의 기능은 이스터에그만 대상입니다.
 */

import { useQuery } from '@tanstack/react-query';
import type { CapsuleItem, GetCapsulesResponse } from '@/commons/apis/easter-egg/types';
import { getCapsules } from '@/commons/apis/easter-egg';
import { DEFAULT_CENTER } from '../constants';

export interface UseCapsuleMarkersParams {
  /** 사용자 현재 위도 */
  lat: number | null;
  /** 사용자 현재 경도 */
  lng: number | null;
  /** 조회 반경(m) (기본 300) */
  radius_m?: number;
}

export interface UseCapsuleMarkersReturn {
  /** 캡슐 목록 */
  capsules: CapsuleItem[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
}

/**
 * 캡슐 마커를 관리하는 훅
 * 
 * @param params 캡슐 목록 조회 파라미터
 */
export function useCapsuleMarkers(
  params: UseCapsuleMarkersParams
): UseCapsuleMarkersReturn {
  const { lat, lng, radius_m = 300 } = params;

  // 사용자 위치 또는 기본 위치 사용
  const centerLat = lat ?? DEFAULT_CENTER.lat;
  const centerLng = lng ?? DEFAULT_CENTER.lng;

  // React Query를 활용한 캡슐 목록 조회
  const { data, isLoading, error } = useQuery<GetCapsulesResponse>({
    queryKey: ['capsules', centerLat, centerLng, radius_m],
    queryFn: async () => {
      // 실제 API 호출
      const response = await getCapsules({
        lat: centerLat,
        lng: centerLng,
        radius_m,
        limit: 50,
        include_consumed: false,
        include_locationless: false,
      });

      return response;
    },
    enabled: true, // 항상 활성화 (위치가 없어도 기본 위치 기준으로 표시)
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분 (이전 cacheTime)
  });

  return {
    capsules: data?.items ?? [],
    isLoading,
    error: error as Error | null,
  };
}
