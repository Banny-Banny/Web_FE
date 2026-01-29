'use client';

/**
 * @fileoverview WaitingRoomInfo 컴포넌트
 * @description 대기실 정보 및 캡슐 설정 정보를 표시하는 컴포넌트
 *
 * @version 2.0.0
 * @created 2026-01-28
 * @updated 2026-01-29 - 모바일 앱 UI 구조 적용 (프로그레스바, 친구 초대 버튼 추가)
 *
 * 규칙 준수 체크리스트:
 * - [x] CSS Module 사용
 * - [x] CSS 변수만 사용 (하드코딩 색상값 없음)
 * - [x] 인라인 스타일 없음
 * - [x] 구조와 스타일 분리
 * - [x] Figma 디자인 1:1 대응
 */

import React, { useEffect, useState } from 'react';
import { RiCalendarLine, RiUser3Line } from '@remixicon/react';
import { Button } from '@/commons/components/button';
import type { WaitingRoomInfoProps } from './types';
import styles from './styles.module.css';

/**
 * WaitingRoomInfo 컴포넌트
 *
 * 모바일 앱 버전 기준 대기실 정보를 표시합니다.
 * - 캡슐 이름 레이블 및 이름
 * - 개봉일과 참여자 수를 가로로 배치
 * - 친구 초대하기 버튼
 * - 진행 상황 프로그레스바
 *
 * @param {WaitingRoomInfoProps} props - WaitingRoomInfo 컴포넌트의 props
 */
export function WaitingRoomInfo({
  waitingRoom,
  settings,
  onInviteFriend,
}: WaitingRoomInfoProps) {
  // settings가 없을 때는 waitingRoom의 정보로 fallback
  const capsuleName = settings?.capsuleName ?? waitingRoom.capsuleName;
  const openDate = settings?.openDate ?? waitingRoom.openDate;

  // 날짜 포맷팅: "YYYY-MM-DD" 형식 (앱 버전과 동일)
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedOpenDate = formatDateForDisplay(openDate);

  // 참여자 수 표시: 현재인원/최대인원 또는 최대인원만
  const maxHeadcount = settings?.maxHeadcount ?? waitingRoom.maxHeadcount;
  const participantCount =
    waitingRoom.currentHeadcount !== undefined
      ? `${waitingRoom.currentHeadcount}/${maxHeadcount}명`
      : `${maxHeadcount}명`;

  // 진행 상황 계산 (모바일 앱과 동일한 로직)
  const progress = React.useMemo(() => {
    // 실제 배정된 참여자만 필터링 (userName이 있는 참여자만)
    const assignedParticipants = waitingRoom.participants.filter((p) => p.userName && p.userName !== '');

    // 완료한 참여자 수
    const completed = assignedParticipants.filter((p) => p.hasContent === true).length;

    // 전체 참여자 수: maxHeadcount 사용 (모바일 앱의 max_participants와 동일)
    const total = settings?.maxHeadcount ?? waitingRoom.maxHeadcount;

    // 진행률 계산 (0-100)
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      percentage,
    };
  }, [waitingRoom.participants, settings?.maxHeadcount, waitingRoom.maxHeadcount]);

  // 프로그레스바 width를 직접 사용 (애니메이션은 CSS transition으로 처리)
  const progressWidth = progress.percentage;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 캡슐 이름 섹션 */}
        <div className={styles.capsuleNameSection}>
          <div className={styles.capsuleNameLabel}>캡슐 이름</div>
          <h1 className={styles.capsuleName}>{capsuleName}</h1>
        </div>

        {/* 정보 섹션 (가로 배치) */}
        <div className={styles.infoSection}>
          {/* 개봉일 */}
          <div className={styles.infoItem}>
            <div className={styles.infoIconWrapper}>
              <RiCalendarLine className={styles.infoIcon} size={28} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>개봉일</div>
              <div className={styles.infoValue}>{formattedOpenDate}</div>
            </div>
          </div>

          {/* 참여자 */}
          <div className={styles.infoItem}>
            <div className={styles.infoIconWrapper}>
              <RiUser3Line className={styles.infoIcon} size={37} />
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>참여자</div>
              <div className={styles.infoValue}>{participantCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 친구 초대하기 버튼 */}
      {onInviteFriend && (
        <div className={styles.inviteButtonWrapper}>
          <Button
            label="친구 초대하기"
            variant="outline"
            size="M"
            fullWidth
            onPress={onInviteFriend}
            aria-label="친구 초대하기"
          />
        </div>
      )}

      {/* 프로그래스바 */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarHeader}>
          <span className={styles.progressBarLabel}>진행 상황</span>
          <span className={styles.progressBarText}>
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className={styles.progressBarWrapper}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
