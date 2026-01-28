/**
 * 카카오 주소 조회 훅
 * 좌표를 기반으로 도로명 주소를 조회합니다.
 * React Query를 사용하여 캐싱과 자동 재시도를 처리합니다.
 */

import { useQuery } from '@tanstack/react-query';
import { getRoadAddressFromCoord } from '@/commons/apis/kakao-map/address';

export interface UseKakaoAddressProps {
  /** 위도 */
  lat: number | null | undefined;
  /** 경도 */
  lng: number | null | undefined;
  /** 기존 주소가 있으면 API 호출하지 않음 */
  existingAddress?: string | null;
  /** 쿼리 활성화 여부 (기본값: 좌표가 있고 기존 주소가 없을 때) */
  enabled?: boolean;
}

export interface UseKakaoAddressReturn {
  /** 조회된 주소 */
  address: string | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  isError: boolean;
}

/**
 * 좌표를 기반으로 카카오 도로명 주소를 조회하는 훅
 * 
 * @param props - 훅 옵션
 * @returns 주소 조회 결과
 */
export function useKakaoAddress({
  lat,
  lng,
  existingAddress,
  enabled,
}: UseKakaoAddressProps): UseKakaoAddressReturn {
  const hasLocation = !!lat && !!lng;
  const shouldFetch = enabled !== undefined 
    ? enabled 
    : hasLocation && !existingAddress;

  const { data: address, isLoading, isError } = useQuery({
    queryKey: ['kakaoAddress', lat, lng],
    queryFn: () => {
      if (!lat || !lng) {
        return Promise.resolve(null);
      }
      return getRoadAddressFromCoord({ 
        x: lng, 
        y: lat 
      });
    },
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐시
    retry: 1,
  });

  return {
    address: address || null,
    isLoading,
    isError,
  };
}
