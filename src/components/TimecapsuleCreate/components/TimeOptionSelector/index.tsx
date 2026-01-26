'use client';

/**
 * @fileoverview TimeOptionSelector 컴포넌트
 * @description 개봉일 선택 옵션 컴포넌트 (1주/1개월/1년/커스텀)
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { TimeOptionSelectorProps, TimeOptionInfo } from './types';
import styles from './styles.module.css';

/**
 * 타임 옵션 목록
 * 
 * @note
 * - 커스텀: customOpenDate가 있음 (사용자가 날짜 선택)
 */
const TIME_OPTIONS: TimeOptionInfo[] = [
  { value: '1_WEEK', label: '1주 후', price: 1000 },
  { value: '1_MONTH', label: '1개월 후', price: 3000 },
  { value: '1_YEAR', label: '1년 후', price: 5000 },
  { value: 'CUSTOM', label: '커스텀', price: 0 },
];

/**
 * TimeOptionSelector 컴포넌트
 * 
 * 개봉일을 선택하는 옵션 카드 컴포넌트입니다.
 * 1주 후, 1개월 후, 1년 후, 커스텀 중 하나를 선택할 수 있습니다.
 * 
 * @param {TimeOptionSelectorProps} props - TimeOptionSelector 컴포넌트의 props
 */
export function TimeOptionSelector({}: Omit<TimeOptionSelectorProps, 'register' | 'errors' | 'setValue' | 'watch'>) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = errors.timeOption;
  const selectedTimeOption = watch('timeOption');
  
  // 선택된 옵션의 가격 계산
  const getSelectedPrice = (): number => {
    if (!selectedTimeOption) return 0;
    
    // CUSTOM인 경우: 기본 금액 0원
    if (selectedTimeOption === 'CUSTOM') {
      return 0;
    }
    
    // 1_WEEK, 1_MONTH, 1_YEAR인 경우
    const option = TIME_OPTIONS.find((opt) => opt.value === selectedTimeOption);
    return option?.price || 0;
  };
  
  const currentPrice = getSelectedPrice();

  const handleOptionSelect = (value: '1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM') => {
    setValue('timeOption', value, { shouldValidate: true });
    if (value !== 'CUSTOM') {
      setValue('customOpenDate', undefined, { shouldValidate: false });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor="timeOption" className={styles.label}>
          개봉일 선택
        </label>
        {currentPrice > 0 && (
          <span className={styles.currentPrice}>₩ {currentPrice.toLocaleString()}</span>
        )}
      </div>
      <div
        className={styles.optionsGrid}
        role="radiogroup"
        aria-labelledby="timeOption-label"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'timeOption-error' : undefined}
      >
        {TIME_OPTIONS.map((option: TimeOptionInfo, index: number) => {
          const optionId = `timeOption-${option.value}-${index}`;
          const customOpenDate = watch('customOpenDate');
          
          // 선택 상태 확인
          let isSelected = false;
          if (option.value !== 'CUSTOM') {
            isSelected = selectedTimeOption === option.value;
          } else {
            // CUSTOM인 경우: timeOption이 CUSTOM이면 선택됨
            isSelected = selectedTimeOption === 'CUSTOM';
          }
          
          return (
            <label
              key={optionId}
              className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
              htmlFor={optionId}
              onClick={() => handleOptionSelect(option.value)}
            >
              <input
                id={optionId}
                type="radio"
                {...register('timeOption')}
                value={option.value}
                checked={isSelected}
                onChange={() => {}} // controlled by onClick
                className={styles.hiddenInput}
                aria-label={option.label}
              />
              <span className={styles.optionLabel}>{option.label}</span>
              {option.price > 0 ? (
                <span className={styles.optionPrice}>₩{option.price.toLocaleString()}</span>
              ) : (
                <span className={styles.optionSubtext}>기본 금액</span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <span
          id="timeOption-error"
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
