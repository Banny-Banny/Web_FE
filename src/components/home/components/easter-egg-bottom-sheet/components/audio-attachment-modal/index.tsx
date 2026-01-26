'use client';

/**
 * @fileoverview 오디오 첨부 모달 컴포넌트
 * 
 * 웹 기반 오디오 첨부 모달입니다.
 * 파일 업로드 기능을 제공합니다.
 * 
 * @module components/home/components/easter-egg-bottom-sheet/components/audio-attachment-modal
 */

import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiUploadLine, RiPlayCircleLine, RiPauseCircleLine } from '@remixicon/react';
import { SIZE_LIMITS, validateFileMimeType, validateFileSize, getAcceptString } from '@/commons/constants/media';
import type { AudioAttachmentModalProps } from '../../types';
import styles from './styles.module.css';

/**
 * 오디오 첨부 모달 컴포넌트
 */
export function AudioAttachmentModal({
  visible,
  onClose,
  onSelectAudio,
}: AudioAttachmentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 모달이 닫힐 때 리셋
  useEffect(() => {
    if (!visible) {
      // 타이머로 setState 호출을 비동기로 처리
      const timer = setTimeout(() => {
        setSelectedFile(null);
        setAudioUrl((prevUrl) => {
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return null;
        });
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // 오디오 재생/일시정지 토글
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // MIME 타입 검증
    if (!validateFileMimeType(file, 'AUDIO')) {
      alert('지원하지 않는 오디오 형식입니다.\n허용 형식: MP3, M4A, AAC, MPEG');
      event.target.value = '';
      return;
    }

    // 파일 크기 검증 (20MB)
    if (!validateFileSize(file, 'AUDIO')) {
      alert(`파일 크기는 최대 ${SIZE_LIMITS.AUDIO / (1024 * 1024)}MB입니다.`);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    event.target.value = '';
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (selectedFile) {
      onSelectAudio(selectedFile);
      onClose();
    }
  };

  // 다시 선택
  const handleReset = () => {
    setSelectedFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Escape 키로 닫기
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audio-modal-title"
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h3 id="audio-modal-title" className={styles.title}>음원 첨부</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.content}>
          {selectedFile ? (
            /* 미리보기 영역 */
            <div className={styles.previewContainer}>
              <p className={styles.previewTitle}>미리보기</p>
              <p className={styles.previewFileName} aria-label={`파일명: ${selectedFile.name}`}>
                {selectedFile.name}
              </p>

              {/* 재생 컨트롤 */}
              <div className={styles.playbackContainer} role="group" aria-label="오디오 재생 컨트롤">
                <button 
                  className={styles.playButton} 
                  onClick={togglePlay} 
                  aria-label={isPlaying ? '일시정지' : '재생'}
                  aria-pressed={isPlaying}
                >
                  {isPlaying ? <RiPauseCircleLine size={48} /> : <RiPlayCircleLine size={48} />}
                </button>
                <div className={styles.timeContainer}>
                  <span className={styles.timeText} aria-live="off">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* 오디오 엘리먼트 */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              {/* 액션 버튼 */}
              <div className={styles.actionButtons} role="group" aria-label="액션 버튼">
                <button 
                  className={styles.resetButton} 
                  onClick={handleReset}
                  aria-label="다시 선택하기"
                >
                  다시 선택
                </button>
                <button 
                  className={styles.confirmButton} 
                  onClick={handleConfirm}
                  aria-label="선택한 음원 확인"
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            /* 파일 업로드 영역 */
            <div className={styles.uploadContent}>
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptString('AUDIO')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                aria-label="오디오 파일 선택"
              />
              <button 
                className={styles.uploadButton} 
                onClick={() => fileInputRef.current?.click()}
                aria-label="오디오 파일 선택하기"
              >
                <RiUploadLine size={32} aria-hidden="true" />
                <span className={styles.uploadButtonTitle}>파일 선택하기</span>
                <span className={styles.uploadButtonSubtitle}>MP3, M4A, AAC, MPEG (Max 20MB)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioAttachmentModal;
