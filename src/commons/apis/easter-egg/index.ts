/**
 * 이스터에그 API 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { TIMEEGG_ENDPOINTS } from '../endpoints';
import { 
  CreateEasterEggRequest, 
  CreateEasterEggResponse,
  SlotInfoResponse,
  SlotResetResponse 
} from './types';

/**
 * 이스터에그 생성 API
 * 
 * @param data - 이스터에그 생성 요청 데이터
 * @param onProgress - 파일 업로드 진행률 콜백 (선택)
 * @returns 이스터에그 생성 응답
 */
export async function createEasterEgg(
  data: CreateEasterEggRequest,
  onProgress?: (progress: number) => void
): Promise<CreateEasterEggResponse> {
  const formData = new FormData();
  
  // 필수 필드
  formData.append('latitude', data.latitude.toString());
  formData.append('longitude', data.longitude.toString());
  formData.append('title', data.title);
  
  // 선택 필드
  if (data.message) {
    formData.append('message', data.message);
  }
  if (data.view_limit !== undefined) {
    formData.append('view_limit', data.view_limit.toString());
  }
  if (data.product_id) {
    formData.append('product_id', data.product_id);
  }
  
  // 미디어 파일
  if (data.media_files && data.media_files.length > 0) {
    data.media_files.forEach((file) => {
      formData.append('media_files', file);
    });
  }
  
  const response = await apiClient.post<CreateEasterEggResponse>(
    TIMEEGG_ENDPOINTS.CREATE_CAPSULE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
      timeout: 30000, // 30초 타임아웃
    }
  );
  
  return response.data;
}

/**
 * 슬롯 정보 조회 API
 * 
 * @returns 슬롯 정보 (전체/사용 중/남은 슬롯 개수)
 */
export async function getSlotInfo(): Promise<SlotInfoResponse> {
  const response = await apiClient.get<SlotInfoResponse>(
    TIMEEGG_ENDPOINTS.GET_SLOTS
  );
  return response.data;
}

/**
 * 슬롯 초기화 API
 * 
 * ⚠️ 경고: 이 작업은 되돌릴 수 없습니다.
 * 모든 이스터에그를 삭제하고 슬롯을 기본값(3개)으로 초기화합니다.
 * 
 * @returns 초기화된 슬롯 개수
 */
export async function resetSlots(): Promise<SlotResetResponse> {
  const response = await apiClient.post<SlotResetResponse>(
    TIMEEGG_ENDPOINTS.RESET_SLOTS
  );
  return response.data;
}
