/**
 * 프로필 이미지 업로드 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import type { ProfileImageUploadResponse } from './types';

/** multipart 필드명 (백엔드 스펙에 맞춤) */
const FORM_FIELD_FILE = 'file';

/**
 * 프로필 이미지 업로드 API 호출
 *
 * multipart/form-data로 이미지 파일을 전송합니다. (jpeg/png/webp, 최대 5MB)
 *
 * @param file - 업로드할 이미지 파일
 * @returns 업로드된 프로필 이미지 URL (201 Created)
 * @throws ApiError 400(파일 검증 실패), 401 등
 */
export async function uploadProfileImage(
  file: File
): Promise<ProfileImageUploadResponse> {
  const formData = new FormData();
  formData.append(FORM_FIELD_FILE, file);

  try {
    const response = await apiClient.post<ProfileImageUploadResponse>(
      AUTH_ENDPOINTS.ME_PROFILE_IMAGE,
      formData
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    throw {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '프로필 이미지 업로드 중 오류가 발생했습니다.',
      status: axiosError.response?.status ?? 500,
      code: axiosError.response?.data?.code ?? axiosError.code,
      details: axiosError.response?.data,
    };
  }
}
