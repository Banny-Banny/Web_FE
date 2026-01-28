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

import React from 'react';
import { BottomSheet } from '@/commons/components/bottom-sheet';
import { DualButton } from '@/commons/components/dual-button';
import { Spinner } from '@/commons/components/spinner';
import { MediaLimits } from './components/MediaLimits';
import { TextInput } from './components/TextInput';
import { ImageUpload } from './components/ImageUpload';
import { MusicUpload } from './components/MusicUpload';
import { VideoUpload } from './components/VideoUpload';
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
    hasExistingContent,
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

  const handleCancelClick = () => {
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      draggable={true}
      maxHeight="90vh"
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
                <MusicUpload
                  music={formData.music}
                  onChange={handleMusicChange}
                  onRemove={handleMusicRemove}
                />
              )}

              {settings?.hasVideo && (
                <VideoUpload
                  video={formData.video}
                  onChange={handleVideoChange}
                  onRemove={handleVideoRemove}
                />
              )}
            </div>

            <div className={styles.footer}>
              <DualButton
                cancelLabel="취소"
                confirmLabel="저장"
                size="L"
                confirmDisabled={isSaving || formData.text.trim().length === 0}
                onCancelPress={handleCancelClick}
                onConfirmPress={handleSaveClick}
              />
              <p className={styles.infoText}>
                {isEditMode ? '수정된 내용을 저장합니다' : '저장 후에도 수정할 수 있어요'}
              </p>
            </div>
          </>
        )}
      </div>
    </BottomSheet>
  );
}

export default ContentWriteBottomSheet;
