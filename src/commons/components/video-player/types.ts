/**
 * VideoPlayer Component Types
 */

export interface VideoPlayerProps {
  /** 비디오 미디어 ID 또는 URL (URL인 경우 그대로 사용, ID인 경우 URL로 변환) */
  mediaId: string | null;
  /** 썸네일 URL (선택사항, 없으면 비디오 첫 프레임 사용) */
  thumbnailUrl?: string | null;
  /** 재생 상태 변경 시 호출되는 콜백 */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** 에러 발생 시 호출되는 콜백 */
  onError?: (error: Error) => void;
  /** 비디오 컨테이너 스타일 커스터마이징 */
  containerStyle?: React.CSSProperties;
}
