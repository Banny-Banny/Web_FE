'use client';

/**
 * @fileoverview WaitingRoom 메인 컨테이너 컴포넌트
 * @description 대기실 페이지의 최상위 컨테이너
 * 
 * @version 1.0.0
 * @created 2026-01-28
 * @updated 2026-01-28 - Figma 디자인 기반으로 재구현, ParticipantList 통합
 * 
 * @note
 * Phase 6에서 실제 API 호출로 교체됩니다.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimeCapsuleHeader } from '@/commons/components/timecapsule-header';
import { Spinner } from '@/commons/components/spinner';
import { useAuthState } from '@/commons/hooks/useAuth';
import { useMyContent } from '@/commons/apis/capsules/step-rooms/hooks/useMyContent';
import { WaitingRoomInfo } from './components/WaitingRoomInfo';
import { ParticipantList } from './components/ParticipantList';
import { ContentWriteBottomSheet } from './components/ContentWriteBottomSheet';
import { useWaitingRoom } from './hooks/useWaitingRoom';
import styles from './styles.module.css';
import type { WaitingRoomPageProps } from './types';

/**
 * WaitingRoom 컴포넌트
 * 
 * 대기실 페이지의 메인 컨테이너입니다.
 * - 대기실 정보 조회 및 표시
 * - 참여자 목록 표시
 * - 로딩 상태 표시
 * - 에러 처리 및 사용자 안내
 * 
 * @param {WaitingRoomPageProps} props - WaitingRoom 컴포넌트의 props
 */
export function WaitingRoom({ capsuleId }: { capsuleId: string }) {
  const router = useRouter();
  const { state, waitingRoom, settings, isLoading, error } =
    useWaitingRoom(capsuleId);
  const { user } = useAuthState();
  const [isContentWriteOpen, setIsContentWriteOpen] = useState(false);
  const [isMyContentJustSaved, setIsMyContentJustSaved] = useState(false);

  const { data: myContent } = useMyContent(user?.id ? capsuleId : null);
  const isMyContentSavedFromServer = Boolean(
    (myContent?.text ?? '').trim().length > 0 ||
      (myContent?.images?.length ?? 0) > 0 ||
      !!myContent?.music ||
      !!myContent?.video
  );

  // 서버 응답 외에, 방금 저장 완료된 상태를 즉시 반영하기 위한 플래그
  const isMyContentSaved = isMyContentJustSaved || isMyContentSavedFromServer;

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const handleInviteFriend = () => {
    // TODO: Phase 6에서 실제 초대 기능 구현
    console.log('친구 초대하기');
  };

  const handleWriteMyContent = () => {
    // 다시 열 때도 이미 작성 완료 상태는 유지
    setIsContentWriteOpen(true);
  };

  const handleFinalSubmit = () => {
    // TODO: 대기실 이후 단계(타임캡슐 최종 생성/제출) 연결 시 구현
    console.log('최종제출');
  };

  const handleContentWriteClose = () => {
    setIsContentWriteOpen(false);
  };

  const handleContentSaved = () => {
    // 저장 성공 시 즉시 "작성 완료"로 표시되도록 플래그 설정
    setIsMyContentJustSaved(true);
  };

  return (
    <div className={styles.container}>
      <TimeCapsuleHeader
        title="캡슐 대기실"
        onBack={handleBack}
        rightIcons={[
          {
            icon: 'close',
            onPress: handleClose,
            accessibilityLabel: '닫기',
          },
        ]}
        titleAlign="left"
      />

      <div className={styles.content}>
        {isLoading && <Spinner size="large" fullScreen={true} />}

        {state.status === 'error' && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>
              {error || '대기실 정보를 불러오는 중 오류가 발생했습니다.'}
            </p>
          </div>
        )}

        {state.status === 'success' && waitingRoom && (
          <>
            <WaitingRoomInfo waitingRoom={waitingRoom} settings={settings} />
            <ParticipantList
              participants={waitingRoom.participants}
              currentHeadcount={waitingRoom.currentHeadcount}
              maxHeadcount={settings?.maxHeadcount ?? waitingRoom.maxHeadcount}
              currentUserId={user?.id}
              currentUserName={user?.nickname}
              isMyContentSaved={isMyContentSaved}
              onInviteFriend={handleInviteFriend}
              onWriteMyContent={handleWriteMyContent}
              onFinalSubmit={handleFinalSubmit}
            />
          </>
        )}
      </div>

      {state.status === 'success' && (
        <ContentWriteBottomSheet
          isOpen={isContentWriteOpen}
          onClose={handleContentWriteClose}
          onSaved={handleContentSaved}
          capsuleId={capsuleId}
          settings={settings}
        />
      )}
    </div>
  );
}
