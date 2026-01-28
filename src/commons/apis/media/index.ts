/**
 * 미디어 API 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { MEDIA_ENDPOINTS } from '../endpoints';
import { GetMediaUrlResponse } from './types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

// 타입 export
export type * from './types';

/**
 * 미디어 URL 조회 API
 * 
 * @param id - 미디어 ID
 * @returns 미디어 URL 응답
 * @throws ApiError API 호출 실패 시
 */
export async function getMediaUrl(id: string): Promise<GetMediaUrlResponse> {
  try {
    const response = await apiClient.get<GetMediaUrlResponse>(
      MEDIA_ENDPOINTS.GET_MEDIA_URL(id)
    );
    return response.data;
  } catch (error: any) {
    // Axios 에러를 ApiError 형식으로 변환
    const apiError: ApiError = {
      message: error.message || error.response?.data?.message || '미디어 URL 조회 중 오류가 발생했습니다.',
      status: error.response?.status || error.status,
      code: error.response?.data?.code || error.code,
      details: error.response?.data || error.details,
    };
    throw apiError;
  }
}
