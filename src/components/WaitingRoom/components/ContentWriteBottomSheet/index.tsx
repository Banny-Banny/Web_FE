'use client';

/**
 * @fileoverview ContentWriteBottomSheet 컴포넌트
 * @description 컨텐츠 작성 바텀시트 컨테이너 컴포넌트
 * 
 * @description
 * - BottomSheet 컴포넌트 사용
 * - MediaLimits, TextInput, ImageUpload, MusicUpload, VideoUpload 컴포넌트 렌더링
 * - 저장 버튼
 * - 로딩 상태 표시
 * - 에러 메시지 표시
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React, { useState, useRef } from 'react';
import { BottomSheet } from '@/commons/components/bottom-sheet';
import { DualButton } from '@/commons/components/dual-button';
import { Spinner } from '@/commons/components/spinner';
import { AudioAttachmentModal } from '@/commons/components/audio-attachment-modal';
import { AudioPreview } from '@/commons/components/audio-preview';
import { VideoPreview } from '@/commons/components/video-preview';
import { validateFileSize, isVideoFile } from '@/commons/utils/content';
import { MediaLimits } from './components/MediaLimits';
import { TextInput } from './components/TextInput';
import { ImageUpload } from './components/ImageUpload';
import { useContentForm } from './hooks/useContentForm';
import styles from './styles.module.css';
import type { ContentWriteBottomSheetProps } from './types';

/**
 * ContentWriteBottomSheet 컴포넌트
 * 
 * 컨텐츠 작성 바텀시트를 제공합니다.
 * 
 * @param {ContentWriteBottomSheetProps} props - ContentWriteBottomSheet 컴포넌트의 props
 */
export function ContentWriteBottomSheet({
  isOpen,
  onClose,
  onSaved,
  capsuleId,
  settings,
}: ContentWriteBottomSheetProps) {
  const {
    formData,
    isLoading,
    error,
    isSaving,
    isAutoSaving,
    isEditMode,
    handleTextChange,
    handleImagesChange,
    handleImageRemove,
    handleExistingImageRemove,
    handleMusicChange,
    handleMusicRemove,
    handleVideoChange,
    handleVideoRemove,
    handleSave,
  } = useContentForm(capsuleId);

  const handleSaveClick = async () => {
    const success = await handleSave();
    if (success) {
      // 상위에서 내 컨텐츠 작성 완료 상태를 즉시 반영할 수 있도록 콜백 호출
      if (onSaved) {
        onSaved();
      }
      onClose();
    }
  };

  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [musicObjectUrl, setMusicObjectUrl] = useState<string | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);

  // 음성 파일 URL 관리
  React.useEffect(() => {
    if (formData.music) {
      if (typeof formData.music === 'string') {
        // 기존 URL인 경우 그대로 사용
        setMusicObjectUrl(formData.music);
      } else {
        // File 객체인 경우 URL 생성
        const url = URL.createObjectURL(formData.music);
        setMusicObjectUrl(url);
        return () => {
          URL.revokeObjectURL(url);
          setMusicObjectUrl(null);
        };
      }
    } else {
      setMusicObjectUrl(null);
    }
  }, [formData.music]);

  // 비디오 파일 URL 관리
  React.useEffect(() => {
    if (formData.video) {
      if (typeof formData.video === 'string') {
        // 기존 URL인 경우 그대로 사용
        setVideoObjectUrl(formData.video);
      } else {
        // File 객체인 경우 URL 생성
        const url = URL.createObjectURL(formData.video);
        setVideoObjectUrl(url);
        return () => {
          URL.revokeObjectURL(url);
          setVideoObjectUrl(null);
        };
      }
    } else {
      setVideoObjectUrl(null);
    }
  }, [formData.video]);

  const handleCancelClick = () => {
    onClose();
  };

  const handleAudioSelect = (file: File) => {
    handleMusicChange(file);
    setIsAudioModalVisible(false);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 파일 형식 검증
    if (!isVideoFile(file)) {
      alert('영상 파일만 업로드할 수 있습니다. (mp4, mov 등)');
      return;
    }

    // 파일 크기 검증 (100MB 제한)
    if (!validateFileSize(file, 100 * 1024 * 1024)) {
      alert('파일 크기는 100MB 이하여야 합니다.');
      return;
    }

    handleVideoChange(file);

    // 파일 입력 초기화
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const renderFooter = () => (
    <>
      <DualButton
        cancelLabel="취소"
        confirmLabel={isSaving ? (isEditMode ? '수정 중...' : '저장 중...') : (isEditMode ? '수정' : '저장')}
        size="M"
        confirmDisabled={isSaving || formData.text.trim().length === 0}
        onCancelPress={handleCancelClick}
        onConfirmPress={handleSaveClick}
      />
      <p className={styles.hintText}>
        {isEditMode ? '수정된 내용을 저장합니다' : '저장 후에도 수정할 수 있어요'}
      </p>
    </>
  );

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        showHandle={true}
        draggable={false}
        maxHeight="100vh"
        footer={!isLoading ? renderFooter() : undefined}
      >
      <div className={styles.container}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <Spinner size="large" />
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        )}

        {!isLoading && (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>MY CONTENTS</h2>
              <p className={styles.description}>
                {isEditMode
                  ? '콘텐츠를 수정할 수 있어요'
                  : '나만의 타임캡슐 내용을 작성해요'}
              </p>
              {isAutoSaving && (
                <p className={styles.autoSaveIndicator}>자동 저장 중...</p>
              )}
              {!settings && (
                <p className={styles.autoSaveIndicator}>
                  설정을 불러오는 중이에요. 잠시만 기다려주세요...
                </p>
              )}
            </div>

            <div className={styles.content}>
              <MediaLimits
                settings={settings}
                currentImageCount={formData.existingImageUrls.length + formData.images.length}
              />

              <TextInput
                value={formData.text}
                onChange={handleTextChange}
                placeholder="당신의 이야기를 남겨주세요..."
              />

              {settings && (settings.maxImagesPerPerson ?? 0) > 0 && (
                <ImageUpload
                  images={formData.images}
                  existingImageUrls={formData.existingImageUrls}
                  maxCount={settings.maxImagesPerPerson ?? 0}
                  onChange={handleImagesChange}
                  onRemove={handleImageRemove}
                  onRemoveExisting={handleExistingImageRemove}
                />
              )}

              {settings?.hasMusic && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <svg
                      className={styles.sectionIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18V5L21 3V16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className={styles.sectionTitle}>
                      음성 ({formData.music ? 1 : 0}/1)
                    </span>
                  </div>

                  {formData.music && musicObjectUrl ? (
                    <AudioPreview
                      audioUrl={musicObjectUrl}
                      onDelete={handleMusicRemove}
                    />
                  ) : (
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => setIsAudioModalVisible(true)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={styles.addText}>음성 추가</span>
                    </button>
                  )}
                </div>
              )}

              {settings?.hasVideo && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <svg
                      className={styles.sectionIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className={styles.sectionTitle}>
                      동영상 ({formData.video ? 1 : 0}/1)
                    </span>
                  </div>

                  {formData.video && videoObjectUrl ? (
                    <VideoPreview
                      videoUrl={videoObjectUrl}
                      onDelete={handleVideoRemove}
                    />
                  ) : (
                    <>
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={styles.addText}>동영상 추가</span>
                      </button>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        style={{ display: 'none' }}
                        aria-label="영상 파일 선택"
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      </BottomSheet>

      <AudioAttachmentModal
        visible={isAudioModalVisible}
        onClose={() => setIsAudioModalVisible(false)}
        onSelectAudio={handleAudioSelect}
      />
    </>
  );
}

export default ContentWriteBottomSheet;
