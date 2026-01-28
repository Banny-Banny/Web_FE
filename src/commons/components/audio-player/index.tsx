/**
 * AudioPlayer Component
 * 오디오 플레이어 Container Component
 *
 * 비즈니스 로직은 hooks/useAudioPlayer에서 처리하고,
 * 이 컴포넌트는 UI 렌더링만 담당합니다.
 */

'use client';

import React from 'react';
import { RiPauseFill, RiPlayFill, RiErrorWarningLine } from '@remixicon/react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import styles from './styles.module.css';
import type { AudioPlayerProps } from './types';

// 시간 포맷팅 함수 (컴포넌트 외부로 호이스팅 - 6.3)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  // 비즈니스 로직은 hook에서 처리
  const {
    isLoading,
    isPlaying,
    currentTime,
    progress,
    hasAudio,
    error,
    handleTogglePlay,
  } = useAudioPlayer(props);

  // mediaId가 없거나 로딩 중이면 렌더링하지 않음
  if (!hasAudio) {
    return null;
  }

  // 에러 발생 시 에러 UI 표시
  if (error) {
    return (
      <div className={styles.audioErrorContainer}>
        <div className={styles.audioErrorIconContainer}>
          <RiErrorWarningLine size={20} className={styles.audioErrorIcon} />
        </div>
        <p className={styles.audioErrorText}>오디오 파일을 재생할 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className={styles.audioPlayerContainer}>
      <button
        className={styles.playButton}
        onClick={handleTogglePlay}
        disabled={isLoading}
        aria-label={isPlaying ? '일시정지' : '재생'}
        type="button">
        {isPlaying ? (
          <RiPauseFill size={20} className={styles.playButtonIcon} />
        ) : (
          <RiPlayFill size={20} className={styles.playButtonIcon} />
        )}
      </button>
      <div className={styles.audioControls}>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className={styles.audioTime}>{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};
