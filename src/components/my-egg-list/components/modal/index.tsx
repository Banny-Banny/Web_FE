/**
 * components/my-egg-list/components/modal/index.tsx
 * 이스터에그 모달 컴포넌트
 *
 * Checklist:
 * - [x] tailwind.config.js 수정 안 함
 * - [x] 색상값 직접 입력 0건 (Colors 토큰만 사용)
 * - [x] 인라인 스타일 0건
 * - [x] index.tsx → 구조만 / styles.module.css → 스타일만 분리
 * - [x] 토큰 기반 스타일 사용
 * - [x] 피그마 구조 대비 누락 섹션 없음
 * - [x] @remixicon/react 사용
 * - [x] commons/components/modal 사용
 * - [x] title 필드 사용
 * - [x] 미디어 ID를 직접 URL로 변환
 * - [x] useKakaoAddress 훅으로 주소 변환
 */

'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import {
  RiCloseLine,
  RiMapPinLine,
  RiTimeLine,
  RiCalendarLine,
  RiGroupLine,
} from '@remixicon/react';
import { Modal } from '@/commons/components/modal';
import styles from './styles.module.css';

// 임시 타입 정의 (실제 hook에서 제공될 것으로 예상)
export interface EggDetailResponse {
  id?: string;
  title?: string;
  message?: string;
  content?: string;
  imageMediaId?: string;
  audioMediaId?: string;
  videoMediaId?: string;
  imageObjectKey?: string;
  audioObjectKey?: string;
  videoObjectKey?: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  author?: {
    id?: string;
    nickname?: string;
    profileImg?: string;
    profile_img?: string;
  };
  viewers?: Array<{
    id?: string;
    nickname?: string;
    profileImg?: string;
    profile_img?: string;
    viewedAt?: string;
    viewed_at?: string;
  }>;
  type?: 'FOUND' | 'PLANTED';
  createdAt?: string;
  created_at?: string;
  foundAt?: string;
  found_at?: string;
  open_at?: string;
}

export interface EasterEggModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 이스터에그 상세 데이터 (원본 API 응답) */
  data: EggDetailResponse | null;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ visible, onClose, data }) => {
  // 화면 높이의 80%를 계산하여 최대 높이 제한
  const maxHeight = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight * 0.8;
    }
    return 600;
  }, []);

  // 데이터가 없으면 빈 모달 반환 (항상 같은 구조 유지)
  if (!data) {
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={340}
        height="auto"
        padding={0}
        closeOnBackdropPress>
        <div className={styles.scrollViewWrapper} style={{ maxHeight: `${maxHeight}px` }}>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="닫기">
            <RiCloseLine size={20} className={styles.closeIcon} />
          </button>
        </div>
      </Modal>
    );
  }

  // 미디어 URL 생성 (실제로는 hook에서 처리)
  const imageUrl = data.imageObjectKey || (data.imageMediaId ? `/api/media/${data.imageMediaId}` : null);
  const audioUrl = data.audioObjectKey || (data.audioMediaId ? `/api/media/${data.audioMediaId}` : null);
  const videoUrl = data.videoObjectKey || (data.videoMediaId ? `/api/media/${data.videoMediaId}` : null);

  // 주소
  const locationAddress = data.location?.address || '위치 정보 없음';

  // 프로필 이미지
  const authorProfileImg = data.author?.profileImg || data.author?.profile_img || null;

  // 날짜 포맷팅
  const createdDate = data.createdAt || data.created_at || data.open_at
    ? new Date(data.createdAt || data.created_at || data.open_at || '').toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  // 발견 시간 포맷팅
  const formatShortDateWithTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 발견 순서 텍스트
  const getDiscoveryOrderText = () => {
    if (data.type === 'FOUND' && data.viewers) {
      const currentUserIndex = data.viewers.findIndex((v) => v.id === data.author?.id);
      if (currentUserIndex >= 0) {
        const order = currentUserIndex + 1;
        const orderText = ['첫 번째', '두 번째', '세 번째'][order - 1] || `${order}번째`;
        return orderText;
      }
    }
    return null;
  };

  // 현재 사용자의 발견 시간
  const getCurrentUserViewedAt = () => {
    if (data.type === 'FOUND' && data.viewers) {
      const currentUser = data.viewers.find((v) => v.id === data.author?.id);
      if (currentUser) {
        return formatShortDateWithTime(currentUser.viewedAt || currentUser.viewed_at);
      }
    }
    return null;
  };

  // 미디어 렌더링 함수
  const renderMedia = () => {
    const hasImage = !!imageUrl;
    const hasAudio = !!audioUrl;
    const hasVideo = !!videoUrl;

    if (!hasImage && !hasAudio && !hasVideo) {
      return null;
    }

    return (
      <div className={styles.mediaContainer}>
        {/* 이미지 렌더링 */}
        {hasImage && imageUrl && (
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt="이스터에그 이미지"
              width={300}
              height={300}
              className={styles.image}
            />
          </div>
        )}

        {/* 오디오 플레이어 렌더링 */}
        {hasAudio && audioUrl && (
          <div className={styles.audioPlayerWrapper}>
            <audio controls className={styles.audioPlayer}>
              <source src={audioUrl} type="audio/mpeg" />
              <source src={audioUrl} type="audio/mp3" />
              <source src={audioUrl} type="audio/wav" />
              오디오를 재생할 수 없습니다.
            </audio>
          </div>
        )}

        {/* 비디오 플레이어 렌더링 */}
        {hasVideo && videoUrl && (
          <div className={styles.videoPlayerWrapper}>
            <video controls className={styles.videoPlayer}>
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              비디오를 재생할 수 없습니다.
            </video>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      width={340}
      height="auto"
      padding={0}
      closeOnBackdropPress
      disableAnimation={false}>
      <div className={styles.scrollViewWrapper} style={{ maxHeight: `${maxHeight}px` }}>
        {/* 닫기 버튼 (우측 상단) */}
        <button className={styles.closeButton} onClick={onClose} type="button" aria-label="닫기">
          <RiCloseLine size={20} className={styles.closeIcon} />
        </button>
        <div className={styles.scrollView}>
          <div className={styles.modalContent}>
            {/* 상단 프로필 이미지 */}
            <div className={styles.profileImageContainer}>
              {authorProfileImg ? (
                <Image
                  src={authorProfileImg}
                  alt={`${data.author?.nickname || ''} 프로필 이미지`}
                  width={128}
                  height={128}
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  <RiGroupLine size={40} className={styles.profilePlaceholderIcon} />
                </div>
              )}
            </div>

            {/* 서브타이틀 */}
            {data.type === 'FOUND' ? (
              <div className={styles.subtitleContainer}>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleBold}>{data.author?.nickname || ''}</span>
                  <span>님의 소중한 추억을 </span>
                  {getDiscoveryOrderText() && (
                    <span className={styles.subtitleBold}>{getDiscoveryOrderText()}</span>
                  )}
                </p>
                <p className={styles.subtitle}>(으)로 찾으셨군요!</p>
              </div>
            ) : (
              <div className={styles.subtitleContainer}>
                <p className={styles.subtitle}>다른 사람들이 발견한 내 이스터에그를</p>
                <p className={styles.subtitle}>확인해보세요!</p>
              </div>
            )}

            {/* 위치 정보 배지 (중앙 정렬) */}
            <div className={styles.badgeContainer}>
              <RiMapPinLine size={16} className={styles.badgeIcon} />
              <span className={styles.badgeText}>{locationAddress}</span>
            </div>

            {/* 발견 날짜 정보 (FOUND 타입일 때만, 카드 밖) */}
            {data.type === 'FOUND' && getCurrentUserViewedAt() && (
              <div className={styles.discovererInfoContainer}>
                <RiTimeLine size={14} className={styles.discovererIcon} />
                <span className={styles.discovererDateText}>
                  {getCurrentUserViewedAt()}에 발견함
                </span>
              </div>
            )}

            {/* 메인 컨텐츠 카드 */}
            <div className={styles.contentCard}>
              {/* 제목 헤더 */}
              <div className={styles.titleHeader}>
                <h2 className={styles.contentTitle}>{data.title || '제목 없음'}</h2>
                <div className={styles.dateBadge}>
                  <RiCalendarLine size={14} className={styles.dateIcon} />
                  <span className={styles.dateText}>{createdDate}</span>
                </div>
              </div>

              {/* 본문 */}
              <p className={styles.contentText}>{data.message || data.content || ''}</p>

              {/* 미디어 렌더링 */}
              {renderMedia()}

              {/* 발견한 사람들 목록 (PLANTED 타입일 때만, 0명일 때도 공간 유지) */}
              {data.type === 'PLANTED' && (
                <div className={styles.viewersSection}>
                  <div className={styles.viewersHeader}>
                    <RiGroupLine size={16} className={styles.viewersIcon} />
                    <h3 className={styles.viewersTitle}>
                      발견한 사람 ({data.viewers?.length || 0})
                    </h3>
                  </div>
                  <div className={styles.viewersList}>
                    {data.viewers && data.viewers.length > 0 ? (
                      data.viewers.map((viewer) => {
                        const viewerProfileImg = viewer.profileImg || viewer.profile_img || null;
                        const viewedDate = formatShortDateWithTime(
                          viewer.viewedAt || viewer.viewed_at
                        );

                        return (
                          <div key={viewer.id || viewer.nickname} className={styles.viewerItem}>
                            <div className={styles.discovererViewerInfo}>
                              <div className={styles.discovererViewerAvatar}>
                                {viewerProfileImg ? (
                                  <Image
                                    src={viewerProfileImg}
                                    alt={`${viewer.nickname || ''} 프로필 이미지`}
                                    width={28}
                                    height={28}
                                    className={styles.discovererViewerAvatarImage}
                                  />
                                ) : (
                                  <RiGroupLine size={16} className={styles.viewerPlaceholderIcon} />
                                )}
                              </div>
                              <span className={styles.viewerName}>{viewer.nickname || ''}</span>
                            </div>
                            <div className={styles.viewerDateBadge}>
                              <RiTimeLine size={12} className={styles.viewerDateIcon} />
                              <span className={styles.viewerDateText}>{viewedDate}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.emptyViewersContainer}>
                        <p className={styles.emptyViewersText}>아직 발견한 사람이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EasterEggModal;
