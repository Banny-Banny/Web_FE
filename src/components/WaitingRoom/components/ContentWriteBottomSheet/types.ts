/**
 * @fileoverview 컨텐츠 작성 바텀시트 컴포넌트 타입 정의
 * @description 컨텐츠 작성 바텀시트 및 관련 컴포넌트의 타입 정의
 */

import type { WaitingRoomSettingsResponse } from '@/commons/apis/capsules/step-rooms/types';

/**
 * 컨텐츠 작성 폼 데이터 타입
 */
export interface ContentFormData {
  /** 텍스트 내용 */
  text: string;
  /** 이미지 파일 배열 */
  images: File[];
  /** 유지할 기존 이미지 URL 배열 (PATCH existing_image_urls 용) */
  existingImageUrls: string[];
  /** 음악 파일 (File: 새로 업로드, string: 기존 URL) */
  music?: File | string | null;
  /** 영상 파일 (File: 새로 업로드, string: 기존 URL) */
  video?: File | string | null;
}

/**
 * 컨텐츠 작성 바텀시트 Props
 */
export interface ContentWriteBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  /** 컨텐츠 저장 성공 시 호출되는 콜백 (상위에서 작성 완료 상태 즉시 반영용) */
  onSaved?: () => void;
  /** 대기실 ID */
  capsuleId: string;
  /** 대기실 설정 */
  settings?: WaitingRoomSettingsResponse;
}

/**
 * 미디어 제한사항 표시 컴포넌트 Props
 */
export interface MediaLimitsProps {
  /** 대기실 설정 */
  settings?: WaitingRoomSettingsResponse;
  /** 현재 업로드된 이미지 개수 */
  currentImageCount: number;
}

/**
 * 텍스트 입력 컴포넌트 Props
 */
export interface TextInputProps {
  /** 텍스트 값 */
  value: string;
  /** 텍스트 변경 핸들러 */
  onChange: (value: string) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 최대 길이 */
  maxLength?: number;
}

/**
 * 이미지 업로드 컴포넌트 Props
 */
export interface ImageUploadProps {
  /** 이미지 파일 배열 (새로 선택한 파일) */
  images: File[];
  /** 기존 이미지 URL 배열 (서버에서 불러온 이미지) */
  existingImageUrls?: string[];
  /** 최대 이미지 개수 */
  maxCount: number;
  /** 이미지 변경 핸들러 */
  onChange: (images: File[]) => void;
  /** 이미지 삭제 핸들러 (index는 전체 이미지 배열 기준) */
  onRemove: (index: number) => void;
  /** 기존 이미지 URL 삭제 핸들러 */
  onRemoveExisting?: (index: number) => void;
}

/**
 * 음악 업로드 컴포넌트 Props
 */
export interface MusicUploadProps {
  /** 음악 파일 */
  music?: File | null;
  /** 음악 변경 핸들러 */
  onChange: (music: File | null) => void;
  /** 음악 삭제 핸들러 */
  onRemove: () => void;
}

/**
 * 영상 업로드 컴포넌트 Props
 */
export interface VideoUploadProps {
  /** 영상 파일 */
  video?: File | null;
  /** 영상 변경 핸들러 */
  onChange: (video: File | null) => void;
  /** 영상 삭제 핸들러 */
  onRemove: () => void;
}
