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
      <div className={styles.sectionHeader}>
        <svg
          className={styles.sectionIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 2C7.89543 2 7 2.89543 7 4V20C7 21.1046 7.89543 22 9 22H18C19.1046 22 20 21.1046 20 20V7.41421C20 7.01639 19.842 6.63486 19.5607 6.35355L15.6464 2.43934C15.3651 2.15804 14.9836 2 14.5858 2H9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 13H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.label}>텍스트</span>
      </div>
      <div className={styles.textAreaContainer}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      </div>
    </div>
  );
}

export default TextInput;
