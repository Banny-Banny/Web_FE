/**
 * 주소 조회 훅
 * 좌표를 기반으로 주소를 조회하며, 디바운싱과 캐싱을 통해 API 호출을 최적화합니다.
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
 * 주소 캐시 타입
 */
interface AddressCache {
  address: string | null;
  timestamp: number;
}

/**
 * 주소 캐시 맵 (좌표 키 -> 주소)
 * 캐시 유효 시간: 5분
 */
const addressCacheMap = new Map<string, AddressCache>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5분

/**
 * 좌표를 캐시 키로 변환 (소수점 4자리까지만 사용하여 근접한 좌표는 같은 키로 처리)
 */
function getCacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * 캐시에서 주소 조회
 */
function getCachedAddress(lat: number, lng: number): string | null {
  const key = getCacheKey(lat, lng);
  const cached = addressCacheMap.get(key);
  
  if (!cached) {
    return null;
  }
  
  // 캐시 만료 확인
  const now = Date.now();
  if (now - cached.timestamp > CACHE_EXPIRY_TIME) {
    addressCacheMap.delete(key);
    return null;
  }
  
  return cached.address;
}

/**
 * 주소를 캐시에 저장
 */
function setCachedAddress(lat: number, lng: number, address: string | null): void {
  const key = getCacheKey(lat, lng);
  addressCacheMap.set(key, {
    address,
    timestamp: Date.now(),
  });
  
  // 캐시 크기 제한 (최대 100개)
  if (addressCacheMap.size > 100) {
    // 가장 오래된 항목 삭제
    const firstKey = addressCacheMap.keys().next().value;
    if (firstKey) {
      addressCacheMap.delete(firstKey);
    }
  }
}

/**
 * 좌표를 기반으로 주소를 조회하는 훅
 * 디바운싱과 캐싱을 통해 API 호출을 최적화합니다.
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
   * 주소를 조회합니다 (디바운싱 및 캐싱 적용)
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

    // 캐시에서 주소 조회
    const cachedAddress = getCachedAddress(lat, lng);
    if (cachedAddress !== null) {
      setAddress(cachedAddress);
      setError(null);
      setIsLoading(false);
      lastCoordRef.current = { lat, lng };
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
          // 캐시에 저장
          setCachedAddress(lat, lng, result);
        } else {
          setAddress(null);
          setError('주소를 찾을 수 없습니다.');
          // 빈 결과도 캐시에 저장 (불필요한 재요청 방지)
          setCachedAddress(lat, lng, null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '주소 조회에 실패했습니다.';
        setError(errorMessage);
        setAddress(null);
        console.error('[useAddress] 주소 조회 실패:', err);
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
