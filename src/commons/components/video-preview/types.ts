/**
 * @fileoverview 영상 미리보기 컴포넌트 타입 정의
 * 
 * @module commons/components/video-preview/types
 */

/**
 * 영상 미리보기 Props
 */
export interface VideoPreviewProps {
  /** 비디오 파일 URL */
  videoUrl: string;
  /** 삭제 버튼 클릭 핸들러 */
  onDelete: () => void;
}
