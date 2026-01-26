'use client';

/**
 * @fileoverview TotalPrice 컴포넌트
 * @description 총 결제액 표시 컴포넌트
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { TimecapsuleFormData } from '../../schemas/timecapsuleFormSchema';
import styles from './styles.module.css';

/**
 * 가격 계산 로직
 * 
 * 계산 방법:
 * - 이미지: 인원수 × 이미지슬롯 개수 × 500원 (인당 몇 개 사진 올릴지)
 * - 음성: 인원수 × 1000원
 * - 영상: 인원수 × 2000원
 */
const calculatePrice = (formData: TimecapsuleFormData): number => {
  let total = 0;

  // 타임 옵션 가격
  if (formData.timeOption) {
    if (formData.timeOption === '1_WEEK') {
      total += 1000;
    } else if (formData.timeOption === '1_MONTH') {
      total += 3000;
    } else if (formData.timeOption === '1_YEAR') {
      total += 5000;
    } else if (formData.timeOption === 'CUSTOM') {
      // CUSTOM인 경우: 기본 금액 0원
      total += 0;
    }
  }

  const participantCount = formData.participantCount || 0;
  const photoCount = formData.photoCount || 0;
  const addMusic = formData.addMusic || false;
  const addVideo = formData.addVideo || false;

  // 이미지슬롯: 인원수 × 이미지슬롯 개수 × 500원
  total += participantCount * photoCount * 500;

  // 음성파일: 인원수 × 1000원
  if (addMusic) {
    total += participantCount * 1000;
  }

  // 영상: 인원수 × 2000원
  if (addVideo) {
    total += participantCount * 2000;
  }

  return total;
};

/**
 * TotalPrice 컴포넌트
 * 
 * 총 결제액을 실시간으로 계산하여 표시하는 컴포넌트입니다.
 */
export function TotalPrice() {
  const { watch } = useFormContext<TimecapsuleFormData>();
  
  const formData = watch();
  const totalPrice = calculatePrice(formData);

  return (
    <div className={styles.container}>
      <span className={styles.label}>총 결제액</span>
      <span className={styles.amount}>₩{totalPrice.toLocaleString()}</span>
    </div>
  );
}
