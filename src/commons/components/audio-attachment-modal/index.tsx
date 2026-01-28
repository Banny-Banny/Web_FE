'use client';

/**
 * @fileoverview 오디오 첨부 모달 컴포넌트
 * 
 * 웹 기반 오디오 첨부 모달입니다.
 * 직접 녹음 및 파일 업로드 기능을 제공합니다.
 * 
 * Figma 디자인 스펙:
 * - 직접 녹음 - 대기: node-id=599:5637
 * - 직접 녹음 - 녹음 중: node-id=599:6061
 * - 파일 업로드: node-id=599:6504
 * - 지원 형식: MPEG, AAC (Max 10MB)
 * 
 * @module commons/components/audio-attachment-modal
 */

import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiUploadLine, RiMicLine, RiStopCircleLine, RiPlayCircleLine, RiPauseCircleLine } from '@remixicon/react';
import { SIZE_LIMITS, validateFileMimeType, validateFileSize, getAcceptString } from '@/commons/constants/media';
import type { AudioAttachmentModalProps } from './types';
import styles from './styles.module.css';

type TabType = 'record' | 'upload';

/**
 * 오디오 첨부 모달 컴포넌트
 */
export function AudioAttachmentModal({
  visible,
  onClose,
  onSelectAudio,
}: AudioAttachmentModalProps) {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabType>('record');
  
  // 파일 업로드 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 녹음 상태
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  
  // 재생 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 모달이 닫힐 때 리셋
  useEffect(() => {
    if (!visible) {
      // 타이머로 setState 호출을 비동기로 처리
      const timer = setTimeout(() => {
        setActiveTab('record');
        setSelectedFile(null);
        setIsRecording(false);
        setRecordingTime(0);
        setRecordedBlob(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        
        // URL 정리
        if (recordedUrl) {
          URL.revokeObjectURL(recordedUrl);
          setRecordedUrl(null);
        }
        
        // 녹음 중이면 중지
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [visible, recordedUrl]);

  // 녹음 시작/중지
  const toggleRecording = async () => {
    if (isRecording) {
      // 녹음 중지
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setIsRecording(false);
    } else {
      // 녹음 시작
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/mpeg' });
          setRecordedBlob(blob);
          
          // 미리보기 URL 생성
          const url = URL.createObjectURL(blob);
          setRecordedUrl(url);
          
          // 스트림 정리
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        // 타이머 시작
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('녹음 권한 오류:', error);
        alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      }
    }
  };

  // 재생/일시정지 토글
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
      alert('지원하지 않는 오디오 형식입니다.\n허용 형식: MPEG, AAC');
      event.target.value = '';
      return;
    }

    // 파일 크기 검증 (10MB)
    if (!validateFileSize(file, 'AUDIO')) {
      alert(`파일 크기는 최대 ${SIZE_LIMITS.AUDIO / (1024 * 1024)}MB입니다.`);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    event.target.value = '';
  };

  // 녹음 완료 후 사용하기
  const handleUseRecording = () => {
    if (recordedBlob) {
      // Blob을 File로 변환
      const file = new File([recordedBlob], `recording-${Date.now()}.mp3`, { type: 'audio/mpeg' });
      onSelectAudio(file);
      onClose();
    }
  };

  // 파일 업로드 확인
  const handleUploadConfirm = () => {
    if (selectedFile) {
      onSelectAudio(selectedFile);
      onClose();
    }
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

        {/* 탭 버튼 */}
        <div className={styles.tabContainer} role="tablist" aria-label="음원 첨부 방법 선택">
          <button
            className={`${styles.tabButton} ${activeTab === 'record' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('record')}
            role="tab"
            aria-selected={activeTab === 'record'}
            aria-controls="record-panel"
          >
            직접 녹음
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'upload' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('upload')}
            role="tab"
            aria-selected={activeTab === 'upload'}
            aria-controls="upload-panel"
          >
            파일 업로드
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className={styles.content}>
          {activeTab === 'record' ? (
            /* 직접 녹음 탭 */
            <div 
              id="record-panel" 
              className={styles.recordPanel}
              role="tabpanel"
              aria-labelledby="record-tab"
            >
              {recordedBlob && !isRecording ? (
                /* 녹음 완료 후 재생 화면 */
                <>
                  {/* 타이머 */}
                  <div className={styles.timerDisplay}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* 재생 버튼 */}
                  <button
                    className={styles.playButton}
                    onClick={togglePlay}
                    aria-label={isPlaying ? '일시정지' : '재생'}
                    aria-pressed={isPlaying}
                  >
                    {isPlaying ? <RiPauseCircleLine size={80} /> : <RiPlayCircleLine size={80} />}
                  </button>

                  {/* 오디오 엘리먼트 */}
                  {recordedUrl && (
                    <audio
                      ref={audioRef}
                      src={recordedUrl}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}

                  {/* 액션 버튼 */}
                  <div className={styles.recordActions}>
                    <button
                      className={styles.resetButton}
                      onClick={() => {
                        setRecordedBlob(null);
                        if (recordedUrl) {
                          URL.revokeObjectURL(recordedUrl);
                          setRecordedUrl(null);
                        }
                        setRecordingTime(0);
                        setIsPlaying(false);
                        setCurrentTime(0);
                        setDuration(0);
                      }}
                      aria-label="다시 녹음하기"
                    >
                      다시 녹음
                    </button>
                    <button
                      className={styles.confirmButton}
                      onClick={handleUseRecording}
                      aria-label="녹음 사용하기"
                    >
                      사용하기
                    </button>
                  </div>
                </>
              ) : (
                /* 녹음 대기/진행 화면 */
                <>
                  {/* 타이머 */}
                  <div className={styles.timerDisplay}>
                    {formatTime(recordingTime)}
                  </div>

                  {/* 녹음 버튼 */}
                  <button
                    className={`${styles.recordButton} ${isRecording ? styles.recordButtonActive : ''}`}
                    onClick={toggleRecording}
                    aria-label={isRecording ? '녹음 중지' : '녹음 시작'}
                    aria-pressed={isRecording}
                  >
                    {isRecording ? <RiStopCircleLine size={32} /> : <RiMicLine size={32} />}
                  </button>

                  {/* 안내 문구 */}
                  <p className={styles.recordHint}>
                    {isRecording ? '녹음 중... 버튼을 눌러 중지' : '버튼을 눌러 녹음을 시작하세요'}
                  </p>
                </>
              )}
            </div>
          ) : (
            /* 파일 업로드 탭 */
            <div 
              id="upload-panel" 
              className={styles.uploadPanel}
              role="tabpanel"
              aria-labelledby="upload-tab"
            >
              {selectedFile ? (
                /* 파일 선택 완료 */
                <div className={styles.uploadComplete}>
                  <p className={styles.uploadFileName}>{selectedFile.name}</p>
                  <div className={styles.uploadActions}>
                    <button
                      className={styles.resetButton}
                      onClick={() => setSelectedFile(null)}
                      aria-label="다시 선택하기"
                    >
                      다시 선택
                    </button>
                    <button
                      className={styles.confirmButton}
                      onClick={handleUploadConfirm}
                      aria-label="선택한 파일 확인"
                    >
                      확인
                    </button>
                  </div>
                </div>
              ) : (
                /* 파일 선택 영역 */
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
                    <span className={styles.uploadButtonSubtitle}>MPEG, AAC (Max 10MB)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioAttachmentModal;
