'use client';

/**
 * @fileoverview VideoUpload 컴포넌트
 * @description 영상 업로드 컴포넌트
 * 
 * @description
 * - 영상 파일 선택
 * - 영상 파일 정보 표시
 * - 영상 파일 삭제
 * - 파일 형식 검증
 * - 파일 크기 검증
 * - 영상 허용 여부 확인
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React, { useRef } from 'react';
import type { VideoUploadProps } from '../../types';
import { validateFileType, validateFileSize, isVideoFile } from '@/commons/utils/content';
import styles from './styles.module.css';

/**
 * VideoUpload 컴포넌트
 * 
 * 영상 파일을 업로드하고 정보를 표시합니다.
 * 
 * @param {VideoUploadProps} props - VideoUpload 컴포넌트의 props
 */
export function VideoUpload({
  video,
  onChange,
  onRemove,
}: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    onChange(file);

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>
          동영상 ({video ? 1 : 0}/1)
        </label>
      </div>

      {video && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{video.name}</span>
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label="영상 파일 삭제"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={!!video}
      >
        <span className={styles.addIcon}>🎬</span>
        <span className={styles.addText}>동영상 추가</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className={styles.fileInput}
        aria-label="영상 파일 선택"
      />
    </div>
  );
}

export default VideoUpload;
