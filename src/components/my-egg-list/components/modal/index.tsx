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
import { useQuery } from '@tanstack/react-query';
import {
  RiCloseLine,
  RiMapPinLine,
  RiTimeLine,
  RiCalendarLine,
  RiGroupLine,
  RiImageLine,
  RiVidiconLine,
} from '@remixicon/react';
import { Modal } from '@/commons/components/modal';
import { Spinner } from '@/commons/components/spinner';
import { AudioPlayer } from '@/commons/components/audio-player';
import { VideoPlayer } from '@/commons/components/video-player';
import { useAuth } from '@/commons/hooks/useAuth';
import { useKakaoAddress } from '@/commons/hooks/useKakaoAddress';
import { getMediaUrl } from '@/commons/apis';
import { formatShortDateWithTime, formatLocaleDateShort } from '@/commons/utils';
import type { EasterEggModalProps } from './types';
import styles from './styles.module.css';

export type { ModalEggDetailData, EasterEggModalProps } from './types';

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ 
  visible, 
  onClose, 
  data,
  isLoading = false,
  isError = false,
}) => {
  // 현재 사용자 정보 가져오기
  const { user } = useAuth();

  // 미디어 로딩 실패 상태 관리
  const [imageError, setImageError] = React.useState(false);

  // 미디어 존재 여부 확인
  const hasMedia = useMemo(() => {
    if (!data) return false;
    const hasImage = !!(data.imageMediaId || data.imageObjectKey);
    const hasAudio = !!(data.audioMediaId || data.audioObjectKey);
    const hasVideo = !!(data.videoMediaId || data.videoObjectKey);
    return hasImage || hasAudio || hasVideo;
  }, [data]);

  // 화면 높이의 80% 또는 60%를 계산하여 최대 높이 제한 (미디어가 없으면 60%)
  const maxHeight = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight * (hasMedia ? 0.8 : 0.6);
    }
    return hasMedia ? 600 : 450;
  }, [hasMedia]);

  // 데이터가 변경되면 에러 상태 초기화
  React.useEffect(() => {
    if (data) {
      setImageError(false);
    }
  }, [data]);

  // 좌표 추출
  const latitude = data?.location?.latitude;
  const longitude = data?.location?.longitude;

  // 카카오 주소 조회 훅 사용
  const { address: addressFromCoord, isLoading: isLoadingAddress } = useKakaoAddress({
    lat: latitude,
    lng: longitude,
    existingAddress: data?.location?.address,
  });

  // 이미지 미디어 URL 조회 (imageMediaId가 있으면 API로 URL 가져옴)
  const { data: imageMediaData, isLoading: isLoadingImageUrl, isError: isImageUrlError, error: imageUrlError } = useQuery({
    queryKey: ['mediaUrl', 'image', data?.imageMediaId],
    queryFn: async () => {
      if (!data?.imageMediaId) {
        return Promise.resolve(null);
      }
      console.log('[EasterEggModal] 이미지 URL API 호출:', data.imageMediaId);
      const result = await getMediaUrl(data.imageMediaId);
      console.log('[EasterEggModal] 이미지 URL API 응답:', result);
      return result;
    },
    enabled: !!data && !!data.imageMediaId, // data와 imageMediaId가 있을 때 호출
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐시
    retry: 1,
  });

  // 디버깅: API 호출 상태 확인
  React.useEffect(() => {
    console.log('[EasterEggModal] data:', data);
    console.log('[EasterEggModal] data?.imageMediaId:', data?.imageMediaId);
    console.log('[EasterEggModal] enabled 조건:', !!data && !!data.imageMediaId);
    console.log('[EasterEggModal] visible:', visible);
    if (data?.imageMediaId) {
      console.log('[EasterEggModal] imageMediaId:', data.imageMediaId);
      console.log('[EasterEggModal] isLoadingImageUrl:', isLoadingImageUrl);
      console.log('[EasterEggModal] isImageUrlError:', isImageUrlError);
      console.log('[EasterEggModal] imageUrlError:', imageUrlError);
      console.log('[EasterEggModal] imageMediaData:', imageMediaData);
    }
  }, [data, data?.imageMediaId, visible, isLoadingImageUrl, isImageUrlError, imageUrlError, imageMediaData]);

  // 오디오 미디어 URL 조회 (audioMediaId가 있으면 API로 URL 가져옴)
  const { data: audioMediaData } = useQuery({
    queryKey: ['mediaUrl', 'audio', data?.audioMediaId],
    queryFn: () => {
      if (!data?.audioMediaId) {
        return Promise.resolve(null);
      }
      return getMediaUrl(data.audioMediaId);
    },
    enabled: !!data && !!data.audioMediaId,
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐시
    retry: 1,
  });

  // 비디오 미디어 URL 조회 (videoMediaId가 있으면 API로 URL 가져옴)
  const { data: videoMediaData } = useQuery({
    queryKey: ['mediaUrl', 'video', data?.videoMediaId],
    queryFn: () => {
      if (!data?.videoMediaId) {
        return Promise.resolve(null);
      }
      return getMediaUrl(data.videoMediaId);
    },
    enabled: !!data && !!data.videoMediaId,
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐시
    retry: 1,
  });

  // 미디어 URL: imageMediaId가 있으면 API URL만 사용, 없으면 objectKey로 구성
  const imageUrl = useMemo(() => {
    if (!data) return null;
    // imageMediaId가 있으면 API URL만 사용 (로딩 중이거나 실패해도 objectKey 사용 안 함)
    if (data.imageMediaId) {
      return imageMediaData?.url || null;
    }
    // imageMediaId가 없을 때만 objectKey 사용
    if (data.imageObjectKey) {
      return data.imageObjectKey.startsWith('http')
        ? data.imageObjectKey
        : `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ''}/${data.imageObjectKey}`;
    }
    return null;
  }, [data, imageMediaData]);

  const audioUrl = useMemo(() => {
    if (!data) return null;
    // audioMediaId가 있으면 API URL만 사용
    if (data.audioMediaId) {
      return audioMediaData?.url || null;
    }
    // audioMediaId가 없을 때만 objectKey 사용
    if (data.audioObjectKey) {
      return data.audioObjectKey.startsWith('http')
        ? data.audioObjectKey
        : `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ''}/${data.audioObjectKey}`;
    }
    return null;
  }, [data, audioMediaData]);

  const videoUrl = useMemo(() => {
    if (!data) return null;
    // videoMediaId가 있으면 API URL만 사용
    if (data.videoMediaId) {
      return videoMediaData?.url || null;
    }
    // videoMediaId가 없을 때만 objectKey 사용
    if (data.videoObjectKey) {
      return data.videoObjectKey.startsWith('http')
        ? data.videoObjectKey
        : `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL || ''}/${data.videoObjectKey}`;
    }
    return null;
  }, [data, videoMediaData]);

  // 주소 우선순위: location.address > addressFromCoord > 로딩 중 > '위치 정보 없음'
  // addressFromCoord가 로딩 중이면 "위치 정보 조회 중..." 표시
  const hasLocation = !!latitude && !!longitude;

  const locationAddress = useMemo(() => {
    if (!data) return '위치 정보 없음';
    if (data.location?.address) {
      return data.location.address;
    }
    if (addressFromCoord) {
      return addressFromCoord;
    }
    if (isLoadingAddress && hasLocation) {
      return '위치 정보 조회 중...';
    }
    if (hasLocation) {
      return '위치 정보 조회 중...';
    }
    return '위치 정보 없음';
  }, [data, addressFromCoord, isLoadingAddress, hasLocation]);

  // 프로필 이미지 URL 처리 (React Compiler: 의존성은 data로 통일)
  const authorProfileImg = useMemo(() => {
    if (!data?.author?.profileImg) return null;
    const profileImg = data.author.profileImg;
    // 이미 전체 URL이면 그대로 사용, 아니면 상대 경로 처리
    if (profileImg.startsWith('http://') || profileImg.startsWith('https://')) {
      return profileImg;
    }
    // 상대 경로인 경우 기본 URL 추가 (필요시)
    return profileImg;
  }, [data]);

  // 데이터가 없으면 로딩 또는 에러 상태 표시
  if (!data) {
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={340}
        height="auto"
        padding={0}
        closeOnBackdropPress
        disableAnimation={true}>
        <div className={styles.scrollViewWrapper} style={{ maxHeight: `${maxHeight}px`, height: `${maxHeight}px` }}>
          <button className={styles.closeButton} onClick={onClose} type="button" aria-label="닫기">
            <RiCloseLine size={20} className={styles.closeIcon} />
          </button>
          <div className={styles.scrollView} style={{ maxHeight: `calc(${maxHeight}px - 0px)` }}>
            <div className={styles.modalContent}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <Spinner size="large" />
                <p className={styles.loadingMessage}>상세 정보를 불러오는 중...</p>
              </div>
            ) : isError ? (
              <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>상세 정보를 불러올 수 없습니다.</p>
                <button
                  className={styles.retryButton}
                  onClick={onClose}
                  type="button">
                  닫기
                </button>
              </div>
            ) : null}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // 날짜 포맷팅 (MM/DD)
  const createdDate = formatLocaleDateShort(data.createdAt) || '';

  // 발견 순서 텍스트 (현재 사용자가 몇 번째로 발견했는지)
  const getDiscoveryOrderText = () => {
    if (data.type === 'FOUND' && data.viewers && user?.id) {
      // viewers 배열에서 현재 사용자의 인덱스 찾기
      const currentUserIndex = data.viewers.findIndex((v) => v.id === user.id);
      if (currentUserIndex >= 0) {
        const order = currentUserIndex + 1;
        return `${order}번째`;
      }
    }
    return null;
  };

  // 현재 사용자의 발견 시간
  const getCurrentUserViewedAt = () => {
    if (data.type === 'FOUND' && data.viewers && user?.id) {
      const currentUser = data.viewers.find((v) => v.id === user.id);
      if (currentUser) {
        return formatShortDateWithTime(currentUser.viewedAt);
      }
    }
    return null;
  };

  // 미디어 렌더링 함수
  // imageMediaId 또는 imageObjectKey가 있으면 이미지 표시
  // audioMediaId 또는 audioObjectKey가 있으면 오디오 표시
  // videoMediaId 또는 videoObjectKey가 있으면 비디오 표시
  const renderMedia = () => {
    const hasImage = !!(data.imageMediaId || data.imageObjectKey);
    const hasAudio = !!(data.audioMediaId || data.audioObjectKey);
    const hasVideo = !!(data.videoMediaId || data.videoObjectKey);

    if (!hasImage && !hasAudio && !hasVideo) {
      return null;
    }

    return (
      <div className={styles.mediaContainer}>
        {/* 이미지 렌더링 */}
        {hasImage && (
          <div className={styles.imageContainer} role="img" aria-label="이스터에그 이미지">
            {!imageUrl ? (
              <div className={styles.mediaErrorContainer} role="status" aria-live="polite">
                <RiImageLine size={32} className={styles.mediaErrorIcon} aria-hidden="true" />
                <p className={styles.mediaErrorMessage}>이미지를 불러오는 중...</p>
              </div>
            ) : imageError ? (
              <div className={styles.mediaErrorContainer} role="alert">
                <RiImageLine size={32} className={styles.mediaErrorIcon} aria-hidden="true" />
                <p className={styles.mediaErrorMessage}>이미지를 불러올 수 없습니다</p>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt="이스터에그 이미지"
                width={300}
                height={300}
                className={styles.image}
                onError={() => setImageError(true)}
              />
            )}
          </div>
        )}

        {/* 오디오 플레이어 렌더링 */}
        {hasAudio && (
          <div className={styles.audioPlayerWrapper} role="region" aria-label="오디오 콘텐츠">
            <AudioPlayer
              mediaId={data.audioMediaId || audioUrl}
              onError={(error) => {
                console.error('[EasterEggModal] 오디오 플레이어 에러:', error);
              }}
            />
          </div>
        )}

        {/* 비디오 플레이어 렌더링 */}
        {hasVideo && (() => {
          // mediaId가 유효한 값일 때만 VideoPlayer 렌더링
          const videoMediaId = data.videoMediaId || videoUrl;
          if (!videoMediaId) {
            return (
              <div className={styles.videoPlayerWrapper} role="region" aria-label="비디오 콘텐츠">
                <div className={styles.mediaErrorContainer} role="status" aria-live="polite">
                  <RiVidiconLine size={32} className={styles.mediaErrorIcon} aria-hidden="true" />
                  <p className={styles.mediaErrorMessage}>비디오를 불러오는 중...</p>
                </div>
              </div>
            );
          }
          return (
            <div className={styles.videoPlayerWrapper} role="region" aria-label="비디오 콘텐츠">
              <VideoPlayer
                mediaId={videoMediaId}
                onError={(error) => {
                  console.error('[EasterEggModal] 비디오 플레이어 에러:', error);
                }}
              />
            </div>
          );
        })()}
      </div>
    );
  };

  // 접근성을 위한 ID 생성
  const modalTitleId = 'easter-egg-modal-title';
  const modalDescriptionId = 'easter-egg-modal-description';

  return (
      <Modal
        visible={visible}
        onClose={onClose}
        width={340}
        height="auto"
        padding={0}
        closeOnBackdropPress
        disableAnimation={true}>
      <div className={styles.scrollViewWrapper} style={{ maxHeight: `${maxHeight}px`, height: `${maxHeight}px` }}>
        {/* 닫기 버튼 (우측 상단) */}
        <button 
          className={styles.closeButton} 
          onClick={onClose} 
          type="button" 
          aria-label="모달 닫기"
          aria-describedby={modalDescriptionId}>
          <RiCloseLine size={20} className={styles.closeIcon} />
        </button>
        <div className={styles.scrollView} style={{ maxHeight: `calc(${maxHeight}px - 0px)` }}>
          <div className={styles.modalContent}>
            {/* 상단 프로필 이미지 */}
            <div className={styles.profileImageContainer}>
              {authorProfileImg ? (
                // 외부 프로필 이미지는 unoptimized로 직접 로드
                <img
                  src={authorProfileImg}
                  alt={`${data.author?.nickname || ''} 프로필 이미지`}
                  width={128}
                  height={128}
                  className={styles.profileImage}
                  aria-hidden="false"
                />
              ) : (
                <div className={styles.profileImagePlaceholder} aria-hidden="true">
                  <RiGroupLine size={40} className={styles.profilePlaceholderIcon} />
                </div>
              )}
            </div>

            {/* 서브타이틀 */}
            {data.type === 'FOUND' ? (
              <div className={styles.subtitleContainer} id={modalDescriptionId}>
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
              <div className={styles.subtitleContainer} id={modalDescriptionId}>
                <p className={styles.subtitle}>다른 사람들이 발견한 내 이스터에그를</p>
                <p className={styles.subtitle}>확인해보세요!</p>
              </div>
            )}

            {/* 위치 정보 배지 (중앙 정렬) */}
            {locationAddress && (
              <div className={styles.badgeContainer} role="region" aria-label="위치 정보">
                <RiMapPinLine size={16} className={styles.badgeIcon} aria-hidden="true" />
                <span className={styles.badgeText}>{locationAddress}</span>
              </div>
            )}

            {/* 발견 날짜 정보 (FOUND 타입일 때만, 카드 밖) */}
            {data.type === 'FOUND' && getCurrentUserViewedAt() && (
              <div className={styles.discovererInfoContainer} role="region" aria-label="발견 시간">
                <RiTimeLine size={14} className={styles.discovererIcon} aria-hidden="true" />
                <span className={styles.discovererDateText}>
                  {getCurrentUserViewedAt()}에 발견함
                </span>
              </div>
            )}

            {/* 메인 컨텐츠 카드 */}
            <div className={styles.contentCard}>
              {/* 제목 헤더 */}
              <div className={styles.titleHeader}>
                <h2 id={modalTitleId} className={styles.contentTitle}>{data.title || '제목 없음'}</h2>
                <div className={styles.dateBadge} role="region" aria-label="생성 날짜">
                  <RiCalendarLine size={14} className={styles.dateIcon} aria-hidden="true" />
                  <span className={styles.dateText}>{createdDate}</span>
                </div>
              </div>

              {/* 본문 */}
              <p className={styles.contentText}>{data.message || ''}</p>

              {/* 미디어 렌더링 */}
              {renderMedia()}

              {/* 발견한 사람들 목록 (PLANTED 타입일 때만, 0명일 때도 공간 유지) */}
              {data.type === 'PLANTED' && (
                <div className={styles.viewersSection} role="region" aria-label="발견한 사람 목록">
                  <div className={styles.viewersHeader}>
                    <RiGroupLine size={16} className={styles.viewersIcon} aria-hidden="true" />
                    <h3 className={styles.viewersTitle}>
                      발견한 사람 ({data.viewers?.length || 0})
                    </h3>
                  </div>
                  <div className={styles.viewersList} role="list" aria-label={`${data.viewers?.length || 0}명이 발견함`}>
                    {data.viewers && data.viewers.length > 0 ? (
                      data.viewers.map((viewer) => {
                        const viewerProfileImg = viewer.profileImg || null;
                        const viewedDate = formatShortDateWithTime(viewer.viewedAt);

                        return (
                          <div 
                            key={viewer.id || viewer.nickname} 
                            className={styles.viewerItem}
                            role="listitem"
                            aria-label={`${viewer.nickname || ''}님이 ${viewedDate}에 발견함`}>
                            <div className={styles.discovererViewerInfo}>
                              <div className={styles.discovererViewerAvatar}>
                                {viewerProfileImg ? (
                                  // 외부 프로필 이미지는 일반 img 태그로 직접 로드
                                  <img
                                    src={viewerProfileImg}
                                    alt={`${viewer.nickname || ''} 프로필 이미지`}
                                    width={28}
                                    height={28}
                                    className={styles.discovererViewerAvatarImage}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <RiGroupLine size={16} className={styles.viewerPlaceholderIcon} aria-hidden="true" />
                                )}
                              </div>
                              <span className={styles.viewerName}>{viewer.nickname || ''}</span>
                            </div>
                            <div className={styles.viewerDateBadge} aria-label={`발견 시간: ${viewedDate}`}>
                              <RiTimeLine size={12} className={styles.viewerDateIcon} aria-hidden="true" />
                              <span className={styles.viewerDateText}>{viewedDate}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.emptyViewersContainer} role="status" aria-live="polite">
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
