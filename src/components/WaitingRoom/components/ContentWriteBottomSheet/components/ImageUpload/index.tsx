'use client';

/**
 * @fileoverview ImageUpload 컴포넌트
 * @description 이미지 업로드 컴포넌트
 * 
 * @description
 * - 이미지 파일 선택
 * - 이미지 미리보기
 * - 이미지 삭제
 * - 파일 형식 검증
 * - 파일 크기 검증
 * - 사진 개수 제한 확인
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React, { useRef } from 'react';
import type { ImageUploadProps } from '../../types';
import { validateFileSize, isImageFile } from '@/commons/utils/content';
import styles from './styles.module.css';

/**
 * ImageUpload 컴포넌트
 * 
 * 이미지 파일을 업로드하고 미리보기를 제공합니다.
 * 기존 이미지 URL과 새로 선택한 파일을 모두 표시합니다.
 * 
 * @param {ImageUploadProps} props - ImageUpload 컴포넌트의 props
 */
export function ImageUpload({
  images,
  existingImageUrls = [],
  maxCount,
  onChange,
  onRemove: _onRemove,
  onRemoveExisting,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 전체 이미지 개수 (기존 URL + 새 파일)
  const totalImageCount = existingImageUrls.length + images.length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // 파일 형식 검증
      if (!isImageFile(file)) {
        alert('이미지 파일만 업로드할 수 있습니다. (jpg, png, gif 등)');
        continue;
      }

      // 파일 크기 검증 (10MB 제한)
      if (!validateFileSize(file, 10 * 1024 * 1024)) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        continue;
      }

      // 개수 제한 확인 (기존 URL + 새 파일 포함)
      if (totalImageCount + newFiles.length >= maxCount) {
        alert(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
        break;
      }

      newFiles.push(file);
    }

    if (newFiles.length > 0) {
      onChange([...images, ...newFiles]);
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    _onRemove(index);
  };

  const handleRemoveExisting = (index: number) => {
    if (onRemoveExisting) {
      onRemoveExisting(index);
    }
  };

  const handleAddClick = () => {
    if (totalImageCount >= maxCount) {
      alert(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <svg
          className={styles.sectionIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18L9 13L13 17L20 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" />
        </svg>
        <span className={styles.label}>
          사진 ({totalImageCount}/{maxCount})
        </span>
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={totalImageCount >= maxCount}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.addText}>사진 추가</span>
      </button>

      {(existingImageUrls.length > 0 || images.length > 0) && (
        <div className={styles.photoGridContainer}>
          {/* 기존 이미지 URL 표시 */}
          {existingImageUrls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.photoPreviewItem}>
              <div className={styles.photoPreview}>
                <img
                  src={url}
                  alt={`기존 이미지 ${index + 1}`}
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.photoPreviewLabel}>
                <span className={styles.photoPreviewText}>사진 {index + 1}</span>
              </div>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleRemoveExisting(index)}
                aria-label={`기존 이미지 ${index + 1} 삭제`}
              >
                <svg className={styles.deleteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}

          {/* 새로 선택한 이미지 파일 표시 */}
          {images.map((image, index) => {
            const displayIndex = existingImageUrls.length + index;
            return (
              <div key={`new-${index}`} className={styles.photoPreviewItem}>
                <div className={styles.photoPreview}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`이미지 ${displayIndex + 1}`}
                    className={styles.previewImage}
                  />
                </div>
                <div className={styles.photoPreviewLabel}>
                  <span className={styles.photoPreviewText}>사진 {displayIndex + 1}</span>
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleRemove(index)}
                  aria-label={`이미지 ${displayIndex + 1} 삭제`}
                >
                  <svg className={styles.deleteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className={styles.fileInput}
        aria-label="이미지 파일 선택"
      />
    </div>
  );
}

export default ImageUpload;
