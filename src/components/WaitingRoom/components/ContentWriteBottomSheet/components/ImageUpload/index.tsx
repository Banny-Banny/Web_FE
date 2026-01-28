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
import { validateFileType, validateFileSize, isImageFile } from '@/commons/utils/content';
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
  onRemove,
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
    onRemove(index);
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
      <div className={styles.header}>
        <label className={styles.label}>
          사진 ({totalImageCount}/{maxCount})
        </label>
      </div>

      {(existingImageUrls.length > 0 || images.length > 0) && (
        <div className={styles.previewContainer}>
          {/* 기존 이미지 URL 표시 */}
          {existingImageUrls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.previewItem}>
              <img
                src={url}
                alt={`기존 이미지 ${index + 1}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveExisting(index)}
                aria-label={`기존 이미지 ${index + 1} 삭제`}
              >
                ×
              </button>
            </div>
          ))}
          
          {/* 새로 선택한 이미지 파일 표시 */}
          {images.map((image, index) => {
            const displayIndex = existingImageUrls.length + index;
            return (
              <div key={`new-${index}`} className={styles.previewItem}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`이미지 ${displayIndex + 1}`}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(displayIndex)}
                  aria-label={`이미지 ${displayIndex + 1} 삭제`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={totalImageCount >= maxCount}
      >
        <span className={styles.addIcon}>📷</span>
        <span className={styles.addText}>사진 추가</span>
      </button>

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
