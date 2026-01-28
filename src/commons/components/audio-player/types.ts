/**
 * AudioPlayer Component Types
 */

export interface AudioPlayerProps {
  /** 오디오 미디어 ID 또는 URL (URL인 경우 그대로 사용, ID인 경우 URL로 변환) */
  mediaId: string | null;
  /** 재생 상태 변경 시 호출되는 콜백 */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** 에러 발생 시 호출되는 콜백 */
  onError?: (error: Error) => void;
}
