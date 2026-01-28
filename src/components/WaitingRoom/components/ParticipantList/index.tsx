'use client';

/**
 * @fileoverview ParticipantList 컴포넌트
 * @description 참여자 목록을 표시하는 컴포넌트
 * 
 * @version 1.0.0
 * @created 2026-01-28
 * 
 * 규칙 준수 체크리스트:
 * - [x] CSS Module 사용
 * - [x] CSS 변수만 사용 (하드코딩 색상값 없음)
 * - [x] 인라인 스타일 없음
 * - [x] 구조와 스타일 분리
 * - [x] 소수점 값 반올림
 */

import React from 'react';
import { RiUserLine, RiShareLine } from '@remixicon/react';
import type { ParticipantListProps } from './types';
import { getParticipantRoleText } from '@/commons/utils/waiting-room';
import styles from './styles.module.css';

/**
 * ParticipantList 컴포넌트
 * 
 * Figma 디자인 기반 참여자 목록을 표시합니다.
 * - 참여자 목록 섹션 제목
 * - 내 참여자 항목 (강조된 디자인, 왕관 이모지, 작성하기 링크)
 * - 빈 참여자 슬롯 (초대 안내)
 * 
 * @param {ParticipantListProps} props - ParticipantList 컴포넌트의 props
 */
export function ParticipantList({
  participants,
  currentHeadcount,
  maxHeadcount,
  currentUserId,
  onInviteFriend,
  onWriteMyContent,
}: ParticipantListProps) {
  // participants가 없으면 빈 배열로 대체
  const safeParticipants = participants ?? [];

  // 빈 슬롯 개수 계산 (음수 방지)
  const emptySlotsCount = Math.max(0, maxHeadcount - currentHeadcount);

  // 내 참여자 찾기
  const myParticipant = currentUserId
    ? safeParticipants.find((p) => p.userId === currentUserId)
    : safeParticipants.find((p) => p.role === 'HOST');

  // 다른 참여자들
  const otherParticipants = safeParticipants.filter(
    (p) => p.participantId !== myParticipant?.participantId
  );

  return (
    <div className={styles.container}>
      {/* 섹션 제목 */}
      <h2 className={styles.sectionTitle}>참여자 목록</h2>

      <div className={styles.list}>
        {/* 내 참여자 항목 */}
        {myParticipant && (
          <div className={styles.myParticipantItem}>
            <div className={styles.participantAvatar}>
              {myParticipant.userAvatarUrl ? (
                <img
                  src={myParticipant.userAvatarUrl}
                  alt={myParticipant.userName || '나'}
                  className={styles.avatarImage}
                />
              ) : (
                <RiUserLine className={styles.avatarIcon} size={24} />
              )}
            </div>
            <div className={styles.participantInfo}>
              <div className={styles.participantNameRow}>
                <span className={styles.participantName}>
                  나 ({myParticipant.userName})
                </span>
                {myParticipant.role === 'HOST' && (
                  <span className={styles.crownIcon}>👑</span>
                )}
              </div>
              {onWriteMyContent && (
                <button
                  type="button"
                  className={styles.writeButton}
                  onClick={onWriteMyContent}
                  aria-label="내 글 작성하기"
                >
                  클릭하여 작성하기
                </button>
              )}
            </div>
            <div className={styles.checkboxPlaceholder} />
          </div>
        )}

        {/* 다른 참여자들 */}
        {otherParticipants.map((participant) => (
          <div key={participant.participantId} className={styles.participantItem}>
            <div className={styles.participantAvatar}>
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
            <div className={styles.participantInfo}>
              <span className={styles.participantName}>
                {participant.userName}
                {participant.role === 'HOST' && (
                  <span className={styles.hostBadge}>
                    {getParticipantRoleText(participant.role)}
                  </span>
                )}
              </span>
            </div>
            <div className={styles.checkboxPlaceholder} />
          </div>
        ))}

        {/* 빈 슬롯들 */}
        {Array.from({ length: emptySlotsCount }).map((_, index) => (
          <div key={`empty-slot-${index}`} className={styles.emptySlot}>
            <div className={styles.participantAvatar}>
              <RiUserLine className={styles.avatarIcon} size={24} />
            </div>
            <div className={styles.emptySlotInfo}>
              <span className={styles.emptySlotText}>
                친구를 초대해 남은 슬롯을 채워주세요!
              </span>
            </div>
            {onInviteFriend && (
              <button
                type="button"
                className={styles.inviteButton}
                onClick={onInviteFriend}
                aria-label="친구 초대하기"
              >
                <RiShareLine size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
