/**
 * @fileoverview useContentForm 훅
 * @description 컨텐츠 작성 폼 상태 관리 훅
 * 
 * @description
 * - 실제 API 연결 (useMyContent, useSaveContent, useUpdateContent)
 * - 기존 컨텐츠 불러오기
 * - 폼 상태 관리
 * - 수정 모드/신규 모드 구분
 * - 자동 저장 기능 (3초 debounce)
 * - 변경 사항 감지 및 원본 데이터 추적
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useMyContent } from '@/commons/apis/capsules/step-rooms/hooks/useMyContent';
import { useSaveContent } from '@/commons/apis/capsules/step-rooms/hooks/useSaveContent';
import { useUpdateContent } from '@/commons/apis/capsules/step-rooms/hooks/useUpdateContent';
import type { ContentFormData } from '../types';
import type { SaveContentRequest, UpdateContentRequest } from '@/commons/apis/capsules/step-rooms/types';
import type { ApiError } from '@/commons/provider/api-provider/api-client';

/**
 * 원본 데이터 타입 (변경 감지용)
 */
interface OriginalFormData {
  text: string;
  existingImageUrls: string[];
  music: string | null;
  video: string | null;
}

/**
 * 배열 비교 함수 (순서 무시)
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

/**
 * 변경 사항 확인 함수
 */
function hasChanges(
  current: ContentFormData & { existingImageUrls: string[] },
  original: OriginalFormData | null
): boolean {
  if (!original) return true;

  // 텍스트 변경 확인
  if (current.text.trim() !== original.text.trim()) {
    return true;
  }

  // 이미지 변경 확인 (기존 URL + 새 파일)
  const currentAllImages = [...current.existingImageUrls, ...current.images.map(() => 'new')];
  const originalAllImages = original.existingImageUrls;
  if (!arraysEqual(currentAllImages, originalAllImages)) {
    return true;
  }

  // 음성 변경 확인 (URL vs File)
  if (current.music !== null && typeof current.music === 'object') {
    // 새 파일이 있으면 변경됨
    return true;
  }
  if (current.music === null && original.music !== null) {
    return true;
  }

  // 비디오 변경 확인 (URL vs File)
  if (current.video !== null && typeof current.video === 'object') {
    // 새 파일이 있으면 변경됨
    return true;
  }
  if (current.video === null && original.video !== null) {
    return true;
  }

  return false;
}

/**
 * 컨텐츠 작성 폼 상태 관리 훅
 * 
 * @param {string} capsuleId - 대기실 ID
 * @returns 컨텐츠 작성 폼 상태 및 핸들러
 */
export function useContentForm(capsuleId: string) {
  const [formData, setFormData] = useState<ContentFormData>({
    text: '',
    images: [],
    existingImageUrls: [],
    music: null,
    video: null,
  });

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [originalData, setOriginalData] = useState<OriginalFormData | null>(null);

  // 자동 저장 debounce 타이머 ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // API 훅들
  const {
    data: myContent,
    isLoading: isLoadingContent,
    error: contentError,
  } = useMyContent(capsuleId);

  const saveContentMutation = useSaveContent(capsuleId);
  const updateContentMutation = useUpdateContent(capsuleId);

  // 기존 컨텐츠 불러오기
  useEffect(() => {
    if (isLoadingContent) return;

    if (contentError) {
      // 404 에러는 컨텐츠가 없는 것으로 처리 (신규 작성 모드)
      const apiError = contentError as ApiError;
      if (apiError.status === 404) {
        // 상태 업데이트를 다음 렌더 사이클로 지연
        setTimeout(() => {
          setHasExistingContent(false);
          setIsEditMode(false);
          setOriginalData(null);
          setFormData({
            text: '',
            images: [],
            existingImageUrls: [],
            music: null,
            video: null,
          });
        }, 0);
      }
      return;
    }

    if (myContent) {
      // 기존 컨텐츠가 있는지 확인
      const hasContent = !!(
        myContent.text ||
        (myContent.images && myContent.images.length > 0) ||
        myContent.music ||
        myContent.video
      );

      // 상태 업데이트를 다음 렌더 사이클로 지연
      setTimeout(() => {
        setHasExistingContent(hasContent);
        setIsEditMode(hasContent);
      }, 0);

      // 기존 컨텐츠가 있으면 폼에 채우기
      if (hasContent) {
        const loadedData = {
          text: myContent.text || '',
          images: [], // 신규 업로드 파일만 관리
          existingImageUrls: myContent.images ?? [], // 기존 이미지 URL 유지용
          music: null, // 음악은 URL이므로 File 객체로 변환하지 않음
          video: null, // 영상도 URL이므로 File 객체로 변환하지 않음
        };
        
        // 상태 업데이트를 다음 렌더 사이클로 지연
        setTimeout(() => {
          setFormData(loadedData);
          // 원본 데이터 저장 (변경 감지용)
          setOriginalData({
            text: myContent.text || '',
            existingImageUrls: myContent.images ?? [],
            music: myContent.music || null,
            video: myContent.video || null,
          });
        }, 0);
      } else {
        // 신규 작성 모드
        // 상태 업데이트를 다음 렌더 사이클로 지연
        setTimeout(() => {
          setOriginalData(null);
          setFormData({
            text: '',
            images: [],
            existingImageUrls: [],
            music: null,
            video: null,
          });
        }, 0);
      }
    }
  }, [myContent, isLoadingContent, contentError]);

  // 자동 저장 함수 (실제 API 사용)
  const autoSave = useCallback(async () => {
    if (isLoadingContent || saveContentMutation.isPending || updateContentMutation.isPending) {
      return;
    }

    if (!isEditMode || !hasExistingContent) {
      return;
    }

    // 변경 사항이 없으면 저장하지 않음
    if (!hasChanges(formData, originalData)) {
      return;
    }

    setIsAutoSaving(true);

    try {
      const updateData: UpdateContentRequest = {
        text: formData.text || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        // 신규 이미지 업로드가 없으면 기존 이미지 URL 유지 (부분 수정 스펙)
        existingImageUrls:
          formData.images.length === 0 && formData.existingImageUrls.length > 0
            ? formData.existingImageUrls
            : undefined,
        music: formData.music instanceof File ? formData.music : undefined,
        video: formData.video instanceof File ? formData.video : undefined,
      };

      await updateContentMutation.mutateAsync(updateData);

      // 자동 저장 완료 후 원본 데이터 업데이트
      setOriginalData({
        text: formData.text,
        existingImageUrls: formData.existingImageUrls,
        music: formData.music instanceof File ? null : (formData.music || null),
        video: formData.video instanceof File ? null : (formData.video || null),
      });

      // 자동 저장 완료 후 상태 초기화
      setTimeout(() => {
        setIsAutoSaving(false);
      }, 500);
    } catch {
      // 자동 저장 실패는 조용히 처리 (사용자 작업 방해하지 않음)
      setIsAutoSaving(false);
    }
  }, [
    isEditMode,
    hasExistingContent,
    formData,
    originalData,
    isLoadingContent,
    saveContentMutation.isPending,
    updateContentMutation,
  ]);

  // 자동 저장 트리거 (debounce 3초)
  const triggerAutoSave = useCallback(() => {
    // 기존 타이머 취소
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // 3초 후 자동 저장 실행
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave();
    }, 3000);
  }, [autoSave]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // 텍스트 변경 핸들러 (자동 저장 트리거)
  const handleTextChange = (text: string) => {
    setFormData((prev) => ({ ...prev, text }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 이미지 변경 핸들러 (자동 저장 트리거)
  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({ ...prev, images }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 이미지 삭제 핸들러 (자동 저장 트리거)
  // index는 전체 이미지 배열 기준 (기존 URL + 새 파일)
  const handleImageRemove = (index: number) => {
    setFormData((prev) => {
      const existingCount = prev.existingImageUrls.length;
      
      if (index < existingCount) {
        // 기존 이미지 URL 삭제
        return {
          ...prev,
          existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index),
        };
      } else {
        // 새 이미지 파일 삭제
        const fileIndex = index - existingCount;
        return {
          ...prev,
          images: prev.images.filter((_, i) => i !== fileIndex),
        };
      }
    });
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 기존 이미지 URL 삭제 핸들러 (별도 핸들러)
  const handleExistingImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index),
    }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 음악 변경 핸들러 (자동 저장 트리거)
  const handleMusicChange = (music: File | null) => {
    setFormData((prev) => ({ ...prev, music }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 음악 삭제 핸들러 (자동 저장 트리거)
  const handleMusicRemove = () => {
    setFormData((prev) => ({ ...prev, music: null }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 영상 변경 핸들러 (자동 저장 트리거)
  const handleVideoChange = (video: File | null) => {
    setFormData((prev) => ({ ...prev, video }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 영상 삭제 핸들러 (자동 저장 트리거)
  const handleVideoRemove = () => {
    setFormData((prev) => ({ ...prev, video: null }));
    // 수정 모드일 때만 자동 저장 트리거
    if (isEditMode) {
      triggerAutoSave();
    }
  };

  // 컨텐츠 저장 핸들러 (실제 API 사용)
  const handleSave = async () => {
    // 자동 저장 타이머 취소
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    // 수정 모드에서 변경 사항이 없으면 저장하지 않음
    if (isEditMode && hasExistingContent && !hasChanges(formData, originalData)) {
      return true; // 변경 사항 없음 (성공으로 처리)
    }

    try {
      if (isEditMode && hasExistingContent) {
        // 수정 모드: useUpdateContent 사용
        const updateData: UpdateContentRequest = {
          text: formData.text || undefined,
          images: formData.images.length > 0 ? formData.images : undefined,
          existingImageUrls:
            formData.images.length === 0 && formData.existingImageUrls.length > 0
              ? formData.existingImageUrls
              : undefined,
          music: formData.music instanceof File ? formData.music : undefined,
          video: formData.video instanceof File ? formData.video : undefined,
        };

        await updateContentMutation.mutateAsync(updateData);

        // 저장 성공 시 원본 데이터 업데이트
        setOriginalData({
          text: formData.text,
          existingImageUrls: formData.existingImageUrls,
          music: formData.music instanceof File ? null : (formData.music || null),
          video: formData.video instanceof File ? null : (formData.video || null),
        });
      } else {
        // 신규 작성 모드: useSaveContent 사용
        const saveData: SaveContentRequest = {
          text: formData.text || undefined,
          images: formData.images.length > 0 ? formData.images : undefined,
          music: formData.music instanceof File ? formData.music : undefined,
          video: formData.video instanceof File ? formData.video : undefined,
        };

        await saveContentMutation.mutateAsync(saveData);

        // 저장 성공 시 수정 모드로 전환
        setIsEditMode(true);
        setHasExistingContent(true);
        
        // 원본 데이터 저장
        setOriginalData({
          text: formData.text,
          existingImageUrls: [],
          music: formData.music instanceof File ? null : (formData.music || null),
          video: formData.video instanceof File ? null : (formData.video || null),
        });
      }

      return true;
    } catch {
      // 에러는 mutation의 error 상태로 처리됨
      return false;
    }
  };

  // 에러 메시지 추출
  const getErrorMessage = (): string | null => {
    if (contentError) {
      // 404 에러는 컨텐츠가 없는 것으로 처리 (에러 아님)
      const apiError = contentError as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      return apiError.message || '컨텐츠를 불러오는 중 오류가 발생했습니다.';
    }

    if (saveContentMutation.error) {
      const saveError = saveContentMutation.error as ApiError;
      return saveError.message || '컨텐츠 저장 중 오류가 발생했습니다.';
    }

    if (updateContentMutation.error) {
      const updateError = updateContentMutation.error as ApiError;
      return updateError.message || '컨텐츠 수정 중 오류가 발생했습니다.';
    }

    return null;
  };

  return {
    formData,
    isLoading: isLoadingContent,
    error: getErrorMessage(),
    isSaving: saveContentMutation.isPending || updateContentMutation.isPending,
    isAutoSaving,
    isEditMode,
    handleTextChange,
    handleImagesChange,
    handleImageRemove,
    handleExistingImageRemove,
    handleMusicChange,
    handleMusicRemove,
    handleVideoChange,
    handleVideoRemove,
    handleSave,
  };
}
