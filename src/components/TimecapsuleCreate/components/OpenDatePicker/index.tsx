'use client';

/**
 * @fileoverview OpenDatePicker 컴포넌트
 * @description 오픈 예정일 선택 필드 컴포넌트
 */

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { OpenDatePickerProps } from './types';
import styles from './styles.module.css';

/**
 * OpenDatePicker 컴포넌트
 * 
 * 오픈 예정일을 선택하는 날짜 입력 필드 컴포넌트입니다.
 * 미래 날짜만 선택 가능하도록 제한됩니다.
 * React Hook Form과 통합되어 있으며, 실시간 유효성 검사를 지원합니다.
 * 
 * @param {OpenDatePickerProps} props - OpenDatePicker 컴포넌트의 props
 */
export function OpenDatePicker({}: Omit<OpenDatePickerProps, 'register' | 'errors' | 'setValue'>) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = errors.openDate;
  const openDate = watch('openDate');

  // 오늘 이후 날짜만 선택 가능하도록 min 속성 설정
  const today = new Date();
  today.setDate(today.getDate() + 1); // 내일부터 선택 가능
  const minDate = today.toISOString().split('T')[0];

  // 날짜 변경 시 유효성 검사
  useEffect(() => {
    if (openDate) {
      const selectedDate = new Date(openDate);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= todayDate) {
        setValue('openDate', '', { shouldValidate: true });
      }
    }
  }, [openDate, setValue]);

  return (
    <div className={styles.container}>
      <label htmlFor="openDate" className={styles.label}>
        오픈 예정일
      </label>
      <input
        id="openDate"
        type="date"
        {...register('openDate')}
        min={minDate}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-label="오픈 예정일"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'openDate-error' : undefined}
      />
      {error && (
        <span
          id="openDate-error"
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
