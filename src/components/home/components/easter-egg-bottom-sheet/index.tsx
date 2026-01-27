'use client';

/**
 * @fileoverview 이스터에그 바텀시트 컴포넌트
 * 
 * 이 컴포넌트는 홈 화면의 FAB 버튼에서 이스터에그를 선택했을 때 표시되는 바텀시트입니다.
 * 사용자가 이스터에그 작성 폼을 통해 이스터에그를 생성할 수 있도록 합니다.
 * 
 * @module components/home/components/easter-egg-bottom-sheet
 */

import React from 'react';
import BottomSheet from '@/commons/components/bottom-sheet';
import DualButton from '@/commons/components/dual-button';
import { RiImageLine, RiMicLine, RiVideoLine, RiCloseLine } from '@remixicon/react';
import { AudioAttachmentModal } from './components/audio-attachment-modal';
import { AudioPreview } from './components/audio-preview';
import { VideoPreview } from './components/video-preview';
import { SIZE_LIMITS, validateFileMimeType, validateFileSize, getAcceptString } from '@/commons/constants/media';
import { useEasterEggSubmit } from '../../hooks/useEasterEggSubmit';
import type { EasterEggBottomSheetProps, EasterEggFormData, Attachment, AttachmentType } from './types';
import styles from './styles.module.css';

/**
 * 이스터에그 바텀시트 컴포넌트
 * 
 * 사용자가 이스터에그 작성 폼을 작성할 수 있는 바텀시트입니다.
 * 
 * @param {EasterEggBottomSheetProps} props - 컴포넌트 props
 * @param {boolean} props.isOpen - 바텀시트 표시 여부
 * @param {() => void} props.onClose - 바텀시트 닫기 핸들러
 * @param {(formData: EasterEggFormData) => void} props.onConfirm - 작성 완료 버튼 클릭 핸들러
 * @param {string} [props.className] - 추가 CSS 클래스
 */
export function EasterEggBottomSheet({
  isOpen,
  onClose,
  onConfirm,
  className = '',
}: EasterEggBottomSheetProps) {
  // 폼 상태
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [isAudioModalVisible, setIsAudioModalVisible] = React.useState(false);

  // 파일 input refs
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  // 이스터에그 제출 훅
  const { submit, isSubmitting, progress, error, clearError } = useEasterEggSubmit();

  /**
   * 작성 완료 버튼 클릭 핸들러
   */
  const handleConfirm = React.useCallback(async () => {
    if (!title.trim()) {
      return;
    }

    const formData: EasterEggFormData = {
      title: title.trim(),
      message: message.trim(),
      attachments,
    };

    try {
      // 이스터에그 제출
      await submit(formData);
      
      // 제출 성공 시
      onConfirm(formData);
      
      // 모든 미리보기 URL 정리 (메모리 누수 방지)
      attachments.forEach(att => {
        if (att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
      
      onClose();
      
      // 바텀시트가 닫힌 후 폼 초기화
      setTimeout(() => {
        setTitle('');
        setMessage('');
        setAttachments([]);
        clearError();
      }, 300);
    } catch {
      // 에러는 useEasterEggSubmit에서 관리
      // UI에 에러 메시지가 표시됨
    }
  }, [title, message, attachments, submit, onConfirm, onClose, clearError]);

  /**
   * 취소 버튼 클릭 핸들러
   */
  const handleCancel = React.useCallback(() => {
    onClose();
    // 바텀시트가 닫힌 후 폼 초기화
    setTimeout(() => {
      setTitle('');
      setMessage('');
      setAttachments([]);
    }, 300);
  }, [onClose]);

  /**
   * 첨부파일 추가 핸들러
   */
  const handleAddAttachment = React.useCallback((type: AttachmentType, file: File) => {
    const newAttachment: Attachment = {
      id: `${type}-${Date.now()}`,
      type,
      file,
      name: file.name,
    };

    // 이미지, 비디오, 오디오의 경우 미리보기 URL 생성
    if (type === 'IMAGE' || type === 'VIDEO' || type === 'AUDIO') {
      newAttachment.previewUrl = URL.createObjectURL(file);
    }

    // 같은 타입의 기존 첨부파일 제거 (각 타입당 1개만)
    setAttachments(prev => {
      const filtered = prev.filter(att => att.type !== type);
      // 기존 미리보기 URL 정리
      prev.forEach(att => {
        if (att.type === type && att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
      return [...filtered, newAttachment];
    });
  }, []);

  /**
   * 첨부파일 삭제 핸들러
   */
  const handleDeleteAttachment = React.useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === id);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return prev.filter(att => att.id !== id);
    });
  }, []);

  /**
   * 이미지 파일 선택 핸들러
   */
  const handleImageSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME 타입 검증
    if (!validateFileMimeType(file, 'IMAGE')) {
      alert('지원하지 않는 이미지 형식입니다.\n허용 형식: JPEG, JPG, PNG, WEBP');
      e.target.value = '';
      return;
    }

    // 파일 크기 검증 (5MB)
    if (!validateFileSize(file, 'IMAGE')) {
      alert(`이미지 파일 크기는 최대 ${SIZE_LIMITS.IMAGE / (1024 * 1024)}MB입니다.`);
      e.target.value = '';
      return;
    }

    handleAddAttachment('IMAGE', file);
    // input 초기화
    e.target.value = '';
  }, [handleAddAttachment]);

  /**
   * 비디오 파일 선택 핸들러
   */
  const handleVideoSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME 타입 검증
    if (!validateFileMimeType(file, 'VIDEO')) {
      alert('지원하지 않는 동영상 형식입니다.\n허용 형식: MP4, WEBM');
      e.target.value = '';
      return;
    }

    // 파일 크기 검증 (200MB)
    if (!validateFileSize(file, 'VIDEO')) {
      alert(`동영상 파일 크기는 최대 ${SIZE_LIMITS.VIDEO / (1024 * 1024)}MB입니다.`);
      e.target.value = '';
      return;
    }

    handleAddAttachment('VIDEO', file);
    // input 초기화
    e.target.value = '';
  }, [handleAddAttachment]);

  /**
   * 오디오 파일 선택 핸들러 (모달에서)
   */
  const handleAudioSelect = React.useCallback((file: File) => {
    handleAddAttachment('AUDIO', file);
    setIsAudioModalVisible(false);
  }, [handleAddAttachment]);

  /**
   * 바텀시트가 닫힐 때 폼 초기화 및 미리보기 URL 정리
   */
  React.useEffect(() => {
    if (!isOpen) {
      // 모든 미리보기 URL 정리 (메모리 누수 방지)
      attachments.forEach(att => {
        if (att.previewUrl) {
          URL.revokeObjectURL(att.previewUrl);
        }
      });
      
      setTitle('');
      setMessage('');
      setAttachments([]);
    }
  }, [isOpen, attachments]);

  // 작성 완료 버튼 활성화 여부 (제목 필수)
  const isFormValid = title.trim().length > 0;

  // 바텀시트가 열릴 때 첫 번째 입력 필드로 포커스 이동
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // 약간의 지연을 두어 애니메이션 완료 후 포커스
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropPress={true}
      maxHeight="70vh"
      footer={
        <DualButton
          cancelLabel="취소"
          confirmLabel={isSubmitting ? '제출 중...' : '작성 완료'}
          confirmDisabled={!isFormValid || isSubmitting}
          onCancelPress={handleCancel}
          onConfirmPress={handleConfirm}
          fullWidth={true}
        />
      }
    >
      <div className={`${styles.container} ${className}`}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 id="easter-egg-sheet-title" className={styles.title}>이스터에그 작성</h2>
          <p id="easter-egg-sheet-description" className={styles.subtitle}>현재 위치에 추억을 숨겨요</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorMessage} role="alert" aria-live="assertive">
            <span>⚠️ {error}</span>
            <button
              onClick={clearError}
              className={styles.errorCloseBtn}
              type="button"
              aria-label="에러 메시지 닫기"
            >
              <RiCloseLine size={16} />
            </button>
          </div>
        )}

        {/* 파일 업로드 진행률 */}
        {isSubmitting && progress > 0 && progress < 100 && (
          <div className={styles.progressBar} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <span className={styles.progressText}>{progress}% 업로드 중...</span>
          </div>
        )}

        {/* 폼 컨텐츠 */}
        <div className={styles.formContent}>
          {/* 제목 입력 */}
          <div className={styles.fieldGroup}>
            <label htmlFor="easter-egg-title" className={styles.label}>제목</label>
            <input
              ref={titleInputRef}
              id="easter-egg-title"
              type="text"
              className={styles.input}
              placeholder="추억의 제목을 입력하세요"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 30) {
                  setTitle(e.target.value);
                }
              }}
              maxLength={30}
              disabled={isSubmitting}
              aria-required="true"
              aria-label="이스터에그 제목"
              aria-describedby="title-char-count"
            />
            <div id="title-char-count" className={styles.charCount} aria-live="polite">
              {title.length}/30
            </div>
          </div>

          {/* 메시지 입력 */}
          <div className={styles.fieldGroup}>
            <label htmlFor="easter-egg-message" className={styles.label}>메시지</label>
            <textarea
              id="easter-egg-message"
              className={styles.textarea}
              placeholder="미래의 나에게 또는 친구에게 남길 메시지를 작성하세요..."
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setMessage(e.target.value);
                }
              }}
              maxLength={500}
              rows={6}
              disabled={isSubmitting}
              aria-label="이스터에그 메시지"
              aria-describedby="message-char-count"
            />
            <div id="message-char-count" className={styles.charCount} aria-live="polite">
              {message.length}/500
            </div>
          </div>

          {/* 첨부파일 */}
          <div className={styles.fieldGroup}>
            <label id="attachments-label" className={styles.attachmentLabel}>첨부파일</label>
            <div className={styles.attachmentButtons} role="group" aria-labelledby="attachments-label">
              {/* 버튼 그리드 */}
              <div className={styles.attachmentButtonsGrid}>
                {/* 사진 버튼 */}
                <button 
                  className={`${styles.attachmentBtn} ${attachments.find(a => a.type === 'IMAGE') ? styles.attachmentBtnActive : ''}`}
                  onClick={() => imageInputRef.current?.click()}
                  type="button"
                  disabled={isSubmitting}
                  aria-label={attachments.find(a => a.type === 'IMAGE') ? '사진 첨부됨, 클릭하여 변경' : '사진 첨부하기'}
                >
                  <div className={styles.attachmentIconWrapper}>
                    <RiImageLine size={20} />
                  </div>
                  <span>사진</span>
                  {attachments.find(a => a.type === 'IMAGE') && (
                    <div className={styles.checkmark}>
                      <span>✓</span>
                    </div>
                  )}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={getAcceptString('IMAGE')}
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />

                {/* 음원 버튼 */}
                <button 
                  className={`${styles.attachmentBtn} ${attachments.find(a => a.type === 'AUDIO') ? styles.attachmentBtnActive : ''}`}
                  onClick={() => setIsAudioModalVisible(true)}
                  type="button"
                  disabled={isSubmitting}
                  aria-label={attachments.find(a => a.type === 'AUDIO') ? '음원 첨부됨, 클릭하여 변경' : '음원 첨부하기'}
                >
                  <div className={styles.attachmentIconWrapper}>
                    <RiMicLine size={20} />
                  </div>
                  <span>음성</span>
                  {attachments.find(a => a.type === 'AUDIO') && (
                    <div className={styles.checkmark}>
                      <span>✓</span>
                    </div>
                  )}
                </button>

                {/* 동영상 버튼 */}
                <button 
                  className={`${styles.attachmentBtn} ${attachments.find(a => a.type === 'VIDEO') ? styles.attachmentBtnActive : ''}`}
                  onClick={() => videoInputRef.current?.click()}
                  type="button"
                  disabled={isSubmitting}
                  aria-label={attachments.find(a => a.type === 'VIDEO') ? '동영상 첨부됨, 클릭하여 변경' : '동영상 첨부하기'}
                >
                  <div className={styles.attachmentIconWrapper}>
                    <RiVideoLine size={20} />
                  </div>
                  <span>동영상</span>
                  {attachments.find(a => a.type === 'VIDEO') && (
                    <div className={styles.checkmark}>
                      <span>✓</span>
                    </div>
                  )}
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept={getAcceptString('VIDEO')}
                  onChange={handleVideoSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* 이미지 미리보기 (큰 이미지) */}
              {attachments.find(a => a.type === 'IMAGE') && (
                <div className={styles.imagePreviewLarge}>
                  <img 
                    src={attachments.find(a => a.type === 'IMAGE')?.previewUrl} 
                    alt="사진 미리보기"
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.previewDeleteBtn}
                    onClick={() => {
                      const img = attachments.find(a => a.type === 'IMAGE');
                      if (img) handleDeleteAttachment(img.id);
                    }}
                    type="button"
                    aria-label="사진 삭제"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </div>
              )}

              {/* 음원 미리보기 */}
              {attachments.find(a => a.type === 'AUDIO') && (
                <AudioPreview
                  audioUrl={attachments.find(a => a.type === 'AUDIO')!.previewUrl!}
                  onDelete={() => {
                    const audio = attachments.find(a => a.type === 'AUDIO');
                    if (audio) handleDeleteAttachment(audio.id);
                  }}
                />
              )}

              {/* 비디오 미리보기 */}
              {attachments.find(a => a.type === 'VIDEO') && (
                <VideoPreview
                  videoUrl={attachments.find(a => a.type === 'VIDEO')!.previewUrl!}
                  onDelete={() => {
                    const video = attachments.find(a => a.type === 'VIDEO');
                    if (video) handleDeleteAttachment(video.id);
                  }}
                />
              )}
            </div>
          </div>

          {/* 안내 정보 */}
          <div className={styles.infoBox} role="note" aria-label="이스터에그 작성 안내">
            <div className={styles.infoItem}>
              <span className={styles.infoEmoji} aria-hidden="true">💡</span>
              <span className={styles.infoText}>현재 위치에 추억이 저장됩니다</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoEmoji} aria-hidden="true">💡</span>
              <span className={styles.infoText}>3명이 발견하면 이스터에그가 소멸됩니다</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오디오 첨부 모달 */}
      <AudioAttachmentModal
        visible={isAudioModalVisible}
        onClose={() => setIsAudioModalVisible(false)}
        onSelectAudio={handleAudioSelect}
      />
    </BottomSheet>
  );
}

export default EasterEggBottomSheet;
