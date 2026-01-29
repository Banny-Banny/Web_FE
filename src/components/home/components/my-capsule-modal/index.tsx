/**
 * 내 캡슐 모달 (바텀시트)
 * 사용자가 생성한 캡슐을 지도에서 클릭했을 때 표시되는 바텀시트
 * Figma 디자인: node-id=600-6931
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { RiTimeLine, RiMapPinLine, RiGroupLine } from '@remixicon/react';
import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import type { MyCapsuleModalProps } from './types';
import styles from './styles.module.css';

export function MyCapsuleModal({ isOpen, capsule, onClose, onLocationClick }: MyCapsuleModalProps) {
  // 좌표 추출 (API가 문자열로 올 수 있음)
  const latRaw = capsule?.latitude;
  const lngRaw = capsule?.longitude;
  const latitude = latRaw != null ? Number(latRaw) : undefined;
  const longitude = lngRaw != null ? Number(lngRaw) : undefined;

  // 위치명이 없을 때만 카카오 주소 조회
  const { address: addressFromCoord, isLoading: isLoadingAddress } = useKakaoAddress({
    lat: latitude,
    lng: longitude,
    existingAddress: capsule?.location_name,
    enabled: isOpen && !!capsule && !!latitude && !!longitude && !capsule?.location_name,
  });

  // 표시할 위치 텍스트
  const locationDisplay = useMemo(() => {
    if (!capsule) return '위치 정보 없음';
    if (capsule.location_name) return capsule.location_name;
    if (addressFromCoord) return addressFromCoord;
    if (isLoadingAddress && latitude && longitude) return '위치 조회 중...';
    if (latitude && longitude) return '위치 조회 중...';
    return '위치 정보 없음';
  }, [capsule, addressFromCoord, isLoadingAddress, latitude, longitude]);

  // 발견자 목록: 빨리 발견한 순 정렬 (훅 규칙을 위해 early return 이전에 선언)
  const viewersList = useMemo(() => capsule?.viewers ?? [], [capsule?.viewers]);
  const sortedViewers = useMemo(
    () =>
      viewersList.length === 0
        ? []
        : [...viewersList].sort(
            (a, b) => new Date(a.viewed_at).getTime() - new Date(b.viewed_at).getTime()
          ),
    [viewersList]
  );

  // 내 프로필 이미지 (캡슐 작성자 = 나). null/빈 문자열/문자열 "null" 시 플레이스홀더. 로드 실패 시 실패한 URL만 저장해 플레이스홀더 표시 (effect 없이 처리)
  const rawProfileImg = capsule?.author?.profile_img;
  const profileImg =
    rawProfileImg &&
    rawProfileImg !== 'null' &&
    String(rawProfileImg).trim() !== ''
      ? String(rawProfileImg).trim()
      : null;
  const [failedProfileImgUrl, setFailedProfileImgUrl] = useState<string | null>(null);
  const showProfilePlaceholder = !profileImg || failedProfileImgUrl === profileImg;

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

  const viewersCount = viewersList.length;

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.bottomSheet}>
        {/* 헤더: 프로필 이미지(알 모양) + 제목 */}
        <div className={styles.header}>
          <div className={styles.profileEggWrapper} aria-hidden="true">
            {showProfilePlaceholder ? (
              <div className={styles.profileEggPlaceholder}>
                <RiGroupLine size={28} className={styles.profileEggPlaceholderIcon} />
              </div>
            ) : (
              <img
                src={profileImg}
                alt=""
                className={styles.profileEggImage}
                width={56}
                height={64}
                onError={() => setFailedProfileImgUrl(profileImg ?? null)}
              />
            )}
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
            <p className={styles.cardValue}>{locationDisplay}</p>
          </div>
        </div>

        {/* 발견 기록 */}
        <div className={styles.discoverySection}>
          <div className={styles.sectionHeader}>
            <RiGroupLine size={18} className={styles.sectionIcon} aria-hidden="true" />
            <h4 className={styles.sectionTitle}>발견 기록 ({viewersCount})</h4>
          </div>

          {sortedViewers.length > 0 ? (
            <div className={styles.viewersList}>
              {sortedViewers.map((viewer, index) => (
                <div key={viewer.id} className={styles.viewerItem}>
                  <div className={styles.viewerInfo}>
                    <span className={styles.viewerBadge}>{index + 1}</span>
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

        <button className={styles.closeButton} onClick={onClose} type="button">
          닫기
        </button>
      </div>
    </div>
  );
}
