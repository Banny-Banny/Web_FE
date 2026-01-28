'use client';

/**
 * 프로필 섹션 컴포넌트
 * 
 * @description
 * - 로그인한 사용자의 프로필 정보를 표시
 * - /api/me API를 통해 프로필 데이터를 조회
 * - React Query를 사용하여 데이터 페칭 및 캐싱
 * - CSS Modules 기반 스타일링
 */

import React from 'react';
import { RiCameraLine } from '@remixicon/react';
import { useProfile } from './hooks/useProfile';
import styles from './styles.module.css';

/**
 * ProfileSection 컴포넌트 Props
 */
export interface ProfileSectionProps {
  className?: string;
}

/**
 * ProfileSection 컴포넌트
 * 
 * @param {ProfileSectionProps} props - 컴포넌트 props
 */
export function ProfileSection({ className = '' }: ProfileSectionProps) {
  const { data: profile, isLoading, error } = useProfile();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`${styles.profileSection} ${className}`}>
        <div className={styles.profileImageContainer}>
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImage}>
              <span className={styles.profileEmoji}>🐰</span>
            </div>
          </div>
          <div className={styles.cameraButtonWrapper}>
            <button className={styles.cameraButton} aria-label="프로필 사진 변경" disabled>
              <RiCameraLine size={14} className={styles.cameraIcon} />
            </button>
          </div>
        </div>
        <h2 className={styles.profileName}>로딩 중...</h2>
        <p className={styles.profileEmail}>로딩 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`${styles.profileSection} ${className}`}>
        <div className={styles.profileImageContainer}>
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImage}>
              <span className={styles.profileEmoji}>🐰</span>
            </div>
          </div>
          <div className={styles.cameraButtonWrapper}>
            <button className={styles.cameraButton} aria-label="프로필 사진 변경" disabled>
              <RiCameraLine size={14} className={styles.cameraIcon} />
            </button>
          </div>
        </div>
        <h2 className={styles.profileName}>오류 발생</h2>
        <p className={styles.profileEmail}>
          {error.status === 401 
            ? '인증이 필요합니다.' 
            : error.status === 404 
            ? '사용자를 찾을 수 없습니다.' 
            : '프로필을 불러올 수 없습니다.'}
        </p>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!profile) {
    return (
      <div className={`${styles.profileSection} ${className}`}>
        <div className={styles.profileImageContainer}>
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImage}>
              <span className={styles.profileEmoji}>🐰</span>
            </div>
          </div>
          <div className={styles.cameraButtonWrapper}>
            <button className={styles.cameraButton} aria-label="프로필 사진 변경" disabled>
              <RiCameraLine size={14} className={styles.cameraIcon} />
            </button>
          </div>
        </div>
        <h2 className={styles.profileName}>프로필 없음</h2>
        <p className={styles.profileEmail}>프로필 정보가 없습니다.</p>
      </div>
    );
  }

  // 프로필 이미지가 있는 경우 이미지 표시, 없는 경우 기본 이모지 표시
  const hasProfileImage = profile.profileImg && profile.profileImg.trim() !== '';

  return (
    <div className={`${styles.profileSection} ${className}`}>
      <div className={styles.profileImageContainer}>
        <div className={styles.profileImageWrapper}>
          <div className={styles.profileImage}>
            {hasProfileImage ? (
              <img 
                src={profile.profileImg!} 
                alt={`${profile.nickname}의 프로필`}
                className={styles.profileImageImg}
              />
            ) : (
              <span className={styles.profileEmoji}>🐰</span>
            )}
          </div>
        </div>
        <div className={styles.cameraButtonWrapper}>
          <button className={styles.cameraButton} aria-label="프로필 사진 변경">
            <RiCameraLine size={14} className={styles.cameraIcon} />
          </button>
        </div>
      </div>
      <h2 className={styles.profileName}>{profile.nickname || profile.name || '사용자'}</h2>
      <p className={styles.profileEmail}>{profile.email || ''}</p>
    </div>
  );
}

export default ProfileSection;
