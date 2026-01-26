'use client';

/**
 * @fileoverview TimecapsuleCreate 메인 컴포넌트
 * @description 타임캡슐 생성 페이지 메인 컴포넌트
 */

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import { Button } from '@/commons/components/button';
import { useTimecapsuleForm } from './hooks/useTimecapsuleForm';
import { CapsuleNameInput } from './components/CapsuleNameInput';
import { TimeOptionSelector } from './components/TimeOptionSelector';
import { CustomDatePicker } from './components/CustomDatePicker';
import { QuantitySelector } from './components/QuantitySelector';
import { AdditionalOptions } from './components/AdditionalOptions';
import { TotalPrice } from './components/TotalPrice';
import styles from './styles.module.css';

/**
 * TimecapsuleCreate 컴포넌트
 * 
 * 타임캡슐 생성 페이지의 메인 컴포넌트입니다.
 * 모든 입력 필드를 통합하고 폼 제출을 처리합니다.
 */
export function TimecapsuleCreate() {
  const router = useRouter();
  const form = useTimecapsuleForm();
  const {
    onSubmit,
    handleSubmitClick,
    watch,
    isSubmitting,
    apiError,
  } = form;

  // 필수 필드 체크: 제목과 개봉일
  const capsuleName = watch('capsuleName');
  const timeOption = watch('timeOption');
  const customOpenDate = watch('customOpenDate');
  
  // CUSTOM 옵션인 경우 customOpenDate도 필수
  const isRequiredFieldsValid = 
    capsuleName && 
    capsuleName.trim().length > 0 && 
    timeOption && 
    (timeOption !== 'CUSTOM' || customOpenDate);

  return (
    <FormProvider {...form}>
      <div className={styles.container}>
        <TimeCapsuleHeader
          title="타임캡슐 만들기"
          onBack={() => router.back()}
        />
        <div className={styles.content}>
          <form onSubmit={onSubmit} className={styles.form} noValidate>
            <CapsuleNameInput maxLength={50} showCharCount={false} />
            <TimeOptionSelector />
            <CustomDatePicker />
            <QuantitySelector
              fieldName="participantCount"
              label="PERSONNEL"
              subLabel="최대 인원"
              unitPrice={0}
              min={1}
              max={10}
            />
            <QuantitySelector
              fieldName="photoCount"
              label="STORAGE"
              subLabel="이미지 슬롯"
              unitPrice={0}
              min={0}
              max={5}
            />
            <AdditionalOptions />
            {apiError && (
              <div className={styles.apiError} role="alert">
                {apiError}
              </div>
            )}
            <TotalPrice />
            <div className={styles.submitButton}>
              <Button
                label={isSubmitting ? '처리 중...' : '결제하기'}
                variant="primary"
                size="L"
                onPress={handleSubmitClick}
                disabled={isSubmitting || !isRequiredFieldsValid}
                fullWidth
              />
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
