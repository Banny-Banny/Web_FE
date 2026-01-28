/**
 * useVideoPlayer Hook
 * 비디오 플레이어 비즈니스 로직
 *
 * 미디어 ID 또는 URL을 받아서, URL이면 그대로 사용하고 ID면 URL로 변환한 후 비디오 재생 상태를 관리합니다.
 * HTML5 Video API 사용 (웹 환경)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMediaUrl } from '@/commons/apis';
import type { VideoPlayerProps } from '../types';

/**
 * 문자열이 URL인지 확인
 */
const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
};

export interface UseVideoPlayerReturn {
  // 상태
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  hasVideo: boolean;
  thumbnailUri: string | null;
  error: Error | null;

  // 핸들러
  handleTogglePlay: () => Promise<void>;
  handleSeek: (time: number) => void;
  handleToggleControls: () => void;

  // Video 엘리먼트 ref
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

/**
 * 비디오 플레이어 비즈니스 로직 훅
 */
export const useVideoPlayer = ({
  mediaId,
  thumbnailUrl,
  onPlayStateChange,
  onError,
}: VideoPlayerProps): UseVideoPlayerReturn => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(thumbnailUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // HTML5 Video 엘리먼트 참조
  const videoRef = useRef<HTMLVideoElement>(null);

  // mediaId가 URL인지 ID인지 판단하여 URL로 변환
  useEffect(() => {
    if (!mediaId) {
      setUrl(null);
      setError(null);
      return;
    }

    // 이미 URL이면 그대로 사용
    if (isUrl(mediaId)) {
      setUrl(mediaId);
      setError(null);
      return;
    }

    // ID인 경우 URL로 변환
    const convertMediaId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMediaUrl(mediaId);
        setUrl(response.url);
        setError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('미디어 URL 변환 실패');
        if (process.env.NODE_ENV === 'development') {
          console.error('[useVideoPlayer] 미디어 URL 변환 실패:', err);
        }
        setError(err);
        onError?.(err);
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    convertMediaId();
  }, [mediaId, onError]);

  // 썸네일 설정
  useEffect(() => {
    if (thumbnailUrl) {
      setThumbnailUri(thumbnailUrl);
      return;
    }

    // 썸네일 URL이 없으면 비디오 첫 프레임을 썸네일로 사용
    if (url && videoRef.current) {
      // 비디오가 로드되면 첫 프레임을 썸네일로 사용
      const video = videoRef.current;
      const handleLoadedData = () => {
        // 비디오의 첫 프레임을 canvas로 추출하여 썸네일 생성
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setThumbnailUri(thumbnailDataUrl);
          }
        } catch (error) {
          // 썸네일 생성 실패해도 비디오는 재생 가능
          if (process.env.NODE_ENV === 'development') {
            console.warn('[useVideoPlayer] 썸네일 생성 실패:', error);
          }
          setThumbnailUri(null);
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    } else {
      setThumbnailUri(null);
    }
  }, [url, thumbnailUrl]);

  // 콜백을 ref에 저장하여 effect 재실행 방지 (8.2)
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
    onErrorRef.current = onError;
  }, [onPlayStateChange, onError]);

  // Video 엘리먼트 이벤트 리스너 설정
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) {
      // URL이 없으면 기존 소스 정리
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
      return;
    }

    // 이벤트 리스너 설정
    const handleLoadedMetadata = () => {
      setDuration((prev) => {
        const newDuration = video.duration || 0;
        return prev !== newDuration ? newDuration : prev;
      });
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime((prev) => {
        const newTime = video.currentTime || 0;
        return prev !== newTime ? newTime : prev;
      });
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChangeRef.current?.(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChangeRef.current?.(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      video.currentTime = 0;
      onPlayStateChangeRef.current?.(false);
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      let errorMessage = '비디오 재생 중 오류가 발생했습니다.';
      
      // MediaError 정보 확인
      if (videoElement.error) {
        const mediaError = videoElement.error;
        switch (mediaError.code) {
          case mediaError.MEDIA_ERR_ABORTED:
            errorMessage = '비디오 로딩이 중단되었습니다.';
            break;
          case mediaError.MEDIA_ERR_NETWORK:
            errorMessage = '네트워크 오류로 비디오를 불러올 수 없습니다.';
            break;
          case mediaError.MEDIA_ERR_DECODE:
            errorMessage = '비디오 디코딩 오류가 발생했습니다.';
            break;
          case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            // S3 URL의 경우 CORS 문제일 수 있음
            if (url && (url.includes('s3.') || url.includes('amazonaws.com'))) {
              errorMessage = '비디오를 불러올 수 없습니다. CORS 설정을 확인해주세요.';
            } else {
              errorMessage = '지원하지 않는 비디오 형식입니다.';
            }
            break;
          default:
            errorMessage = `비디오 재생 오류 (코드: ${mediaError.code})`;
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.error('[useVideoPlayer] 비디오 재생 오류:', {
            code: mediaError.code,
            message: mediaError.message,
            videoSrc: videoElement.src,
            url: url,
            error: e,
          });
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useVideoPlayer] 비디오 재생 오류 (MediaError 없음):', {
            url: url,
            videoSrc: videoElement.src,
            error: e,
          });
        }
      }
      
      const err = new Error(errorMessage);
      setError(err);
      onErrorRef.current?.(err);
      setIsPlaying(false);
      onPlayStateChangeRef.current?.(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    // 이벤트 리스너 등록
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplaythrough', handleCanPlayThrough);

    // 비디오 소스 설정
    // 기존 소스 정리
    video.pause();
    video.src = '';
    video.load();
    
    // CORS 문제 해결을 위해 crossOrigin 설정 (src 설정 전에)
    video.crossOrigin = 'anonymous';
    
    // 새 소스 설정
    video.src = url;
    video.load();

    // 정리 함수
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.pause();
      video.src = '';
      video.load();
    };
  }, [url]); // 콜백은 ref로 관리하므로 의존성에서 제거 (5.6)

  // 재생/일시정지 토글 (함수형 업데이트 사용 - 5.9)
  const handleTogglePlay = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }

    try {
      const video = videoRef.current;
      // 현재 재생 상태를 직접 확인하여 함수형 업데이트 불필요
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('재생 토글 실패');
      if (process.env.NODE_ENV === 'development') {
        console.error('[useVideoPlayer] 재생 토글 실패:', err);
      }
      setError(err);
      onError?.(err);
    }
  }, [onError]);

  // 특정 시간으로 이동 (초 단위)
  const handleSeek = useCallback(
    (time: number) => {
      if (!videoRef.current) return;
      // time이 유효하지 않으면 무시
      if (!isFinite(time) || time < 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useVideoPlayer] 유효하지 않은 seek 시간:', time);
        }
        return;
      }
      try {
        const video = videoRef.current;
        if (isFinite(time) && time >= 0 && video) {
          video.currentTime = time;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('[useVideoPlayer] seek 실패:', errorMessage);
        }
      }
    },
    [],
  );

  // 컨트롤 표시/숨김 토글 (비디오 클릭 시 재생/일시정지)
  const handleToggleControls = useCallback(() => {
    handleTogglePlay();
  }, [handleTogglePlay]);

  // progress 계산
  const progress = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration],
  );

  // 비디오 존재 여부
  const hasVideo = Boolean(mediaId);

  return {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    progress,
    hasVideo,
    thumbnailUri,
    error,
    handleTogglePlay,
    handleSeek,
    handleToggleControls,
    videoRef,
  };
};
