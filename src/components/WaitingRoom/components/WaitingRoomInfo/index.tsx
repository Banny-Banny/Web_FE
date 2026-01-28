'use client';

/**
 * @fileoverview WaitingRoomInfo 컴포넌트
 * @description 대기실 정보 및 캡슐 설정 정보를 표시하는 컴포넌트
 * 
 * @version 1.0.0
 * @created 2026-01-28
 * @updated 2026-01-28 - Figma 디자인 기반으로 재구현
 * 
 * 규칙 준수 체크리스트:
 * - [x] CSS Module 사용
 * - [x] CSS 변수만 사용 (하드코딩 색상값 없음)
 * - [x] 인라인 스타일 없음
 * - [x] 구조와 스타일 분리
 * - [x] 소수점 값 반올림
 */

import React from 'react';
import { RiCalendarLine, RiGroupLine } from '@remixicon/react';
import type { WaitingRoomInfoProps } from './types';
import { formatOpenDate } from '@/commons/utils/waiting-room';
import styles from './styles.module.css';

/**
 * WaitingRoomInfo 컴포넌트
 * 
 * Figma 디자인 기반 대기실 정보 카드를 표시합니다.
 * - 캡슐 이름 레이블 및 이름
 * - 개봉일 (달력 아이콘 + 날짜)
 * - 참여자 수 (그룹 아이콘 + 인원수)
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

  // 날짜 포맷팅: "2026.01.16" 형식
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formattedOpenDate = formatDateForDisplay(openDate);
  const participantCount = `${waitingRoom.currentHeadcount}명`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* 캡슐 이름 레이블 */}
        <div className={styles.capsuleNameLabel}>캡슐 이름</div>
        
        {/* 캡슐 이름 */}
        <h1 className={styles.capsuleName}>{capsuleName}</h1>

        {/* 정보 섹션 */}
        <div className={styles.infoSection}>
          {/* 개봉일 */}
          <div className={styles.infoItem}>
            <RiCalendarLine className={styles.infoIcon} size={16} />
            <span className={styles.infoLabel}>개봉일</span>
            <span className={styles.infoValue}>{formattedOpenDate}</span>
          </div>

          {/* 참여자 */}
          <div className={styles.infoItem}>
            <RiGroupLine className={styles.infoIcon} size={16} />
            <span className={styles.infoLabel}>참여자</span>
            <span className={styles.infoValue}>{participantCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
