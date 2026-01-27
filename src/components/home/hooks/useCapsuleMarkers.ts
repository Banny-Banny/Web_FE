/**
 * 캡슐 마커 관리 훅
 * React Query를 활용한 캡슐 목록 조회 및 관리
 * 
 * ⚠️ 참고: 지도에는 이스터에그와 타임캡슐 마커가 모두 표시되지만,
 * 이 task(007-easter-egg-map-display) 내의 기능은 이스터에그만 대상입니다.
 */

import { useQuery } from '@tanstack/react-query';
import type { CapsuleItem, GetCapsulesResponse } from '@/commons/apis/easter-egg/types';
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

  // React Query를 활용한 캡슐 목록 조회
  const { data, isLoading, error } = useQuery<GetCapsulesResponse>({
    queryKey: ['capsules', lat, lng, radius_m],
    queryFn: async () => {
      // Mock 데이터 반환 (초기 구현)
      // TODO: Phase 11에서 실제 API 호출로 교체
      return new Promise<GetCapsulesResponse>((resolve) => {
        setTimeout(() => {
          // 사용자 위치 또는 기본 위치 기준으로 Mock 데이터 생성
          const centerLat = lat ?? DEFAULT_CENTER.lat;
          const centerLng = lng ?? DEFAULT_CENTER.lng;
          
          // 주변에 여러 캡슐 배치 (반경 300m 내)
          const mockCapsules: CapsuleItem[] = [
            // 이스터에그 타입 (파란색 마커)
            {
              id: 'mock-capsule-1',
              title: '친구 이스터에그 1',
              content: '가까운 곳에 있는 이스터에그',
              latitude: centerLat + 0.0005, // 약 50m 북쪽
              longitude: centerLng + 0.0005, // 약 50m 동쪽
              distance_m: 15,
              type: 'EASTER_EGG',
              is_mine: false,
              is_locked: false,
              can_open: true,
              view_limit: 10,
              view_count: 3,
              media_types: ['image'],
              media_urls: ['https://example.com/image.jpg'],
            },
            {
              id: 'mock-capsule-2',
              title: '친구 이스터에그 2',
              content: '조금 더 먼 곳의 이스터에그',
              latitude: centerLat - 0.001, // 약 100m 남쪽
              longitude: centerLng + 0.0008, // 약 80m 동쪽
              distance_m: 120,
              type: 'EASTER_EGG',
              is_mine: false,
              is_locked: false,
              can_open: true,
              view_limit: 5,
              view_count: 2,
            },
            // 타임캡슐 타입 (빨간색 마커)
            {
              id: 'mock-capsule-3',
              title: '친구 타임캡슐',
              content: '타임캡슐을 발견했습니다!',
              latitude: centerLat + 0.0008, // 약 80m 북쪽
              longitude: centerLng - 0.001, // 약 100m 서쪽
              distance_m: 180,
              type: 'TIME_CAPSULE',
              is_mine: false,
              is_locked: false,
              can_open: true,
              view_limit: 3,
              view_count: 1,
            },
            // 내 캡슐
            {
              id: 'mock-capsule-4',
              title: '내 이스터에그',
              content: '내가 숨긴 이스터에그',
              latitude: centerLat - 0.0003, // 약 30m 남쪽
              longitude: centerLng - 0.0005, // 약 50m 서쪽
              distance_m: 60,
              type: 'EASTER_EGG',
              is_mine: true,
              is_locked: false,
              can_open: true,
              view_limit: 5,
              view_count: 2,
            },
            // 멀리 있는 캡슐 (30m 밖)
            {
              id: 'mock-capsule-5',
              title: '멀리 있는 이스터에그',
              content: '힌트만 볼 수 있는 캡슐',
              latitude: centerLat + 0.0015, // 약 150m 북쪽
              longitude: centerLng + 0.0012, // 약 120m 동쪽
              distance_m: 250,
              type: 'EASTER_EGG',
              is_mine: false,
              is_locked: false,
              can_open: false,
            },
            // 추가 타임캡슐
            {
              id: 'mock-capsule-6',
              title: '친구 타임캡슐 2',
              content: '또 다른 타임캡슐',
              latitude: centerLat - 0.0012, // 약 120m 남쪽
              longitude: centerLng - 0.0008, // 약 80m 서쪽
              distance_m: 200,
              type: 'TIME_CAPSULE',
              is_mine: false,
              is_locked: false,
              can_open: true,
              view_limit: 7,
              view_count: 4,
            },
          ];

          if (process.env.NODE_ENV === 'development') {
            console.log('[useCapsuleMarkers] Mock 데이터 생성:', {
              center: { lat: centerLat, lng: centerLng },
              capsules: mockCapsules.length,
              radius_m,
            });
          }

          resolve({
            items: mockCapsules,
            page_info: null,
          });
        }, 300); // 로딩 시뮬레이션 (더 빠르게)
      });
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
