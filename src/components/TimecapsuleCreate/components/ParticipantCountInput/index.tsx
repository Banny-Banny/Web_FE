'use client';

/**
 * @fileoverview ParticipantCountInput 컴포넌트
 * @description 참여 인원 수 입력 필드 컴포넌트
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { ParticipantCountInputProps } from './types';
import styles from './styles.module.css';

/**
 * ParticipantCountInput 컴포넌트
 * 
 * 참여 인원 수를 입력하는 숫자 필드 컴포넌트입니다.
 * 1 이상의 정수만 입력 가능합니다.
 * React Hook Form과 통합되어 있으며, 실시간 유효성 검사를 지원합니다.
 * 
 * @param {ParticipantCountInputProps} props - ParticipantCountInput 컴포넌트의 props
 */
export function ParticipantCountInput({}: Omit<ParticipantCountInputProps, 'register' | 'errors'>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TimecapsuleFormData>();

  const error = errors.participantCount;

  return (
    <div className={styles.container}>
      <label htmlFor="participantCount" className={styles.label}>
        참여 인원 수
      </label>
      <input
        id="participantCount"
        type="number"
        {...register('participantCount', {
          valueAsNumber: true,
        })}
        min="1"
        max="10"
        step="1"
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-label="참여 인원 수"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'participantCount-error' : undefined}
      />
      {error && (
        <span
          id="participantCount-error"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </span>
      )}
    </div>
  );
}
