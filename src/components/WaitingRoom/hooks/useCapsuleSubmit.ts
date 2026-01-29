/**
 * @fileoverview 타임캡슐 제출 훅
 * @description 타임캡슐 제출 플로우 관리 (GPS 수집 + API 호출)
 */

import { useState, useCallback } from 'react';
import { useCapsuleSubmit as useCapsuleSubmitMutation } from '@/commons/apis/capsules/step-rooms/hooks/useCapsuleSubmit';
import { useGeolocation } from './useGeolocation';
import type { CapsuleSubmitResponse } from '@/commons/apis/capsules/step-rooms/types';

/**
 * 에러 코드를 사용자 친화적인 메시지로 변환
 *
 * @param {string} code - 에러 코드
 * @param {boolean} isAutoSubmitted - 자동 제출 여부
 * @returns {string} 사용자 친화적인 에러 메시지
 */
function getErrorMessage(code: string, isAutoSubmitted?: boolean): string {
  switch (code) {
    case 'INCOMPLETE_PARTICIPANTS':
      return '아직 제출하지 않은 참여자가 있습니다';
    case 'NOT_HOST':
      return '방장만 제출할 수 있습니다';
    case 'ALREADY_SUBMITTED':
      return isAutoSubmitted
        ? '24시간이 경과하여 자동으로 제출되었습니다'
        : '이미 제출된 타임캡슐입니다';
    case 'INVALID_LOCATION':
      return '위치 정보를 가져올 수 없습니다';
    case 'PAYMENT_NOT_COMPLETED':
      return '결제가 완료되지 않았습니다';
    case 'UNAUTHORIZED':
      return '로그인이 필요합니다';
    case 'ROOM_NOT_FOUND':
      return '대기실을 찾을 수 없습니다';
    case 'INTERNAL_SERVER_ERROR':
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
    default:
      return '오류가 발생했습니다. 다시 시도해주세요';
  }
}

/**
 * GPS 에러를 사용자 친화적인 메시지로 변환
 *
 * @param {Error} error - GPS 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
function getGeolocationErrorMessage(error: Error): string {
  const message = error.message || '';
  
  if (message.includes('권한')) {
    return '위치 권한을 허용해주세요. 설정에서 위치 권한을 확인해주세요';
  }
  if (message.includes('GPS 신호')) {
    return 'GPS 신호를 받을 수 있는 곳으로 이동해주세요';
  }
  if (message.includes('시간이 오래')) {
    return '위치 정보를 가져오는 데 시간이 오래 걸립니다. 다시 시도해주세요';
  }
  if (message.includes('지원하지 않는')) {
    return '이 브라우저는 GPS를 지원하지 않습니다';
  }
  
  return message || '위치 정보를 가져올 수 없습니다';
}

/**
 * 네트워크 에러를 사용자 친화적인 메시지로 변환
 *
 * @param {any} error - 네트워크 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
function getNetworkErrorMessage(error: any): string {
  // 네트워크 연결 오류
  if (!navigator.onLine) {
    return '인터넷 연결을 확인해주세요';
  }
  
  // 타임아웃 에러
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return '요청 시간이 초과되었습니다. 다시 시도해주세요';
  }
  
  // 네트워크 에러
  if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
    return '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요';
  }
  
  return '네트워크 오류가 발생했습니다. 다시 시도해주세요';
}

/**
 * 타임캡슐 제출 훅
 *
 * GPS 위치 수집 및 타임캡슐 제출 API 호출을 관리합니다.
 *
 * @param {string} roomId - 대기실 ID
 * @returns 제출 함수 및 상태
 *
 * @example
 * ```typescript
 * const { submitCapsule, isSubmitting, error, submitResult } = useCapsuleSubmit('room-123');
 *
 * const handleSubmit = async () => {
 *   try {
 *     await submitCapsule();
 *     console.log('제출 완료:', submitResult);
 *   } catch (error) {
 *     console.error('제출 실패:', error);
 *   }
 * };
 * ```
 */
export function useCapsuleSubmit(roomId: string) {
  const { getCurrentLocation } = useGeolocation();
  const mutation = useCapsuleSubmitMutation(roomId);
  const [error, setError] = useState<string | null>(null);

  /**
   * 타임캡슐 제출 함수
   *
   * 1. GPS 위치 수집
   * 2. 타임캡슐 제출 API 호출
   *
   * @throws {Error} GPS 수집 또는 API 호출 실패 시 에러
   */
  const submitCapsule = useCallback(async () => {
    setError(null);

    try {
      // 1. GPS 위치 수집
      let location;
      try {
        location = await getCurrentLocation();
      } catch (gpsError: any) {
        // GPS 에러 처리
        const gpsErrorMessage = getGeolocationErrorMessage(gpsError);
        setError(gpsErrorMessage);
        throw new Error(gpsErrorMessage);
      }

      // 2. API 호출
      try {
        await mutation.mutateAsync(location);
      } catch (apiError: any) {
        // 네트워크 에러 확인
        if (!apiError.response) {
          const networkErrorMessage = getNetworkErrorMessage(apiError);
          setError(networkErrorMessage);
          throw new Error(networkErrorMessage);
        }

        // API 에러 처리
        const errorCode = apiError.response?.data?.error?.code;
        const isAutoSubmitted =
          apiError.response?.data?.error?.details?.is_auto_submitted;

        const apiErrorMessage = getErrorMessage(errorCode, isAutoSubmitted);
        setError(apiErrorMessage);
        throw new Error(apiErrorMessage);
      }
    } catch (err: any) {
      // 이미 처리된 에러는 그대로 throw
      if (err.message && err.message !== '') {
        throw err;
      }
      
      // 예상치 못한 에러
      const unexpectedErrorMessage = '예상치 못한 오류가 발생했습니다. 다시 시도해주세요';
      setError(unexpectedErrorMessage);
      throw new Error(unexpectedErrorMessage);
    }
  }, [getCurrentLocation, mutation]);

  return {
    submitCapsule,
    isSubmitting: mutation.isPending,
    error,
    submitResult: mutation.data as CapsuleSubmitResponse | undefined,
  };
}
