'use client';

/**
 * @fileoverview QuantitySelector 컴포넌트
 * @description 수량 선택 컴포넌트 (+/- 버튼)
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import RiAddLine from 'remixicon-react/AddLineIcon';
import RiSubtractLine from 'remixicon-react/SubtractLineIcon';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { QuantitySelectorProps } from './types';
import styles from './styles.module.css';

/**
 * QuantitySelector 컴포넌트
 * 
 * 수량을 선택하는 컴포넌트입니다.
 * +/- 버튼으로 값을 조절할 수 있습니다.
 * 
 * @param {QuantitySelectorProps} props - QuantitySelector 컴포넌트의 props
 */
export function QuantitySelector({
  fieldName,
  label,
  subLabel,
  unitPrice = 0,
  min = 0,
  max = 10,
}: Omit<QuantitySelectorProps, 'register' | 'errors' | 'setValue' | 'watch'>) {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const error = errors[fieldName];
  const currentValue = watch(fieldName) ?? min;
  
  // photoCount는 최대 5개까지 선택 가능
  const participantCount = watch('participantCount') || 1;
  const maxPhotoCount = fieldName === 'photoCount' ? 5 : max;
  
  // 계산 방법: 인원수 × 이미지슬롯 개수 × 500원
  const currentCost = fieldName === 'photoCount' 
    ? participantCount * currentValue * 500 
    : 0; // participantCount는 가격 표시 안 함

  const handleDecrease = () => {
    if (currentValue > min) {
      setValue(fieldName, currentValue - 1, { shouldValidate: true });
    }
  };

  const handleIncrease = () => {
    const actualMax = fieldName === 'photoCount' ? maxPhotoCount : max;
    if (currentValue < actualMax) {
      setValue(fieldName, currentValue + 1, { shouldValidate: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.labelContainer}>
          <label htmlFor={fieldName} className={styles.label}>
            {label}
          </label>
          {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
        </div>
        {fieldName === 'photoCount' && currentCost > 0 && (
          <span className={styles.currentCost}>₩{currentCost.toLocaleString()}</span>
        )}
        {fieldName === 'photoCount' && currentCost === 0 && (
          <span className={styles.currentCost}>₩0</span>
        )}
      </div>
      <div className={styles.selectorContainer}>
        <button
          type="button"
          className={styles.decreaseButton}
          onClick={handleDecrease}
          disabled={currentValue <= min}
          aria-label={`${label} 감소`}
        >
          <RiSubtractLine size={20} />
        </button>
        <span className={styles.quantityDisplay}>
          {currentValue} {fieldName === 'participantCount' ? '명' : fieldName === 'photoCount' ? '개' : ''}
        </span>
        <button
          type="button"
          className={styles.increaseButton}
          onClick={handleIncrease}
          disabled={currentValue >= (fieldName === 'photoCount' ? maxPhotoCount : max)}
          aria-label={`${label} 증가`}
        >
          <RiAddLine size={20} />
        </button>
      </div>
      {fieldName !== 'photoCount' && unitPrice > 0 && (
        <p className={styles.hintText}>1EA: ₩{unitPrice.toLocaleString()}</p>
      )}
      {error && (
        <span
          id={`${fieldName}-error`}
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
