/**
 * 발견 성공 모달
 * 30m 이내에서 친구 이스터에그를 발견했을 때 표시되는 모달
 * Figma 디자인: node-id=599-6755
 *
 * 모달이 뜰 때 POST /api/.../record-view (recordCapsuleView) 요청이 나가며,
 * 발견 기록이 저장되고 캡슐의 view_count가 갱신됩니다.
 */

'use client';

import { useEffect, useRef } from 'react';
import { RiCalendarLine, RiMedalFill, RiUserLine } from '@remixicon/react';
import type { DiscoveryModalProps } from './types';
import styles from './styles.module.css';
import { useRecordCapsuleView } from '../../hooks/useRecordCapsuleView';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useAuth } from '@/commons/hooks/useAuth';

export function DiscoveryModal({ isOpen, capsule, onClose, onDiscoveryRecorded }: DiscoveryModalProps) {
  const { recordView } = useRecordCapsuleView();
  const geolocation = useGeolocation();
  const { user } = useAuth();
  const hasRecordedRef = useRef<Set<string>>(new Set());

  // 모달 진입 시점에 발견 기록 저장 (POST record view 요청)
  useEffect(() => {
    if (!isOpen || !capsule) return;

    // 이미 기록한 캡슐인지 확인 (중복 기록 방지)
    if (hasRecordedRef.current.has(capsule.id)) {
      return;
    }

    // 위치 정보가 있는 경우에만 기록 저장
    if (geolocation.latitude !== null && geolocation.longitude !== null) {
      // 백그라운드에서 발견 기록 저장 (사용자 경험에 영향 없도록)
      recordView(capsule.id, {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      })
        .then((response) => {
          // 기록 완료 후 콜백 호출 (선택)
          if (onDiscoveryRecorded && response) {
            onDiscoveryRecorded();
          }
        })
        .catch((error) => {
          // 에러는 조용히 처리 (이미 훅에서 처리됨)
          console.warn('발견 기록 저장 실패:', error);
        });

      // 기록 완료 표시
      hasRecordedRef.current.add(capsule.id);
    }
  }, [isOpen, capsule, geolocation.latitude, geolocation.longitude, recordView, onDiscoveryRecorded]);

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

  const viewers = capsule.viewers ?? [];
  const myIndex = user?.id ? viewers.findIndex((v) => v.id === user.id) : -1;
  const discovererOrder = myIndex >= 0 ? myIndex + 1 : viewers.length + 1;

  const isInViewers = myIndex >= 0;
  const displayViewCount = isInViewers ? viewers.length : viewers.length + 1;
  const limitDisplay =
    capsule.view_limit === 0 ? '∞' : String(capsule.view_limit ?? 0);

  const createdDateDisplay = capsule.created_at
    ? (() => {
        const d = new Date(capsule.created_at);
        return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
      })()
    : '—';

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* 상단 이스터에그 알 (제외 대상이라 이모지 유지) */}
        <div className={styles.iconContainer}>
          <div className={styles.iconCircle}>
            <span className={styles.icon}>🥚</span>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <h2 className={styles.mainTitle}>이스터에그 발견!</h2>

        {/* 서브 타이틀 */}
        <p className={styles.subtitle}>누군가의 소중한 추억을 찾으셨군요!</p>

        {/* N번째 발견자 뱃지 */}
        <div className={styles.badge}>
          <RiMedalFill size={18} className={styles.badgeIcon} aria-hidden />
          <span className={styles.badgeText}>
            {discovererOrder}번째 발견자
          </span>
        </div>

        {/* 콘텐츠 카드 */}
        <div className={styles.contentCard}>
          {/* 작성자 정보 (프로필 이미지 유지, 없으면 아이콘) */}
          {capsule.author && (
            <div className={styles.authorHeader}>
              <div className={styles.authorInfo}>
                {capsule.author.profile_img ? (
                  <img
                    src={capsule.author.profile_img}
                    alt=""
                    className={styles.authorProfileImg}
                  />
                ) : (
                  <div className={styles.authorIconWrap}>
                    <RiUserLine size={18} aria-hidden />
                  </div>
                )}
                <span className={styles.authorName}>
                  {capsule.author.nickname || '알 수 없음'}
                </span>
              </div>
              <div className={styles.dateInfo}>
                <RiCalendarLine size={12} className={styles.dateInfoIcon} aria-hidden />
                <span className={styles.dateText}>{createdDateDisplay}</span>
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

          {/* 발견(열람) 횟수: view_count/view_limit, 내가 viewers에 없으면 +1, limit 0이면 ∞ */}
          <div className={styles.viewCount}>
            <span className={styles.viewLabel}>열람 횟수</span>
            <span className={styles.viewValue}>
              {displayViewCount}/{limitDisplay}
            </span>
          </div>
        </div>

        {/* 확인 버튼 */}
        <button className={styles.confirmButton} onClick={onClose}>
          확인했어요
        </button>
      </div>
    </div>
  );
}
