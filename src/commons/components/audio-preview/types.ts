/**
 * @fileoverview 음원 미리보기 컴포넌트 타입 정의
 * 
 * @module commons/components/audio-preview/types
 */

/**
 * 음원 미리보기 Props
 */
export interface AudioPreviewProps {
  /** 오디오 파일 URL */
  audioUrl: string;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete: () => void;
}
