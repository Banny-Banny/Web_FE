/**
 * @fileoverview 오디오 첨부 모달 타입 정의
 * 
 * @module commons/components/audio-attachment-modal/types
 */

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
