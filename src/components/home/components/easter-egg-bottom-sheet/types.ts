/**
 * @fileoverview 이스터에그 바텀시트 타입 정의
 * 
 * 이 파일은 이스터에그 바텀시트 폼 기능에 필요한 모든 타입을 정의합니다.
 * 
 * @module components/home/components/easter-egg-bottom-sheet/types
 */

/**
 * 첨부파일 타입
 */
export type AttachmentType = 'IMAGE' | 'AUDIO' | 'VIDEO';

/**
 * 첨부파일 데이터
 */
export interface Attachment {
  /** 고유 ID */
  id: string;
  /** 파일 타입 */
  type: AttachmentType;
  /** 파일 객체 */
  file: File;
  /** 미리보기 URL (이미지/비디오) */
  previewUrl?: string;
  /** 파일 이름 */
  name: string;
}

/**
 * 이스터에그 폼 데이터 타입
 * 
 * 이스터에그 작성 폼의 데이터를 나타냅니다.
 */
export interface EasterEggFormData {
  /** 이스터에그 제목 (필수, 최대 30자) */
  title: string;
  
  /** 메시지 내용 (선택, 최대 500자) */
  message: string;
  
  /** 첨부 파일 목록 (선택) */
  attachments: Attachment[];
  
  /** 
   * 현재 위치 정보 (자동 수집)
   * 위도, 경도 등
   */
  location?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * 바텀시트 상태 타입
 * 
 * 바텀시트의 현재 상태를 나타냅니다.
 */
export interface EasterEggSheetState {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  
  /** 선택된 옵션 ID */
  selectedOption: string | null;
  
  /** 
   * 현재 바텀시트 높이 (px)
   * 드래그 인터랙션에 사용
   */
  height: number;
  
  /** 드래그 중인지 여부 */
  isDragging: boolean;
}

/**
 * 이스터에그 바텀시트 컴포넌트 Props
 */
export interface EasterEggBottomSheetProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  
  /** 바텀시트 닫기 핸들러 */
  onClose: () => void;
  
  /** 
   * 작성 완료 버튼 클릭 핸들러
   * @param formData - 작성된 폼 데이터
   */
  onConfirm: (formData: EasterEggFormData) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 제목 입력 필드 Props
 */
export interface TitleInputProps {
  /** 현재 값 */
  value: string;
  
  /** 변경 핸들러 */
  onChange: (value: string) => void;
  
  /** 최대 글자 수 */
  maxLength?: number;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 메시지 입력 영역 Props
 */
export interface MessageInputProps {
  /** 현재 값 */
  value: string;
  
  /** 변경 핸들러 */
  onChange: (value: string) => void;
  
  /** 최대 글자 수 */
  maxLength?: number;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 첨부파일 버튼 Props
 */
export interface AttachmentButtonsProps {
  /** 파일 선택 핸들러 */
  onFileSelect: (files: File[]) => void;
  
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 오디오 첨부 모달 Props
 */
export interface AudioAttachmentModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 오디오 파일 선택 완료 콜백 */
  onSelectAudio: (file: File) => void;
}

/**
 * 제출 상태 타입
 * 
 * 이스터에그 폼 제출 시의 상태를 나타냅니다.
 */
export interface SubmitState {
  /** 제출 중 여부 */
  isSubmitting: boolean;
  /** 파일 업로드 진행률 (0-100) */
  progress: number;
  /** 에러 메시지 (없으면 null) */
  error: string | null;
}
