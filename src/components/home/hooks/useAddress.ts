/**
 * 주소 조회 훅
 * 좌표를 기반으로 주소를 조회하며, 디바운싱을 통해 API 호출을 최적화합니다.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { getAddressFromCoord } from '@/commons/apis/kakao-map/address';
import { ADDRESS_DEBOUNCE_TIME } from '../constants';

export interface UseAddressReturn {
  /** 조회된 주소 */
  address: string | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 주소 조회 함수 */
  fetchAddress: (lat: number, lng: number) => void;
}

/**
 * 좌표를 기반으로 주소를 조회하는 훅
 * 디바운싱을 통해 API 호출을 최적화합니다.
 * 
 * @returns 주소 조회 상태 및 함수
 */
export function useAddress(): UseAddressReturn {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 디바운싱을 위한 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 마지막 요청 좌표를 저장하여 중복 요청 방지
  const lastCoordRef = useRef<{ lat: number; lng: number } | null>(null);

  /**
   * 주소를 조회합니다 (디바운싱 적용)
   */
  const fetchAddress = useCallback((lat: number, lng: number) => {
    // 이전 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 같은 좌표인 경우 요청하지 않음
    if (
      lastCoordRef.current &&
      lastCoordRef.current.lat === lat &&
      lastCoordRef.current.lng === lng
    ) {
      return;
    }

    // 로딩 상태 설정
    setIsLoading(true);
    setError(null);

    // 디바운싱 타이머 설정
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // 좌표 저장
        lastCoordRef.current = { lat, lng };

        // API 호출
        const result = await getAddressFromCoord({
          x: lng, // 경도
          y: lat, // 위도
        });

        if (result) {
          setAddress(result);
          setError(null);
        } else {
          setAddress(null);
          setError('주소를 찾을 수 없습니다.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '주소 조회에 실패했습니다.';
        setError(errorMessage);
        setAddress(null);
        console.error('주소 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }, ADDRESS_DEBOUNCE_TIME);
  }, []);

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    address,
    isLoading,
    error,
    fetchAddress,
  };
}
