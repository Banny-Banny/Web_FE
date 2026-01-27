/**
 * 발견 성공 모달
 * 30m 이내에서 친구 이스터에그를 발견했을 때 표시되는 모달
 * Figma 디자인: node-id=599-6755
 */

'use client';

import { useEffect } from 'react';
import type { DiscoveryModalProps } from './types';
import styles from './styles.module.css';

export function DiscoveryModal({ isOpen, capsule, onClose }: DiscoveryModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 모달이 열려있지 않거나 캡슐 정보가 없으면 렌더링하지 않음
  if (!isOpen || !capsule) return null;

  // 미디어 타입 확인
  const hasImage = capsule.media_types?.includes('image') || false;

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* 상단 이모지 아이콘 */}
        <div className={styles.iconContainer}>
          <div className={styles.iconCircle}>
            <span className={styles.icon}>🥚</span>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <h2 className={styles.mainTitle}>이스터에그 발견!</h2>

        {/* 서브 타이틀 */}
        <p className={styles.subtitle}>누군가의 소중한 추억을 찾으셨군요!</p>

        {/* 첫 번째 발견자 뱃지 */}
        <div className={styles.badge}>
          <svg className={styles.badgeIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10.09 5.26L14.8 5.91L11.4 9.19L12.18 13.88L8 11.67L3.82 13.88L4.6 9.19L1.2 5.91L5.91 5.26L8 1Z" fill="#1E2939" stroke="#1E2939" strokeWidth="1.5"/>
          </svg>
          <span className={styles.badgeText}>첫 번째 발견자</span>
        </div>

        {/* 콘텐츠 카드 */}
        <div className={styles.contentCard}>
          {/* 작성자 정보 */}
          {capsule.author && (
            <div className={styles.authorHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.authorEmoji}>☕️</div>
                <span className={styles.authorName}>
                  {capsule.author.nickname || '알 수 없음'}
                </span>
              </div>
              <div className={styles.dateInfo}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V6L9 9" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className={styles.dateText}>03.15</span>
              </div>
            </div>
          )}

          {/* 캡슐 제목 */}
          {capsule.title && (
            <h3 className={styles.capsuleTitle}>{capsule.title}</h3>
          )}

          {/* 메시지 */}
          {capsule.content && (
            <p className={styles.message}>{capsule.content}</p>
          )}

          {/* 이미지 */}
          {hasImage && capsule.media_urls && capsule.media_urls.length > 0 && (
            <div className={styles.imageContainer}>
              <img
                src={capsule.media_urls[0]}
                alt="이스터에그 이미지"
                className={styles.image}
              />
            </div>
          )}

          {/* 열람 횟수 */}
          {capsule.view_limit && (
            <div className={styles.viewCount}>
              <span className={styles.viewLabel}>열람 횟수</span>
              <span className={styles.viewValue}>
                {capsule.view_count ?? 0}/{capsule.view_limit}
              </span>
            </div>
          )}
        </div>

        {/* 확인 버튼 */}
        <button className={styles.confirmButton} onClick={onClose}>
          확인했어요
        </button>
      </div>
    </div>
  );
}
