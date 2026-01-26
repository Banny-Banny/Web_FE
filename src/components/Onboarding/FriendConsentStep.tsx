'use client';

/**
 * 친구 연동 허용 단계 컴포넌트
 * Figma 디자인 기반 구현
 */

import React from 'react';
import { Icon } from '@/commons/components/icon';
import { ChevronRight } from 'lucide-react';
import type { FriendConsentStepProps } from './types';
import styles from './styles.module.css';

/**
 * FriendConsentStep 컴포넌트
 * 
 * 친구 연동 허용에 대한 동의를 받는 단계
 */
export function FriendConsentStep({
  consent: _consent,
  onConsentChange,
  onNext,
}: FriendConsentStepProps) {
  const handleAllow = () => {
    onConsentChange(true);
    onNext();
  };

  const handleSkip = () => {
    onConsentChange(false);
    onNext();
  };

  return (
    <div className={styles.stepContainer}>
      {/* 진행 바 */}
      <div className={styles.progressBar}>
        <div className={styles.progressBarActive}></div>
        <div className={styles.progressBarInactive}></div>
      </div>

      {/* STEP 라벨 */}
      <div className={styles.stepLabel}>STEP 01</div>

      <div className={styles.content}>
        {/* 메인 타이틀 */}
        <h2 className={styles.title}>친구들과 함께 찾아보세요</h2>
        
        {/* 설명 */}
        <p className={styles.description}>
          연락처를 연동하면 이미 활동 중인 친구들을 바로 만날 수 있어요.
        </p>
        
        {/* 정보 카드들 */}
        <div className={styles.infoCards}>
          {/* 카드 1: 내 친구 자동 매칭 */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>
              <Icon name="friend" size="lg" color="#A2A2A2" alt="친구 아이콘" />
            </div>
            <div className={styles.infoCardContent}>
              <h3 className={styles.infoCardTitle}>내 친구 자동 매칭</h3>
              <p className={styles.infoCardDescription}>
                내 연락처 속 친구들이 숨겨둔 에그를 알림으로도 받을 수 있어요.
              </p>
            </div>
          </div>

          {/* 카드 2: 안전한 개인정보 */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>
              <Icon name="shield" size="lg" color="#A2A2A2" alt="보안 아이콘" />
            </div>
            <div className={styles.infoCardContent}>
              <h3 className={styles.infoCardTitle}>안전한 개인정보</h3>
              <p className={styles.infoCardDescription}>
                모든 연락처는 암호화되어 안전하게 저장됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 버튼 영역 */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.allowButton}
          onClick={handleAllow}
          aria-label="친구 연동 허용"
        >
          <span className={styles.allowButtonText}>친구 연동 허용</span>
          <ChevronRight size={20} color="white" className={styles.allowButtonIcon} />
        </button>
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleSkip}
          aria-label="건너뛰기"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
