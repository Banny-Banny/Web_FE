'use client';

/**
 * 마이페이지 컴포넌트
 * 
 * @description
 * - 사용자 프로필 정보 표시
 * - 마이페이지 메뉴 및 기능 제공
 * - CSS Modules 기반 스타일링
 */

import React from 'react';
import { RiCameraLine, RiArrowRightSLine } from '@remixicon/react';
import styles from './styles.module.css';
import type { MypageProps } from './types';

/**
 * Mypage 컴포넌트
 * 
 * @param {MypageProps} props - 컴포넌트 props
 */
export function Mypage({ className = '' }: MypageProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            <div className={styles.profileImageWrapper}>
              <div className={styles.profileImage}>
                {/* 프로필 이미지 영역 */}
              </div>
            </div>
            <div className={styles.cameraButtonWrapper}>
              <button className={styles.cameraButton} aria-label="프로필 사진 변경">
                <RiCameraLine size={14} className={styles.cameraIcon} />
              </button>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>사용자 이름</h1>
            <p className={styles.profileEmail}>user@example.com</p>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className={styles.menuSection}>
        <div className={styles.menuList}>
          <button className={styles.menuItem}>
            <span className={styles.menuItemText}>설정</span>
            <RiArrowRightSLine size={20} className={styles.menuItemIcon} />
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuItemText}>알림 설정</span>
            <RiArrowRightSLine size={20} className={styles.menuItemIcon} />
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuItemText}>고객센터</span>
            <RiArrowRightSLine size={20} className={styles.menuItemIcon} />
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuItemText}>로그아웃</span>
            <RiArrowRightSLine size={20} className={styles.menuItemIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
