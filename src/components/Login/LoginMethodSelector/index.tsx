'use client';

/**
 * 로그인 방법 선택 화면 컴포넌트
 * 
 * @description
 * - 사용자가 카카오 소셜 로그인 또는 이메일 자체 로그인 중 선택할 수 있는 화면
 * - 로그인 페이지의 첫 화면으로 표시됨
 * - 375px 모바일 프레임 기준
 */

import React from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import { RiMapPinLine, RiGroupLine } from '@remixicon/react';
import styles from './styles.module.css';

export interface LoginMethodSelectorProps {
  /**
   * 카카오 로그인 선택 시 호출되는 핸들러
   */
  onSelectKakao: () => void;
  
  /**
   * 이메일 로그인 선택 시 호출되는 핸들러
   */
  onSelectEmail: () => void;
}

/**
 * LoginMethodSelector 컴포넌트
 * 
 * 로그인 방법 선택 화면을 렌더링합니다.
 */
export function LoginMethodSelector({
  onSelectKakao,
  onSelectEmail,
}: LoginMethodSelectorProps) {
  return (
    <div className={styles.container}>
      {/* 상단 섹션 - 환영 메시지 및 서비스 설명 */}
      <div className={styles.topSection}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>환영합니다!</h1>
          <p className={styles.welcomeSubtitle}>시간을 담아, 추억을 보관하세요</p>
        </div>

        {/* 기능 설명 카드들 */}
        <div className={styles.featureCards}>
          {/* 지도에서 추억 숨기기 - 아이콘 왼쪽 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.featureIcon}>
                <RiMapPinLine size={24} />
              </div>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>지도에서 추억 숨기기</h3>
              <p className={styles.featureDescription}>원하는 장소에 타임캡슐을 묻어보세요</p>
            </div>
          </div>

          {/* 친구와 함께 - 아이콘 오른쪽 */}
          <div className={`${styles.featureCard} ${styles.featureCardReverse}`}>
            <div className={styles.featureIconWrapper}>
              <div className={styles.featureIcon}>
                <RiGroupLine size={24} />
              </div>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>친구와 함께</h3>
              <p className={styles.featureDescription}>소중한 사람들과 추억을 공유하세요</p>
            </div>
           
          </div>
        </div>
      </div>

      {/* 중앙 하단 섹션 - 일러스트레이션 */}
      <div className={styles.illustrationSection}>
        <div className={styles.illustrationWrapper}>
          <Image
            src="/icons/onboarding_page_icon.png"
            alt="토끼 일러스트레이션"
            width={300}
            height={300}
            className={styles.illustrationImage}
            priority
          />
        </div>
      </div>

      {/* 하단 섹션 - 로그인 버튼 및 저작권 정보 */}
      <div className={styles.bottomSection}>
        <div className={styles.buttonGroup}>
          {/* 카카오로 시작하기 버튼 */}
          <Button
            label="카카오로 시작하기"
            variant="primary"
            size="L"
            onPress={onSelectKakao}
            className={styles.kakaoButton}
          />

          {/* 이메일로 시작하기 버튼 */}
          <Button
            label="이메일로 시작하기"
            variant="primary"
            size="L"
            onPress={onSelectEmail}
            className={styles.emailButton}
          />
        </div>

        {/* 저작권 정보 */}
        <p className={styles.copyright}>© 2025 타임캡슐</p>
      </div>
    </div>
  );
}
