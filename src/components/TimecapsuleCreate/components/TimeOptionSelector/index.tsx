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
 * - 직접 선택: customOpenDate가 있음 (사용자가 날짜 선택)
 */
const TIME_OPTIONS: TimeOptionInfo[] = [
  { value: '1_WEEK', label: '1주일', price: 1000 },
  { value: '1_MONTH', label: '1개월', price: 5000 },
  { value: '1_YEAR', label: '1년', price: 10000 },
  { value: 'CUSTOM', label: '직접 선택', price: 0 },
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
  
  const customOpenDate = watch('customOpenDate');

  // 선택된 옵션의 가격 계산
  const getSelectedPrice = (): number => {
    if (!selectedTimeOption) return 0;

    // CUSTOM인 경우: 날짜 선택 여부에 따라 가격 계산
    if (selectedTimeOption === 'CUSTOM') {
      if (!customOpenDate) return 0;

      // 날짜 차이 계산 (일 단위)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(customOpenDate);
      selectedDate.setHours(0, 0, 0, 0);
      const diffTime = selectedDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 가격 계산: 날짜별 (1일당 100원 가정, React Native 버전 로직 참고)
      // React Native에서는 datePrice로 관리, 여기서는 간단히 일수 기반 계산
      return Math.max(0, diffDays * 100);
    }

    // 1_WEEK, 1_MONTH, 1_YEAR인 경우
    const option = TIME_OPTIONS.find((opt) => opt.value === selectedTimeOption);
    return option?.price || 0;
  };

  const currentPrice = getSelectedPrice();

  // 개봉일자 포맷팅
  const getFormattedOpenDate = (): string | null => {
    if (!selectedTimeOption) return null;

    const today = new Date();
    let openDate: Date;

    switch (selectedTimeOption) {
      case '1_WEEK':
        openDate = new Date(today);
        openDate.setDate(openDate.getDate() + 7);
        break;
      case '1_MONTH':
        openDate = new Date(today);
        openDate.setMonth(openDate.getMonth() + 1);
        break;
      case '1_YEAR':
        openDate = new Date(today);
        openDate.setFullYear(openDate.getFullYear() + 1);
        break;
      case 'CUSTOM':
        if (!customOpenDate) return null;
        openDate = new Date(customOpenDate);
        break;
      default:
        return null;
    }

    return `개봉일자: ${openDate.getFullYear()}년 ${openDate.getMonth() + 1}월 ${openDate.getDate()}일`;
  };

  const formattedOpenDate = getFormattedOpenDate();

  const handleOptionSelect = (value: '1_WEEK' | '1_MONTH' | '1_YEAR' | 'CUSTOM') => {
    if (value === 'CUSTOM') {
      // 직접선택을 누를 때마다 모달이 열리도록 강제로 다시 설정
      if (selectedTimeOption === 'CUSTOM') {
        // 직접선택 재오픈을 위해 중간값으로 리셋 후 CUSTOM 재설정
        setValue('timeOption', '1_WEEK', { shouldValidate: false });
        setTimeout(() => {
          setValue('timeOption', 'CUSTOM', { shouldValidate: true });
        }, 0);
      } else {
        setValue('timeOption', value, { shouldValidate: true });
      }
    } else {
      setValue('timeOption', value, { shouldValidate: true });
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
              {option.value === 'CUSTOM' ? (
                customOpenDate ? (
                  <span className={styles.optionPrice}>
                    {new Date(customOpenDate).getMonth() + 1}/{new Date(customOpenDate).getDate()}
                  </span>
                ) : (
                  <span className={styles.optionPrice}>날짜별</span>
                )
              ) : (
                <span className={styles.optionPrice}>₩{option.price.toLocaleString()}</span>
              )}
            </label>
          );
        })}
      </div>
      {formattedOpenDate && (
        <p className={styles.openDateText}>{formattedOpenDate}</p>
      )}
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
