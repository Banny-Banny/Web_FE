'use client';

/**
 * @fileoverview CustomDatePicker 컴포넌트
 * @description 커스텀 날짜 선택 컴포넌트 (CUSTOM 옵션 선택 시 표시)
 */

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { CustomDatePickerProps } from './types';
import styles from './styles.module.css';

/**
 * CustomDatePicker 컴포넌트
 * 
 * 커스텀 날짜를 선택하는 입력 필드 컴포넌트입니다.
 * timeOption이 'CUSTOM'일 때만 표시됩니다.
 * 미래 날짜만 선택 가능하도록 제한됩니다.
 * 
 * @param {CustomDatePickerProps} props - CustomDatePicker 컴포넌트의 props
 */
export function CustomDatePicker({}: Omit<CustomDatePickerProps, 'register' | 'errors' | 'setValue' | 'watch'>) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = errors.customOpenDate;
  const timeOption = watch('timeOption');
  const customOpenDate = watch('customOpenDate');

  // CUSTOM 옵션이 아닐 때 날짜 초기화
  useEffect(() => {
    if (timeOption !== 'CUSTOM' && customOpenDate) {
      setValue('customOpenDate', undefined, { shouldValidate: false });
    }
  }, [timeOption, customOpenDate, setValue]);

  // 오늘 이후 날짜만 선택 가능하도록 min 속성 설정
  const today = new Date();
  today.setDate(today.getDate() + 1); // 내일부터 선택 가능
  const minDate = today.toISOString().split('T')[0];

  // 날짜 변경 시 유효성 검사
  useEffect(() => {
    if (customOpenDate && timeOption === 'CUSTOM') {
      const selectedDate = new Date(customOpenDate);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= todayDate) {
        setValue('customOpenDate', undefined, { shouldValidate: true });
      }
    }
  }, [customOpenDate, timeOption, setValue]);

  // CUSTOM 옵션이 아닐 때는 표시하지 않음
  if (timeOption !== 'CUSTOM') {
    return null;
  }
  
  // 직접 선택인 경우에만 날짜 입력 필드 표시
  // 3년 후는 날짜 입력이 필요 없으므로, customOpenDate가 없으면 표시하지 않음
  // 하지만 사용자가 직접 선택을 클릭하면 날짜 입력 필드를 보여줘야 하므로
  // CUSTOM이면 항상 표시 (사용자가 직접 선택을 클릭하면 날짜를 입력할 수 있도록)

  return (
    <div className={styles.container}>
      <input
        id="customOpenDate"
        type="date"
        {...register('customOpenDate')}
        min={minDate}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-label="커스텀 오픈일"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'customOpenDate-error' : undefined}
      />
      {error && (
        <span
          id="customOpenDate-error"
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
