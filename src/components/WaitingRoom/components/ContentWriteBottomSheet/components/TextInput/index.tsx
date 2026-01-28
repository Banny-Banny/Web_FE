'use client';

/**
 * @fileoverview TextInput 컴포넌트
 * @description 텍스트 입력 컴포넌트
 * 
 * @description
 * - 텍스트 입력 필드
 * - 실시간 표시
 * - Figma 디자인 기반 pixel-perfect 구현
 */

import React from 'react';
import type { TextInputProps } from '../../types';
import styles from './styles.module.css';

/**
 * TextInput 컴포넌트
 * 
 * 텍스트 입력 필드를 제공합니다.
 * 
 * @param {TextInputProps} props - TextInput 컴포넌트의 props
 */
export function TextInput({
  value,
  onChange,
  placeholder = '당신의 이야기를 남겨주세요...',
  maxLength,
}: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    onChange(newValue);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>텍스트</label>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={6}
      />
    </div>
  );
}

export default TextInput;
