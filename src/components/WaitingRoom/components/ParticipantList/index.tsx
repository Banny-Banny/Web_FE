'use client';

/**
 * @fileoverview ParticipantList 컴포넌트
 * @description 참여자 목록을 표시하는 컴포넌트 (앱 버전 기준)
 * 
 * @version 1.0.0
 * @created 2026-01-28
 * @updated 2026-01-28 - 앱 버전 기준으로 로직 및 스타일 수정
 * 
 * 규칙 준수 체크리스트:
 * - [x] CSS Module 사용
 * - [x] CSS 변수만 사용 (하드코딩 색상값 없음)
 * - [x] 인라인 스타일 없음
 * - [x] 구조와 스타일 분리
 * - [x] 소수점 값 반올림
 */

import React from 'react';
import {
  RiUserLine,
  RiShareLine,
} from '@remixicon/react';
import { Button } from '@/commons/components/button';
import type { ParticipantListProps } from './types';
import styles from './styles.module.css';

/**
 * ParticipantList 컴포넌트
 * 
 * 앱 버전 기준 참여자 목록을 표시합니다.
 * - 참여자 목록 섹션 제목
 * - 내 참여자 항목 (검은 테두리, 작성 상태 표시)
 * - 다른 참여자 항목 (회색 배경)
 * - 빈 참여자 슬롯 (초대 안내)
 * 
 * @param {ParticipantListProps} props - ParticipantList 컴포넌트의 props
 */
export function ParticipantList({
  participants,
  currentHeadcount,
  maxHeadcount,
  currentUserId,
  currentUserName,
  isMyContentSaved,
  isHost = false,
  onInviteFriend,
  onWriteMyContent,
  onFinalSubmit,
}: ParticipantListProps) {
  // participants가 없으면 빈 배열로 대체
  const safeParticipants = participants ?? [];

  // 빈 슬롯 개수 계산 (음수 방지)
  const emptySlotsCount = Math.max(0, maxHeadcount - currentHeadcount);

  // 내 참여자 찾기 (현재 로그인 유저 기준)
  const myParticipant = safeParticipants.find((p) => {
    const normalize = (value?: string) => (value ?? '').trim().toLowerCase();
    if (currentUserId && normalize(p.userId) === normalize(currentUserId)) return true;
    if (currentUserName && p.userName && normalize(p.userName) === normalize(currentUserName)) return true;
    return false;
  });

  // 다른 참여자들
  const otherParticipants = safeParticipants.filter(
    (p) => p.participantId !== myParticipant?.participantId
  );

  // 참여자 카드 렌더링 함수 (앱 버전 기준)
  const renderParticipantCard = (participant: typeof safeParticipants[0], isMe: boolean) => {
    const hasContent = participant.hasContent ?? false;
    // 내 컨텐츠는 my-content로 계산된 값을 우선 사용 (서버 hasContent가 늦게 반영될 수 있음)
    const isCompleted = isMe ? Boolean(isMyContentSaved) || hasContent : hasContent;
    const isRejected = participant.status === 'REJECTED';
    // 본인 카드는 항상 클릭 가능 (작성 완료 후에도 조회 가능)
    const isEditable = isMe && onWriteMyContent && !isRejected;

    const statusText = (() => {
      if (isRejected) return '참여 불가';
      if (isCompleted) return '작성 완료';
      if (isMe) return '클릭하여 작성하기';
      return '작성 대기 중';
    })();

    const statusClassName = (() => {
      if (isRejected) return styles.statusWaiting;
      if (isCompleted) return styles.statusCompleted;
      return styles.statusPending;
    })();

    const checkboxClassName = (() => {
      if (isCompleted) return styles.checkboxChecked;
      if (isMe && !isRejected) return styles.checkboxActive;
      return styles.checkboxInactive;
    })();

    const avatarClassName = isMe || isCompleted
      ? `${styles.participantAvatar} ${styles.participantAvatarActive}`
      : styles.participantAvatar;
    
    // 본인 카드
    if (isMe) {
      // 클릭 핸들러: 항상 설정하되 내부에서 체크
      // 작성 완료 후에도 조회 가능하도록 항상 클릭 가능하게 함
      const handleClick = () => {
        // REJECTED 상태가 아니고 onWriteMyContent가 있으면 실행
        if (!isRejected && onWriteMyContent) {
          onWriteMyContent();
        }
      };

      return (
        <button
          key={participant.participantId}
          type="button"
          className={styles.participantCardMe}
          onClick={handleClick}
          aria-label={isCompleted ? '내 글 조회/수정하기' : '내 글 작성하기'}
        >
          <div className={styles.participantInfo}>
            <div className={avatarClassName}>
              {participant.userAvatarUrl ? (
                <img
                  src={participant.userAvatarUrl}
                  alt={participant.userName || '나'}
                  className={styles.avatarImage}
                />
              ) : (
                <RiUserLine className={styles.avatarIcon} size={24} />
              )}
            </div>
            <div className={styles.participantDetails}>
              <div className={styles.participantNameRow}>
                <span className={styles.participantName}>
                  {participant.userName || '나'}
                </span>
              </div>
              <span className={`${styles.participantStatus} ${statusClassName}`}>
                {statusText}
              </span>
            </div>
          </div>
          <div className={`${styles.checkbox} ${checkboxClassName}`}>
            {isCompleted && <span className={styles.checkboxCheckmark}>✓</span>}
          </div>
        </button>
      );
    }

    // 다른 참여자 카드 (클릭 불가)
    return (
      <div
        key={participant.participantId}
        className={styles.participantCardOther}
      >
        <div className={styles.participantInfo}>
          <div className={avatarClassName}>
            {participant.userAvatarUrl ? (
              <img
                src={participant.userAvatarUrl}
                alt={participant.userName || '참여자'}
                className={styles.avatarImage}
              />
            ) : (
              <RiUserLine className={styles.avatarIcon} size={24} />
            )}
          </div>
          <div className={styles.participantDetails}>
            <div className={styles.participantNameRow}>
              <span className={styles.participantName}>
                {participant.userName || '참여자'}
              </span>
            </div>
            <span className={`${styles.participantStatus} ${statusClassName}`}>
              {statusText}
            </span>
          </div>
        </div>
        <div className={`${styles.checkbox} ${checkboxClassName}`}>
          {isCompleted && <span className={styles.checkboxCheckmark}>✓</span>}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 섹션 제목 */}
      <h2 className={styles.sectionTitle}>참여자 목록</h2>

      <div className={styles.list}>
        {/* 내 참여자 항목 */}
        {myParticipant && renderParticipantCard(myParticipant, true)}

        {/* 다른 참여자들 */}
        {otherParticipants.map((participant) => 
          renderParticipantCard(participant, false)
        )}

        {/* 빈 슬롯들 */}
        {Array.from({ length: emptySlotsCount }).map((_, index) => (
          <div key={`empty-slot-${index}`} className={styles.emptySlot}>
            <div className={styles.participantInfo}>
              <div className={styles.participantAvatar}>
                <RiUserLine className={styles.avatarIcon} size={24} />
              </div>
              <div className={styles.participantDetails}>
                <span className={styles.emptySlotText}>
                  {isHost ? '친구를 초대해 남은 슬롯을 채워주세요!' : '친구를 기다리는 중...'}
                </span>
              </div>
            </div>
            {isHost && onInviteFriend && (
              <button
                type="button"
                className={styles.inviteButton}
                onClick={onInviteFriend}
                aria-label="친구 초대하기"
              >
                <RiShareLine size={24} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 방장 전용 최종 제출 버튼 */}
      {isHost && onFinalSubmit && (
        <div className={styles.submitButtonContainer}>
          <Button
            label="최종 제출"
            variant="primary"
            size="M"
            fullWidth
            onPress={onFinalSubmit}
            aria-label="최종 제출하기"
          />
        </div>
      )}
    </div>
  );
}
