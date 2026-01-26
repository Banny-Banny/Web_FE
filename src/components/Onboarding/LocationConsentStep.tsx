'use client';

/**
 * 위치 권한 허용 단계 컴포넌트
 * Figma 디자인 기반 구현
 */

import React from 'react';
import { Icon } from '@/commons/components/icon';
import { ChevronRight } from 'lucide-react';
import type { LocationConsentStepProps } from './types';
import styles from './styles.module.css';

/**
 * LocationConsentStep 컴포넌트
 * 
 * 위치 권한 허용에 대한 동의를 받는 단계
 */
export function LocationConsentStep({
  consent: _consent,
  onConsentChange,
  onComplete,
  isLoading = false,
  error,
}: LocationConsentStepProps) {
  const handleAllow = () => {
    // 상태 업데이트 후 최신 값으로 API 호출
    onConsentChange(true);
    // onComplete에 직접 true 값을 전달하여 최신 상태 보장
    onComplete(true);
  };

  const handleSkip = () => {
    // 상태 업데이트 후 최신 값으로 API 호출
    onConsentChange(false);
    // onComplete에 직접 false 값을 전달하여 최신 상태 보장
    onComplete(false);
  };

  return (
    <div className={styles.stepContainer}>
      {/* 진행 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressBarActive}></div>
        <div className={styles.progressBarInactive}></div>
      </div>

      {/* STEP 라벨 */}
      <div className={styles.stepLabel}>STEP 02</div>

      <div className={styles.content}>
        {/* 메인 타이틀 */}
        <h2 className={styles.title}>지금 어디에 계신가요?</h2>
        
        {/* 설명 */}
        <p className={styles.description}>
          정확한 위치를 확인해야 지도 위에 당신의 소중한 기록을 남길 수 있어요.
        </p>
        
        {/* 중앙 일러스트 */}
        <div className={styles.locationIllustration}>
          <Icon 
            name="onboarding-location" 
            size="xl" 
            alt="위치 권한 일러스트" 
          />
        </div>
      </div>
      
      {/* 하단 버튼 영역 */}
      <div className={styles.footer}>
        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}
        <button
          type="button"
          className={styles.allowButton}
          onClick={handleAllow}
          disabled={isLoading}
          aria-label="위치 권한 허용"
        >
          <span className={styles.allowButtonText}>위치 권한 허용</span>
          <ChevronRight size={20} color="white" className={styles.allowButtonIcon} />
        </button>
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleSkip}
          disabled={isLoading}
          aria-label="건너뛰기"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
