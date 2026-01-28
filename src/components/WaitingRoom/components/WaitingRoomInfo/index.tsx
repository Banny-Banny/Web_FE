'use client';

/**
 * @fileoverview WaitingRoomInfo 컴포넌트
 * @description 대기실 정보 및 캡슐 설정 정보를 표시하는 컴포넌트
 * 
 * @version 1.0.0
 * @created 2026-01-28
 * @updated 2026-01-28 - 앱 버전 기준으로 레이아웃 수정 (개봉일/참여자 가로 배치)
 * 
 * 규칙 준수 체크리스트:
 * - [x] CSS Module 사용
 * - [x] CSS 변수만 사용 (하드코딩 색상값 없음)
 * - [x] 인라인 스타일 없음
 * - [x] 구조와 스타일 분리
 * - [x] 소수점 값 반올림
 */

import React from 'react';
import { RiCalendarLine, RiUser3Line } from '@remixicon/react';
import type { WaitingRoomInfoProps } from './types';
import styles from './styles.module.css';

/**
 * WaitingRoomInfo 컴포넌트
 * 
 * 앱 버전 기준 대기실 정보 카드를 표시합니다.
 * - 캡슐 이름 레이블 및 이름
 * - 개봉일과 참여자 수를 가로로 배치 (앱 버전과 동일)
 * 
 * @param {WaitingRoomInfoProps} props - WaitingRoomInfo 컴포넌트의 props
 */
export function WaitingRoomInfo({
  waitingRoom,
  settings,
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 캡슐 이름 레이블 */}
        <div className={styles.capsuleNameLabel}>캡슐 이름</div>
        
        {/* 캡슐 이름 */}
        <h1 className={styles.capsuleName}>{capsuleName}</h1>

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
    </div>
  );
}
