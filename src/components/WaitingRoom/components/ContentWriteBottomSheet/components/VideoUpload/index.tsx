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
import { validateFileSize, isVideoFile } from '@/commons/utils/content';
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
  onRemove: _onRemove,
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
        <span className={styles.label}>
          동영상 ({video ? 1 : 0}/1)
        </span>
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={!!video}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.addText}>{video ? '동영상 교체' : '동영상 추가'}</span>
      </button>

      {video && (
        <div className={styles.mediaFileContainer}>
          <div className={styles.mediaFileInfo}>
            <svg className={styles.mediaFileIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14V10ZM5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z"/>
            </svg>
            <span className={styles.fileName}>{video.name}</span>
          </div>
          <button
            type="button"
            className={styles.mediaDeleteButton}
            onClick={handleRemove}
            aria-label="영상 파일 삭제"
          >
            <svg className={styles.deleteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

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
