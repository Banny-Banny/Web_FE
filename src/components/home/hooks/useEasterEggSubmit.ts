/**
 * 이스터에그 제출 훅
 * 
 * 이스터에그 폼 데이터를 검증하고 서버에 제출하는 로직을 캡슐화합니다.
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEasterEgg } from '@/commons/apis/easter-egg';
import type { CreateEasterEggRequest } from '@/commons/apis/easter-egg/types';
import type { EasterEggFormData, Attachment } from '../components/easter-egg-bottom-sheet/types';
import { SLOT_QUERY_KEYS } from './useSlotManagement';

/**
 * 에러 메시지 상수
 */
export const ERROR_MESSAGES = {
  LOCATION_PERMISSION_DENIED: '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.',
  LOCATION_TIMEOUT: '위치 정보를 가져오는 데 시간이 오래 걸립니다. 잠시 후 다시 시도해주세요.',
  LOCATION_UNAVAILABLE: '위치 정보를 사용할 수 없습니다.',
  TITLE_TOO_LONG: '제목은 최대 100자까지 입력할 수 있습니다.',
  TITLE_REQUIRED: '제목을 입력해주세요.',
  MESSAGE_TOO_LONG: '메시지는 최대 500자까지 입력할 수 있습니다.',
  TOO_MANY_FILES: '미디어 파일은 최대 3개까지 첨부할 수 있습니다.',
  MISSING_REQUIRED_FIELDS: '제목과 위치 정보는 필수 항목입니다.',
  SLOT_INSUFFICIENT: '이스터에그를 생성할 슬롯이 부족합니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

/**
 * 폼 데이터 검증 결과
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 폼 데이터 검증
 */
function validateFormData(formData: EasterEggFormData): ValidationResult {
  // 제목 검증
  if (!formData.title || formData.title.trim().length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.TITLE_REQUIRED };
  }
  
  if (formData.title.length > 100) {
    return { isValid: false, error: ERROR_MESSAGES.TITLE_TOO_LONG };
  }

  // 메시지 검증
  if (formData.message && formData.message.length > 500) {
    return { isValid: false, error: ERROR_MESSAGES.MESSAGE_TOO_LONG };
  }

  // 첨부파일 개수 검증
  if (formData.attachments && formData.attachments.length > 3) {
    return { isValid: false, error: ERROR_MESSAGES.TOO_MANY_FILES };
  }

  // 위치 정보 검증
  if (!formData.location || 
      formData.location.latitude === null || 
      formData.location.longitude === null) {
    return { isValid: false, error: ERROR_MESSAGES.MISSING_REQUIRED_FIELDS };
  }

  return { isValid: true };
}

/**
 * 폼 데이터를 API 요청 형식으로 변환
 */
function transformFormDataToApiRequest(formData: EasterEggFormData): CreateEasterEggRequest {
  // Attachment[] → File[] 변환
  const media_files: File[] = formData.attachments.map((attachment: Attachment) => attachment.file);

  return {
    latitude: formData.location!.latitude,
    longitude: formData.location!.longitude,
    title: formData.title.trim(),
    content: formData.message?.trim() || undefined,
    media_files: media_files.length > 0 ? media_files : undefined,
    view_limit: 3, // 무조건 3으로 설정
  };
}

/**
 * 위치 정보 수집
 */
function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error(ERROR_MESSAGES.LOCATION_UNAVAILABLE));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage: string = ERROR_MESSAGES.LOCATION_UNAVAILABLE;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = ERROR_MESSAGES.LOCATION_PERMISSION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = ERROR_MESSAGES.LOCATION_UNAVAILABLE;
            break;
          case error.TIMEOUT:
            errorMessage = ERROR_MESSAGES.LOCATION_TIMEOUT;
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * useEasterEggSubmit 반환 타입
 */
export interface UseEasterEggSubmitReturn {
  /** 제출 함수 */
  submit: (formData: EasterEggFormData) => Promise<void>;
  /** 제출 중 여부 */
  isSubmitting: boolean;
  /** 파일 업로드 진행률 (0-100) */
  progress: number;
  /** 에러 메시지 */
  error: string | null;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 이스터에그 제출 훅
 * 
 * @example
 * ```tsx
 * const { submit, isSubmitting, progress, error, clearError } = useEasterEggSubmit();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await submit(formData);
 *     // 성공 처리
 *   } catch (err) {
 *     // 에러는 자동으로 처리됨
 *   }
 * };
 * ```
 */
export function useEasterEggSubmit(): UseEasterEggSubmitReturn {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // React Query mutation
  const mutation = useMutation({
    mutationFn: async (request: CreateEasterEggRequest) => {
      return await createEasterEgg(request, (uploadProgress) => {
        setProgress(uploadProgress);
      });
    },
    onSuccess: () => {
      setProgress(100);
      setError(null);
      // 이스터에그 생성 성공 시 관련 쿼리 무효화 및 즉시 refetch → 지도 마커·내 이스터에그 목록 즉시 반영
      // React Query v5에서는 refetchQueries를 사용하여 활성 쿼리를 즉시 refetch
      queryClient.invalidateQueries({ 
        queryKey: SLOT_QUERY_KEYS.slotInfo(),
      });
      queryClient.invalidateQueries({ 
        queryKey: ['capsules'],
      });
      queryClient.invalidateQueries({ 
        queryKey: ['myEggs'],
      });
      // 활성 쿼리 즉시 refetch (staleTime 무시)
      queryClient.refetchQueries({ 
        queryKey: SLOT_QUERY_KEYS.slotInfo(),
      });
      queryClient.refetchQueries({ 
        queryKey: ['capsules'],
      });
      queryClient.refetchQueries({ 
        queryKey: ['myEggs'],
      });
    },
    onError: (err: unknown) => {
      // API 에러 처리
      const apiError = err as { status?: number; message?: string };
      
      if (apiError.status === 409) {
        setError(ERROR_MESSAGES.SLOT_INSUFFICIENT);
      } else if (apiError.status === 400) {
        setError(apiError.message || ERROR_MESSAGES.SERVER_ERROR);
      } else if (apiError.status === 401) {
        setError('인증이 필요합니다. 다시 로그인해주세요.');
      } else if (apiError.status === 500) {
        setError(ERROR_MESSAGES.SERVER_ERROR);
      } else if (apiError.message?.includes('network') || apiError.message?.includes('Network')) {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else if (apiError.message?.includes('timeout') || apiError.message?.includes('ECONNABORTED')) {
        setError('요청 시간이 초과되었습니다. 파일 크기가 크거나 네트워크가 느릴 수 있습니다. 다시 시도해주세요.');
      } else {
        setError(apiError.message || ERROR_MESSAGES.UNKNOWN_ERROR);
      }
      
      setProgress(0);
    },
  });

  /**
   * 제출 함수
   */
  const submit = useCallback(async (formData: EasterEggFormData) => {
    try {
      // 에러 초기화
      setError(null);
      setProgress(0);

      // 위치 정보가 없으면 수집
      let finalFormData = formData;
      if (!formData.location || 
          formData.location.latitude === null || 
          formData.location.longitude === null) {
        try {
          const location = await getCurrentLocation();
          finalFormData = {
            ...formData,
            location,
          };
        } catch (locationError) {
          setError((locationError as Error).message);
          throw locationError;
        }
      }

      // 폼 데이터 검증
      const validation = validateFormData(finalFormData);
      if (!validation.isValid) {
        setError(validation.error!);
        throw new Error(validation.error);
      }

      // 폼 데이터 변환
      const apiRequest = transformFormDataToApiRequest(finalFormData);

      // API 호출
      await mutation.mutateAsync(apiRequest);
    } catch (err) {
      // 에러는 이미 setError로 처리됨
      throw err;
    }
  }, [mutation]);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    submit,
    isSubmitting: mutation.isPending,
    progress,
    error,
    clearError,
  };
}
