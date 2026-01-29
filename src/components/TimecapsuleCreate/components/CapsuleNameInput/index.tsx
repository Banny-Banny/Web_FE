'use client';

/**
 * @fileoverview CapsuleNameInput 컴포넌트
 * @description 캡슐 이름 입력 필드 컴포넌트
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { CapsuleNameInputProps } from './types';
import styles from './styles.module.css';

/**
 * CapsuleNameInput 컴포넌트
 * 
 * 캡슐 이름을 입력하는 텍스트 필드 컴포넌트입니다.
 * React Hook Form과 통합되어 있으며, 실시간 유효성 검사를 지원합니다.
 * 
 * @param {CapsuleNameInputProps} props - CapsuleNameInput 컴포넌트의 props
 */
export function CapsuleNameInput({
  maxLength = 50,
  showCharCount = false,
}: Omit<CapsuleNameInputProps, 'register' | 'errors'>) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const capsuleName = watch('capsuleName');
  const error = errors.capsuleName;
  const currentLength = capsuleName?.length || 0;
  const isMaxLength = maxLength && currentLength >= maxLength;

  return (
    <div className={`${styles.container} ${error ? styles.inputError : ''}`}>
      <label htmlFor="capsuleName" className={styles.label}>
        캡슐 이름
      </label>
      <div className={styles.inputContainer}>
        <input
          id="capsuleName"
          type="text"
          {...register('capsuleName')}
          maxLength={maxLength}
          className={styles.input}
          placeholder="예) 2025년의 우리"
          aria-label="캡슐 이름"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'capsuleName-error' : undefined}
        />
      </div>
      {error && (
        <span
          id="capsuleName-error"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </span>
      )}
      {showCharCount && maxLength && (
        <span
          className={`${styles.charCount} ${isMaxLength ? styles.charCountMax : ''}`}
        >
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
