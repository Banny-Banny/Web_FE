'use client';

/**
 * 친구 목록 컴포넌트
 * 
 * @description
 * - 마이페이지에서 '친구' 영역을 클릭했을 때 표시되는 친구 목록 화면
 * - 카카오톡 연동 친구 목록 표시
 * - 친구 차단 기능 제공
 * - CSS Modules 기반 스타일링
 */

import React from 'react';
import { RiRefreshLine, RiCloseLine, RiLightbulbLine, RiUserUnfollowLine } from '@remixicon/react';
import styles from './styles.module.css';

/**
 * 친구 정보 타입
 */
interface Friend {
  id: string;
  name: string;
  emoji: string;
}

/**
 * FriendList 컴포넌트 Props
 */
interface FriendListProps {
  className?: string;
  onClose?: () => void;
}

/**
 * FriendList 컴포넌트
 * 
 * @param {FriendListProps} props - 컴포넌트 props
 */
export function FriendList({ className = '', onClose }: FriendListProps) {
  // 임시 친구 목록 데이터 (실제로는 props나 API에서 받아올 것)
  const friends: Friend[] = [
    { id: '1', name: '김민수', emoji: '🐨' },
    { id: '2', name: '이지은', emoji: '🐼' },
    { id: '3', name: '최유나', emoji: '🐯' },
    { id: '4', name: '정우성', emoji: '🐰' },
    { id: '5', name: '한지민', emoji: '🐶' },
  ];

  const totalFriends = 6;
  const displayedFriends = friends.length;

  const handleRefresh = () => {
    // 새로고침 로직
  };

  const handleBlock = (_friendId: string) => {
    // 차단 로직
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 모달 오버레이 */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* 모달 컨테이너 */}
      <div className={styles.modal}>
        {/* 모달 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>친구 관리</h2>
          <div className={styles.headerRight}>
            <button 
              className={styles.refreshButton} 
              onClick={handleRefresh}
              aria-label="새로고침"
            >
              <RiRefreshLine size={20} className={styles.refreshIcon} />
            </button>
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              aria-label="닫기"
            >
              <RiCloseLine size={20} className={styles.closeIcon} />
            </button>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className={styles.infoSection}>
          <p className={styles.friendCount}>
            카카오톡 연동 친구 목록 ({displayedFriends}/{totalFriends})
          </p>
          <div className={styles.infoBox}>
            <RiLightbulbLine size={20} className={styles.infoIcon} />
            <div className={styles.infoText}>
              <p>새로고침 시 카카오톡 친구 목록을 다시 불러옵니다.</p>
              <p>차단한 친구는 새로고침 후에도 차단 상태가 유지됩니다.</p>
            </div>
          </div>
        </div>

        {/* 친구 목록 */}
        <div className={styles.friendList}>
          {friends.map((friend) => (
            <div key={friend.id} className={styles.friendItem}>
              <div className={styles.friendAvatar}>
                <span className={styles.friendEmoji}>{friend.emoji}</span>
              </div>
              <span className={styles.friendName}>{friend.name}</span>
              <button
                className={styles.blockButton}
                onClick={() => handleBlock(friend.id)}
                aria-label={`${friend.name} 차단`}
              >
                <RiUserUnfollowLine size={16} className={styles.blockIcon} />
                <span className={styles.blockText}>차단</span>
              </button>
            </div>
          ))}
        </div>

        {/* 버전 정보 */}
        <div className={styles.versionInfo}>
          VERSION 1.0.0 © 2024
        </div>
      </div>
    </div>
  );
}

export default FriendList;
