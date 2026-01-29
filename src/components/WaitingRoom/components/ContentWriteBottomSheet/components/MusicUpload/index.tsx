'use client';

/**
 * @fileoverview MusicUpload 컴포넌트
 * @description 음악 업로드 컴포넌트
 * 
 * @description
 * - 음악 파일 선택
 * - 음악 파일 정보 표시
 * - 음악 파일 삭제
 * - 파일 형식 검증
 * - 파일 크기 검증
 * - 음악 허용 여부 확인
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React, { useRef } from 'react';
import type { MusicUploadProps } from '../../types';
import { validateFileSize, isAudioFile } from '@/commons/utils/content';
import styles from './styles.module.css';

/**
 * MusicUpload 컴포넌트
 * 
 * 음악 파일을 업로드하고 정보를 표시합니다.
 * 
 * @param {MusicUploadProps} props - MusicUpload 컴포넌트의 props
 */
export function MusicUpload({
  music,
  onChange,
  onRemove: _onRemove,
}: MusicUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 파일 형식 검증
    if (!isAudioFile(file)) {
      alert('음악 파일만 업로드할 수 있습니다. (mp3, wav 등)');
      return;
    }

    // 파일 크기 검증 (50MB 제한)
    if (!validateFileSize(file, 50 * 1024 * 1024)) {
      alert('파일 크기는 50MB 이하여야 합니다.');
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
            d="M9 18V5L21 3V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className={styles.label}>
          음성 ({music ? 1 : 0}/1)
        </span>
      </div>

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={!!music}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.addText}>{music ? '음성 교체' : '음성 추가'}</span>
      </button>

      {music && (
        <div className={styles.mediaFileContainer}>
          <div className={styles.mediaFileInfo}>
            <svg className={styles.mediaFileIcon} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18V5L21 3V16M9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C7.65685 15 9 16.3431 9 18ZM21 16C21 17.6569 19.6569 19 18 19C16.3431 19 15 17.6569 15 16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16Z"/>
            </svg>
            <span className={styles.fileName}>{music.name}</span>
          </div>
          <button
            type="button"
            className={styles.mediaDeleteButton}
            onClick={handleRemove}
            aria-label="음악 파일 삭제"
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
        accept="audio/*"
        onChange={handleFileSelect}
        className={styles.fileInput}
        aria-label="음악 파일 선택"
      />
    </div>
  );
}

export default MusicUpload;
