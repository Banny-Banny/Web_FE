/**
 * VideoPlayer Component
 * 비디오 플레이어 Container Component
 *
 * 비즈니스 로직은 hooks/useVideoPlayer에서 처리하고,
 * 이 컴포넌트는 UI 렌더링만 담당합니다.
 */

'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { RiPlayFill, RiPauseFill, RiErrorWarningLine } from '@remixicon/react';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import styles from './styles.module.css';
import type { VideoPlayerProps } from './types';

// 시간 포맷팅 함수 (컴포넌트 외부로 호이스팅)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 진행바 컴포넌트 (드래그 가능)
interface ProgressBarProps {
  progress: number;
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration, currentTime, onSeek }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(progress);
  
  // 이벤트 핸들러를 ref에 저장하여 effect 재실행 방지 (8.2)
  const onSeekRef = useRef(onSeek);
  const durationRef = useRef(duration);
  
  // ref 업데이트
  useEffect(() => {
    onSeekRef.current = onSeek;
    durationRef.current = duration;
  }, [onSeek, duration]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // duration이 0이거나 유효하지 않으면 제스처 무시
      if (durationRef.current <= 0 || !isFinite(durationRef.current) || !containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const newProgress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setDragProgress(newProgress);
      setIsDragging(true);
    },
    [],
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    // duration이 0이거나 유효하지 않으면 제스처 무시
    if (durationRef.current <= 0 || !isFinite(durationRef.current)) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const newProgress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setDragProgress(newProgress);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging((prev) => {
      if (!prev) return prev;
      
      // duration이 0이거나 유효하지 않으면 제스처 무시
      if (durationRef.current <= 0 || !isFinite(durationRef.current)) {
        return false;
      }
      
      try {
        const seekTime = dragProgress * durationRef.current;
        // seekTime이 유효한지 확인
        if (isFinite(seekTime) && seekTime >= 0 && typeof onSeekRef.current === 'function') {
          onSeekRef.current(seekTime);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error('[ProgressBar] seek 실패:', errorMessage);
        }
      }
      return false;
    });
  }, [dragProgress]);

  // progress가 변경될 때 dragProgress도 업데이트 (드래그 중이 아닐 때만)
  useEffect(() => {
    if (!isDragging && isFinite(progress)) {
      const newProgress = Math.max(0, Math.min(1, progress));
      // 동기적 업데이트 대신 requestAnimationFrame 사용
      requestAnimationFrame(() => {
        setDragProgress((prev) => (prev !== newProgress ? newProgress : prev));
      });
    }
  }, [progress, isDragging]);

  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 렌더링 중에 계산 (5.1) - ref 접근 제거
  const currentProgress = isDragging ? dragProgress : progress;
  const width = `${Math.max(0, Math.min(100, currentProgress * 100))}%`;

  return (
    <div
      ref={containerRef}
      className={styles.progressBarContainer}
      onMouseDown={handleMouseDown}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const step = duration * 0.05; // 5% 단위로 이동
          const newTime = e.key === 'ArrowLeft' ? currentTime - step : currentTime + step;
          if (isFinite(newTime) && newTime >= 0) {
            onSeek(Math.max(0, Math.min(duration, newTime)));
          }
        }
      }}>
      <div className={styles.progressBar} style={{ width }} />
    </div>
  );
};

export const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const {
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
  } = useVideoPlayer(props);

  // mediaId가 없거나 로딩 중이면 렌더링하지 않음
  if (!hasVideo) {
    return null;
  }

  // 에러 발생 시 에러 UI 표시
  if (error) {
    return (
      <div className={styles.videoPlayerContainer} style={props.containerStyle}>
        <div className={styles.videoErrorContainer}>
          <div className={styles.videoErrorIconContainer}>
            <RiErrorWarningLine size={24} className={styles.videoErrorIcon} />
          </div>
          <p className={styles.videoErrorText}>비디오 파일을 재생할 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoPlayerContainer} style={props.containerStyle}>
      <div className={styles.videoWrapper}>
        <div className={styles.videoContainer} onClick={handleToggleControls}>
          <video
            ref={videoRef}
            className={styles.video}
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            aria-label="비디오 플레이어"
          />

          {/* 썸네일 오버레이 (재생 전에만 표시) */}
          {!isPlaying && thumbnailUri && (
            <div className={styles.thumbnailOverlay}>
              <Image
                src={thumbnailUri}
                alt="비디오 썸네일"
                fill
                className={styles.thumbnail}
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>
          )}

          {/* 플레이/일시정지 버튼 */}
          {!isPlaying && (
            <div className={styles.controlsOverlay}>
              <button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
                disabled={isLoading}
                aria-label="재생"
                type="button">
                <RiPlayFill size={28} className={styles.controlButtonIcon} />
              </button>
            </div>
          )}
          {isPlaying && (
            <div className={styles.controlsOverlay}>
              <button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
                disabled={isLoading}
                aria-label="일시정지"
                type="button">
                <RiPauseFill size={28} className={styles.controlButtonIcon} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 진행바 및 시간 표시 */}
      <div className={styles.videoControls}>
        <ProgressBar
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
        />
        <span className={styles.videoTime}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
