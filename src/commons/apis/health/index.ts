/**
 * Health Check API 클라이언트
 * 서버 상태 확인 및 기본 API 엔드포인트 관련 함수
 */

import { api } from '../../provider/api-provider/api-client';
import { HEALTH_ENDPOINTS } from '../endpoints';
import type { HealthResponse, BaseApiResponse } from './types';

/**
 * 기본 API 엔드포인트 호출
 * @returns 기본 API 응답
 * @throws API가 텍스트를 반환하는 경우 에러 발생 가능
 */
export const getBaseApi = async (): Promise<BaseApiResponse> => {
  try {
    const response = await api.get<BaseApiResponse>(HEALTH_ENDPOINTS.BASE);
    // API 응답이 직접 데이터를 반환하는 경우와 래핑된 경우 모두 처리
    // response.data는 ApiResponse<BaseApiResponse> 타입
    // response.data.data가 있으면 그것을 사용, 없으면 response.data를 unknown으로 변환 후 BaseApiResponse로 캐스팅
    if (response.data.data) {
      return response.data.data;
    }
    // 실제 API가 직접 BaseApiResponse를 반환하는 경우
    return response.data as unknown as BaseApiResponse;
  } catch (error: unknown) {
    // 텍스트 응답("Hello World!")인 경우 JSON 파싱 에러 발생
    // 이 경우 빈 객체 반환 또는 에러 재발생
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      const responseData = error.response.data;
      if (typeof responseData === 'string') {
        // 텍스트 응답인 경우 기본 응답 객체 반환
        return {
          message: responseData,
        };
      }
    }
    throw error;
  }
};

/**
 * 서버 상태 확인
 * @returns 서버 상태 정보
 */
export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>(HEALTH_ENDPOINTS.HEALTH);
  // API 응답이 직접 데이터를 반환하는 경우와 래핑된 경우 모두 처리
  // response.data는 ApiResponse<HealthResponse> 타입
  // response.data.data가 있으면 그것을 사용, 없으면 response.data를 unknown으로 변환 후 HealthResponse로 캐스팅
  if (response.data.data) {
    return response.data.data;
  }
  // 실제 API가 직접 HealthResponse를 반환하는 경우
  return response.data as unknown as HealthResponse;
};

/**
 * Health Check API 함수들
 */
export const healthApi = {
  getBaseApi,
  getHealth,
};

export type { HealthResponse, BaseApiResponse };
