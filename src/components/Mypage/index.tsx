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
import { ProfileSection } from './components/profile-section';
import { Notification } from './components/notification';
import { useProfile } from './components/profile-section/hooks/useProfile';
import { useUnreadNotificationCount } from '@/commons/apis/me/notifications/hooks/useUnreadNotificationCount';
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
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const summary = profile?.summary;

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleFriendClick = () => {
    router.push('/friends');
  };

  const handleCapsuleClick = () => {
    router.push('/profile/capsules');
  };

  const handleEasterEggClick = () => {
    router.push('/my-eggs');
  };

  const handleNoticeClick = () => {
    router.push('/notice');
  };

  const handleCustomerCenterClick = () => {
    router.push('/customer-center');
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
          <button
            className={styles.notificationButton}
            onClick={() => setShowNotification(true)}
            type="button"
            aria-label="알림"
          >
            <RiNotificationLine size={24} className={styles.notificationIcon} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
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
        <button
          className={styles.activityItem}
          onClick={handleCapsuleClick}
          type="button"
          aria-label="캡슐보관함"
        >
          <div className={styles.activityNumber}>{timeCapsuleCount}</div>
          <div className={styles.activityLabel}>캡슐</div>
        </button>
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
          className={styles.navItem}
          onClick={() => router.push('/notifications')}
          type="button"
          aria-label="소식"
        >
          <span className={styles.navItemText}>소식</span>
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
            setIsLoggingOut(true);
            try {
              await logout();
              router.push('/');
            } finally {
              setIsLoggingOut(false);
            }
          }}
          className={styles.logoutButton}
        />
      </div>

      {/* 버전 정보 */}
      <div className={styles.versionInfo}>
        VERSION 1.0.0 © 2024
      </div>

      {/* 알림(소식) 패널 — notificationButton 또는 '소식' 메뉴 클릭 시 표시 */}
      {showNotification && (
        <Notification onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
}

export default Mypage;
