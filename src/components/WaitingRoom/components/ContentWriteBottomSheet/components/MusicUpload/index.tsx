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
import { validateFileType, validateFileSize, isAudioFile } from '@/commons/utils/content';
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
  onRemove,
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
      <div className={styles.header}>
        <label className={styles.label}>
          음성 ({music ? 1 : 0}/1)
        </label>
      </div>

      {music && (
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{music.name}</span>
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label="음악 파일 삭제"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.addButton}
        onClick={handleAddClick}
        disabled={!!music}
      >
        <span className={styles.addIcon}>🎵</span>
        <span className={styles.addText}>음성 추가</span>
      </button>

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
