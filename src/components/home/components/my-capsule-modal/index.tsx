/**
 * 내 캡슐 모달 (바텀시트)
 * 사용자가 생성한 캡슐을 지도에서 클릭했을 때 표시되는 바텀시트
 * Figma 디자인: node-id=600-6931
 */

'use client';

import { useEffect } from 'react';
import { RiTimeLine, RiMapPinLine, RiStarFill } from '@remixicon/react';
import type { MyCapsuleModalProps } from './types';
import styles from './styles.module.css';

export function MyCapsuleModal({ isOpen, capsule, onClose, onLocationClick }: MyCapsuleModalProps) {
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

  // 발견자 정보 (캡슐 상세 정보에 포함됨)
  const viewersCount = capsule.view_count ?? 0;
  const viewersList = capsule.viewers ?? [];
  const displayViewersList = viewersList;

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.bottomSheet}>
        {/* 헤더: 이스터에그 아이콘 + 제목 (가로 배치) */}
        <div className={styles.header}>
          <div className={styles.eggIcon}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="18" fill="#0A0A0A"/>
              <text x="18" y="24" fontSize="20" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="Pretendard Variable">?</text>
            </svg>
          </div>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{capsule.title || '제목 없음'}</h3>
            <p className={styles.subtitle}>내가 숨긴 이스터에그</p>
          </div>
        </div>

        {/* 정보 카드 (날짜, 위치) */}
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <RiTimeLine size={12} className={styles.cardIcon} />
              <span className={styles.cardLabel}>숨긴 날짜</span>
            </div>
            <p className={styles.cardValue}>
              {capsule.created_at
                ? new Date(capsule.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).replace(/\. /g, '.').replace(/\.$/, '')
                : '알 수 없음'}
            </p>
          </div>

          <div
            className={styles.infoCard}
            role={onLocationClick ? 'button' : undefined}
            tabIndex={onLocationClick ? 0 : undefined}
            onClick={onLocationClick ? () => onLocationClick(capsule) : undefined}
            onKeyDown={
              onLocationClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLocationClick(capsule);
                    }
                  }
                : undefined
            }
            aria-label={onLocationClick ? '위치 보기' : undefined}
          >
            <div className={styles.cardHeader}>
              <RiMapPinLine size={12} className={styles.cardIcon} />
              <span className={styles.cardLabel}>위치</span>
            </div>
            <p className={styles.cardValue}>
              {capsule.location_name || '위치 정보 없음'}
            </p>
          </div>
        </div>

        {/* 발견 기록 */}
        <div className={styles.discoverySection}>
          <div className={styles.sectionHeader}>
            <RiStarFill size={16} className={styles.starIcon} />
            <h4 className={styles.sectionTitle}>발견 기록 ({viewersCount})</h4>
          </div>

          {/* 발견자 목록 */}
          {displayViewersList.length > 0 ? (
            <div className={styles.viewersList}>
              {displayViewersList.map((viewer, index) => (
                <div key={viewer.id} className={styles.viewerItem}>
                  <div className={styles.viewerInfo}>
                    <div className={styles.viewerBadge}>
                      <span className={styles.badgeNumber}>{index + 1}</span>
                    </div>
                    <span className={styles.viewerName}>
                      {viewer.nickname || '알 수 없음'}
                    </span>
                  </div>
                  <span className={styles.viewerDate}>
                    {new Date(viewer.viewed_at).toLocaleDateString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).replace(/\. /g, '.').replace(/\.$/, '').replace(' ', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>아직 발견한 사람이 없어요</p>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
