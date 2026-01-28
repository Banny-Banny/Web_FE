/**
 * useAudioPlayer Hook
 * 오디오 플레이어 비즈니스 로직
 *
 * 미디어 ID 또는 URL을 받아서, URL이면 그대로 사용하고 ID면 URL로 변환한 후 오디오 재생 상태를 관리합니다.
 * HTML5 Audio API 사용 (웹 환경)
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { getMediaUrl } from '@/commons/apis';
import type { AudioPlayerProps } from '../types';

/**
 * 문자열이 URL인지 확인
 */
const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:');
};

export interface UseAudioPlayerReturn {
  // 상태
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  hasAudio: boolean;
  error: Error | null;

  // 핸들러
  handleTogglePlay: () => Promise<void>;
}

/**
 * 오디오 플레이어 비즈니스 로직 훅
 */
export const useAudioPlayer = ({
  mediaId,
  onPlayStateChange,
  onError,
}: AudioPlayerProps): UseAudioPlayerReturn => {
  // 오디오 URL 상태
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // HTML5 Audio 엘리먼트 참조
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 콜백을 ref에 저장하여 effect 재실행 방지 (8.2)
  const onPlayStateChangeRef = useRef(onPlayStateChange);
  const onErrorRef = useRef(onError);
  
  useEffect(() => {
    onPlayStateChangeRef.current = onPlayStateChange;
    onErrorRef.current = onError;
  }, [onPlayStateChange, onError]);

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
          console.error('[useAudioPlayer] 미디어 URL 변환 실패:', err);
        }
        setError(err);
        onErrorRef.current?.(err);
        setUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    convertMediaId();
  }, [mediaId]);

  // Audio 엘리먼트 생성 및 이벤트 리스너 설정
  useEffect(() => {
    if (!url) {
      // URL이 없으면 기존 Audio 엘리먼트 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    // 새로운 Audio 엘리먼트 생성
    const audio = new Audio(url);
    audioRef.current = audio;

    // 이벤트 리스너 설정
    const handleLoadedMetadata = () => {
      setDuration((prev) => {
        const newDuration = audio.duration || 0;
        return prev !== newDuration ? newDuration : prev;
      });
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime((prev) => {
        const newTime = audio.currentTime || 0;
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
      audio.currentTime = 0;
      onPlayStateChangeRef.current?.(false);
    };

    const handleError = (e: Event) => {
      const err = new Error('오디오 재생 중 오류가 발생했습니다.');
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudioPlayer] 오디오 재생 오류:', e);
      }
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

    // 이벤트 리스너 등록
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);

    // 초기 메타데이터 로드
    audio.load();

    // 정리 함수
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.pause();
      audio.src = '';
      audio.load();
    };
  }, [url]); // 콜백은 ref로 관리하므로 의존성에서 제거 (5.6)

  // 재생/일시정지 토글 (함수형 업데이트 사용 - 5.9)
  const handleTogglePlay = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      const audio = audioRef.current;
      // 현재 재생 상태를 직접 확인하여 함수형 업데이트 불필요
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('재생 토글 실패');
      if (process.env.NODE_ENV === 'development') {
        console.error('[useAudioPlayer] 재생 토글 실패:', err);
      }
      setError(err);
      onErrorRef.current?.(err);
    }
  }, []);

  // progress 계산
  const progress = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration],
  );

  // 오디오 존재 여부
  const hasAudio = Boolean(mediaId);

  return {
    isLoading,
    isPlaying,
    currentTime,
    duration,
    progress,
    hasAudio,
    error,
    handleTogglePlay,
  };
};
