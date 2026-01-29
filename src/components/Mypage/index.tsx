'use client';

/**
 * 마이페이지 컴포넌트
 * 
 * @description
 * - 사용자 프로필 정보 표시
 * - 마이페이지 메뉴 및 기능 제공
 * - CSS Modules 기반 스타일링
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowRightSLine, RiNotificationLine, RiCloseLine } from '@remixicon/react';
import { Button } from '@/commons/components/button';
import { useAuth } from '@/commons/hooks/useAuth';
import { ProfileSection } from './components/profile-section';
import { useProfile } from './components/profile-section/hooks/useProfile';
import { useAuthActions } from '@/commons/hooks/useAuth';
import styles from './styles.module.css';
import type { MypageProps } from './types';

/**
 * Mypage 컴포넌트
 * 
 * @param {MypageProps} props - 컴포넌트 props
 */
export function Mypage({ className = '' }: MypageProps) {
  const router = useRouter();
  const { logout } = useAuthActions();
  const { data: profile } = useProfile();
  const summary = profile?.summary;

  const handleFriendClick = () => {
    router.push('/friends');
  };

  const handleEasterEggClick = () => {
    router.push('/my-eggs');
  };

  const timeCapsuleCount = summary?.timeCapsuleCount ?? 0;
  const easterEggCount = summary?.easterEggCount ?? 0;
  const friendCount = summary?.friendCount ?? 0;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>마이페이지</h1>
        <div className={styles.headerRight}>
          <button className={styles.notificationButton} aria-label="알림">
            <RiNotificationLine size={24} className={styles.notificationIcon} />
            <span className={styles.notificationBadge}>3</span>
          </button>
          <button className={styles.closeButton} aria-label="닫기">
            <RiCloseLine size={20} className={styles.closeIcon} />
          </button>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <ProfileSection />

      {/* 활동 요약 카드 (GET /api/auth/me data.summary 사용) */}
      <div className={styles.activityCard}>
        <div className={styles.activityItem}>
          <div className={styles.activityNumber}>{timeCapsuleCount}</div>
          <div className={styles.activityLabel}>캡슐</div>
        </div>
        <div className={styles.activityDivider}></div>
        <button 
          className={styles.activityItem}
          onClick={handleEasterEggClick}
          type="button"
          aria-label="이스터에그 목록 보기"
        >
          <div className={styles.activityNumber}>{easterEggCount}</div>
          <div className={styles.activityLabel}>이스터에그</div>
        </button>
        <div className={styles.activityDivider}></div>
        <button 
          className={styles.activityItem}
          onClick={handleFriendClick}
          type="button"
          aria-label="친구 목록 보기"
        >
          <div className={styles.activityNumber}>{friendCount}</div>
          <div className={styles.activityLabel}>친구</div>
        </button>
      </div>

      {/* 내비게이션 카드 */}
      <div className={styles.navigationCard}>
        <button className={styles.navItem}>
          <span className={styles.navItemText}>설정</span>
          <RiArrowRightSLine size={20} className={styles.navItemIcon} />
        </button>
        <div className={styles.navDivider}></div>
        <button className={styles.navItem}>
          <span className={styles.navItemText}>결제 내역</span>
          <RiArrowRightSLine size={20} className={styles.navItemIcon} />
        </button>
        <div className={styles.navDivider}></div>
        <button
          className={`${styles.navItem} ${styles.navItemNotice}`}
          onClick={handleNoticeClick}
          type="button"
          aria-label="공지사항"
        >
          <span className={styles.navItemText}>공지사항</span>
          <RiArrowRightSLine size={20} className={styles.navItemIcon} />
        </button>
        <div className={styles.navDivider}></div>
        <button
          className={styles.navItem}
          onClick={handleCustomerCenterClick}
          type="button"
          aria-label="고객 센터"
        >
          <span className={styles.navItemText}>고객 센터</span>
          <RiArrowRightSLine size={20} className={styles.navItemIcon} />
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <div className={styles.logoutSection}>
        <Button
          label={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          variant="primary"
          size="L"
          onPress={async () => {
            await logout();
            router.push('/');
          }}
          className={styles.logoutButton}
        />
      </div>

      {/* 버전 정보 */}
      <div className={styles.versionInfo}>
        VERSION 1.0.0 © 2024
      </div>
    </div>
  );
}

export default Mypage;
