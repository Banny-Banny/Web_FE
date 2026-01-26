'use client';

/**
 * @fileoverview AdditionalOptions 컴포넌트
 * @description 추가 옵션 컴포넌트 (음악 파일, 영상 추가)
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import type { AdditionalOptionsProps, AdditionalOptionInfo } from './types';
import styles from './styles.module.css';

/**
 * 추가 옵션 목록
 */
const ADDITIONAL_OPTIONS: AdditionalOptionInfo[] = [
  { fieldName: 'addMusic', label: '음악 파일', price: 1000 },
  { fieldName: 'addVideo', label: '영상 추가', price: 2000 },
];

/**
 * AdditionalOptions 컴포넌트
 * 
 * 추가 옵션을 선택하는 컴포넌트입니다.
 * 음악 파일과 영상 추가 옵션을 제공합니다.
 * 
 * @param {AdditionalOptionsProps} props - AdditionalOptions 컴포넌트의 props
 */
export function AdditionalOptions({}: Omit<AdditionalOptionsProps, 'register' | 'errors' | 'watch'>) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<TimecapsuleFormData>();

  const addMusic = watch('addMusic') || false;
  const addVideo = watch('addVideo') || false;
  const participantCount = watch('participantCount') || 0;
  // 계산 방법: 인원수 × 1000원 (음성) + 인원수 × 2000원 (영상)
  const totalCost = (addMusic ? participantCount * 1000 : 0) + (addVideo ? participantCount * 2000 : 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>추가 옵션</label>
        {totalCost > 0 && (
          <span className={styles.currentCost}>₩{totalCost.toLocaleString()}</span>
        )}
        {totalCost === 0 && (
          <span className={styles.currentCost}>₩0</span>
        )}
      </div>
      <div className={styles.optionsGrid}>
        {ADDITIONAL_OPTIONS.map((option: AdditionalOptionInfo) => {
          const isSelected = watch(option.fieldName) || false;
          const optionId = `additional-${option.fieldName}`;
          
          return (
            <label
              key={optionId}
              className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
              htmlFor={optionId}
            >
              <input
                id={optionId}
                type="checkbox"
                {...register(option.fieldName)}
                className={styles.hiddenInput}
                aria-label={option.label}
              />
              {option.icon && (
                <div className={styles.optionIcon}>
                  {/* 아이콘은 추후 추가 */}
                </div>
              )}
              <span className={styles.optionLabel}>{option.label}</span>
              <span className={styles.optionPrice}>
                +₩{option.price.toLocaleString()}/인
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
