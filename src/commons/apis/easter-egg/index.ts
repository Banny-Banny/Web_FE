/**
 * 이스터에그 API 함수
 */

import { apiClient } from '@/commons/provider/api-provider/api-client';
import { TIMEEGG_ENDPOINTS } from '../endpoints';
import { 
  CreateEasterEggRequest, 
  CreateEasterEggResponse,
  SlotInfoResponse,
  SlotResetResponse,
  GetCapsulesRequest,
  GetCapsulesResponse,
  GetCapsuleResponse,
  RecordCapsuleViewRequest,
  RecordCapsuleViewResponse,
  GetCapsuleViewersResponse,
  GetMyEggsRequest,
  MyEggsPlantedResponse,
  MyEggsFoundResponse,
  MyEggsResponseSimple,
  EggDetailResponse
} from './types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

// 타입 export
export type * from './types';

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
  if (data.content) {
    formData.append('content', data.content);
  }
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
      timeout: 120000, // 120초 타임아웃 (파일 업로드 포함 요청은 시간이 더 걸릴 수 있음)
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

/**
 * 캡슐 목록 조회 API
 * 
 * @param params - 캡슐 목록 조회 요청 파라미터
 * @returns 캡슐 목록 조회 응답
 */
export async function getCapsules(
  params: GetCapsulesRequest
): Promise<GetCapsulesResponse> {
  const response = await apiClient.get<GetCapsulesResponse>(
    TIMEEGG_ENDPOINTS.GET_CAPSULES,
    {
      params: {
        lat: params.lat,
        lng: params.lng,
        radius_m: params.radius_m ?? 300,
        limit: params.limit ?? 50,
        cursor: params.cursor,
        include_consumed: params.include_consumed ?? false,
        include_locationless: params.include_locationless ?? false,
      },
    }
  );
  return response.data;
}

/**
 * 캡슐 기본 정보 조회 API
 * 
 * @param id - 캡슐 ID (UUID)
 * @param lat - 사용자 현재 위도
 * @param lng - 사용자 현재 경도
 * @returns 캡슐 기본 정보 응답
 */
export async function getCapsule(
  id: string,
  lat: number,
  lng: number
): Promise<GetCapsuleResponse> {
  const response = await apiClient.get<GetCapsuleResponse>(
    TIMEEGG_ENDPOINTS.GET_CAPSULE(id),
    {
      params: {
        lat,
        lng,
      },
    }
  );
  return response.data;
}

/**
 * 캡슐 발견 기록 API
 * 
 * @param id - 캡슐 ID (UUID)
 * @param data - 발견 위치 정보 (선택)
 * @returns 캡슐 발견 기록 응답
 */
export async function recordCapsuleView(
  id: string,
  data?: RecordCapsuleViewRequest
): Promise<RecordCapsuleViewResponse> {
  const response = await apiClient.post<RecordCapsuleViewResponse>(
    TIMEEGG_ENDPOINTS.RECORD_CAPSULE_VIEW(id),
    data ?? {}
  );
  return response.data;
}

/**
 * 캡슐 발견자 목록 조회 API
 * 
 * @param id - 캡슐 ID (UUID)
 * @returns 캡슐 발견자 목록 조회 응답
 */
export async function getCapsuleViewers(
  id: string
): Promise<GetCapsuleViewersResponse> {
  const response = await apiClient.get<GetCapsuleViewersResponse>(
    TIMEEGG_ENDPOINTS.GET_CAPSULE_VIEWERS(id)
  );
  return response.data;
}

/**
 * 내 이스터에그 목록 조회 API (tasks.md T004 요구사항 - 파라미터 없음)
 * 
 * @returns 이스터에그 목록 응답 (MyEggsResponseSimple)
 * @throws ApiError API 호출 실패 시
 */
export async function getMyEggs(): Promise<MyEggsResponseSimple>;
/**
 * 내 이스터에그 목록 조회 API (파라미터 버전)
 * 
 * @param params - 조회 파라미터 (type: PLANTED | FOUND, sort?: LATEST | OLDEST)
 * @returns 이스터에그 목록 응답 (PLANTED 또는 FOUND 타입에 따라 다른 구조)
 * 
 * @example
 * ```typescript
 * // 심은 알 조회
 * const plantedEggs = await getMyEggs({ type: 'PLANTED' });
 * 
 * // 발견한 알 조회 (최신순)
 * const foundEggs = await getMyEggs({ type: 'FOUND', sort: 'LATEST' });
 * 
 * // 발견한 알 조회 (오래된순)
 * const foundEggsOldest = await getMyEggs({ type: 'FOUND', sort: 'OLDEST' });
 * ```
 */
export async function getMyEggs(
  params: GetMyEggsRequest
): Promise<MyEggsPlantedResponse | MyEggsFoundResponse>;
export async function getMyEggs(
  params?: GetMyEggsRequest
): Promise<MyEggsResponseSimple | MyEggsPlantedResponse | MyEggsFoundResponse> {
  try {
    // 파라미터가 없으면 tasks.md T004 요구사항에 맞게 단순 조회
    if (!params) {
      const response = await apiClient.get<MyEggsResponseSimple>(
        TIMEEGG_ENDPOINTS.GET_MY_EGGS
      );
      return response.data;
    }

    // 파라미터가 있으면 기존 로직 사용
    const queryParams: Record<string, string> = {
      type: params.type,
    };

    // FOUND 타입일 때만 sort 파라미터 추가
    if (params.type === 'FOUND' && params.sort) {
      queryParams.sort = params.sort;
    }

    const response = await apiClient.get<MyEggsPlantedResponse | MyEggsFoundResponse>(
      TIMEEGG_ENDPOINTS.GET_MY_EGGS,
      {
        params: queryParams,
      }
    );

    return response.data;
  } catch (error: any) {
    // Axios 에러를 ApiError 형식으로 변환
    const apiError: ApiError = {
      message: error.message || error.response?.data?.message || '이스터에그 목록 조회 중 오류가 발생했습니다.',
      status: error.response?.status || error.status,
      code: error.response?.data?.code || error.code,
      details: error.response?.data || error.details,
    };
    throw apiError;
  }
}

/**
 * 알 상세 정보 조회 API (tasks.md T005 요구사항)
 * 
 * @param id - 이스터에그 ID
 * @returns 알 상세 정보 응답 (EggDetailResponse)
 * @throws ApiError API 호출 실패 시
 */
export async function getEggDetail(id: string): Promise<EggDetailResponse> {
  try {
    const response = await apiClient.get<EggDetailResponse>(
      `${TIMEEGG_ENDPOINTS.GET_CAPSULE(id)}/detail`
    );
    return response.data;
  } catch (error: any) {
    // Axios 에러를 ApiError 형식으로 변환
    const apiError: ApiError = {
      message: error.message || error.response?.data?.message || '이스터에그 상세 정보 조회 중 오류가 발생했습니다.',
      status: error.response?.status || error.status,
      code: error.response?.data?.code || error.code,
      details: error.response?.data || error.details,
    };
    throw apiError;
  }
}
