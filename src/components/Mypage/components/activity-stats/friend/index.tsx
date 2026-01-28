'use client';

/**
 * 친구 목록 컴포넌트
 * 
 * @description
 * - 마이페이지에서 '친구' 영역을 클릭했을 때 표시되는 친구 목록 화면
 * - 카카오톡 연동 친구 목록 표시
 * - 친구 삭제 기능 제공
 * - CSS Modules 기반 스타일링
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { RiRefreshLine, RiCloseLine, RiLightbulbLine, RiUserUnfollowLine, RiUserAddLine } from '@remixicon/react';
import { useFriends, useDeleteFriend, useAddFriend } from '@/commons/apis/me/friends/hooks';
import { isValidPhoneNumber, isValidEmail } from '@/components/Login/utils/validation';
import styles from './styles.module.css';

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
  const [limit] = useState(20);
  const [offset] = useState(0);
  
  // 친구 추가 폼 상태
  const [addType, setAddType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 친구 목록 조회
  const {
    data: friendsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFriends({ limit, offset });

  // 친구 삭제
  const { mutate: deleteFriendMutation, isPending: isDeleting } = useDeleteFriend();

  // 친구 추가
  const { mutate: addFriendMutation, isPending: isAdding } = useAddFriend();

  const friends = friendsData?.items || [];
  const totalFriends = friendsData?.total || 0;
  const displayedFriends = friends.length;

  const handleRefresh = () => {
    refetch();
  };

  const handleDelete = (friendshipId: string, friendNickname: string) => {
    if (window.confirm(`${friendNickname}님을 친구 목록에서 삭제하시겠습니까?`)) {
      deleteFriendMutation(friendshipId, {
        onSuccess: () => {
          // 성공 메시지는 필요시 토스트 등으로 표시 가능
        },
        onError: (error) => {
          alert(`친구 삭제 중 오류가 발생했습니다: ${error.message}`);
        },
      });
    }
  };

  const handleAddFriend = () => {
    setAddError(null);

    // 입력값 검증
    if (addType === 'phone') {
      if (!phoneNumber.trim()) {
        setAddError('전화번호를 입력해주세요.');
        return;
      }
      if (!isValidPhoneNumber(phoneNumber.trim())) {
        setAddError('올바른 전화번호 형식이 아닙니다. (예: 01012345678)');
        return;
      }
    } else {
      if (!email.trim()) {
        setAddError('이메일을 입력해주세요.');
        return;
      }
      if (!isValidEmail(email.trim())) {
        setAddError('올바른 이메일 형식이 아닙니다.');
        return;
      }
    }

    // 친구 추가 요청
    const request = addType === 'phone' 
      ? { phoneNumber: phoneNumber.trim() }
      : { email: email.trim() };

    addFriendMutation(request, {
      onSuccess: () => {
        // 성공 시 폼 초기화
        setPhoneNumber('');
        setEmail('');
        setShowAddForm(false);
        setAddError(null);
        alert('친구가 추가되었습니다.');
      },
      onError: (error) => {
        // API 오류 메시지 표시
        setAddError(error.message || '친구 추가 중 오류가 발생했습니다.');
      },
    });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setPhoneNumber('');
    setEmail('');
    setAddError(null);
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
              disabled={isRefetching || isLoading}
              aria-label="새로고침"
            >
              <RiRefreshLine 
                size={20} 
                className={`${styles.refreshIcon} ${isRefetching ? styles.spinning : ''}`} 
              />
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
            친구 목록 ({displayedFriends}/{totalFriends})
          </p>
          <div className={styles.infoBox}>
            <RiLightbulbLine size={20} className={styles.infoIcon} />
            <div className={styles.infoText}>
              <p>새로고침 시 친구 목록을 최신 상태로 동기화합니다.</p>
              <p>카카오 소셜 로그인 사용자의 경우 카카오톡 친구 목록도 함께 동기화됩니다.</p>
            </div>
          </div>
        </div>

        {/* 친구 추가 섹션 */}
        {!isLoading && !error && (
          <div className={styles.addFriendSection}>
            {!showAddForm ? (
              <button
                className={styles.addFriendButton}
                onClick={() => setShowAddForm(true)}
                aria-label="친구 추가"
              >
                <RiUserAddLine size={18} className={styles.addIcon} />
                <span className={styles.addText}>친구 추가</span>
              </button>
            ) : (
              <div className={styles.addFriendForm}>
                <div className={styles.addTypeSelector}>
                  <button
                    className={`${styles.typeButton} ${addType === 'phone' ? styles.typeButtonActive : ''}`}
                    onClick={() => {
                      setAddType('phone');
                      setAddError(null);
                    }}
                  >
                    전화번호
                  </button>
                  <button
                    className={`${styles.typeButton} ${addType === 'email' ? styles.typeButtonActive : ''}`}
                    onClick={() => {
                      setAddType('email');
                      setAddError(null);
                    }}
                  >
                    이메일
                  </button>
                </div>
                <div className={styles.addInputGroup}>
                  <input
                    type={addType === 'phone' ? 'tel' : 'email'}
                    inputMode={addType === 'phone' ? 'numeric' : 'email'}
                    value={addType === 'phone' ? phoneNumber : email}
                    onChange={(e) => {
                      if (addType === 'phone') {
                        setPhoneNumber(e.target.value);
                      } else {
                        setEmail(e.target.value);
                      }
                      setAddError(null);
                    }}
                    placeholder={addType === 'phone' ? '01012345678' : 'example@email.com'}
                    className={`${styles.addInput} ${addError ? styles.addInputError : ''}`}
                    disabled={isAdding}
                    aria-label={addType === 'phone' ? '전화번호' : '이메일'}
                  />
                  {addError && (
                    <span className={styles.addError} role="alert">
                      {addError}
                    </span>
                  )}
                </div>
                <div className={styles.addButtonGroup}>
                  <button
                    className={styles.addSubmitButton}
                    onClick={handleAddFriend}
                    disabled={isAdding}
                    aria-label="추가"
                  >
                    {isAdding ? '추가 중...' : '추가'}
                  </button>
                  <button
                    className={styles.addCancelButton}
                    onClick={handleCancelAdd}
                    disabled={isAdding}
                    aria-label="취소"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <p>친구 목록을 불러오는 중...</p>
          </div>
        )}

        {/* 오류 상태 */}
        {error && !isLoading && (
          <div className={styles.errorContainer}>
            <p>친구 목록을 불러오는 중 오류가 발생했습니다.</p>
            <p className={styles.errorMessage}>{error.message}</p>
            <button onClick={() => refetch()} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        )}

        {/* 친구 목록 */}
        {!isLoading && !error && (
          <div className={styles.friendList}>
            {friends.length === 0 ? (
              <div className={styles.emptyContainer}>
                <p>친구가 없습니다.</p>
                <p className={styles.emptySubtext}>전화번호나 이메일로 친구를 추가해보세요.</p>
              </div>
            ) : (
              friends.map((friendship) => (
                <div key={friendship.id} className={styles.friendItem}>
                  <div className={styles.friendAvatar}>
                    {friendship.friend.profileImg ? (
                      <Image
                        src={friendship.friend.profileImg}
                        alt={friendship.friend.nickname}
                        width={48}
                        height={48}
                        className={styles.friendProfileImg}
                        unoptimized
                      />
                    ) : (
                      <span className={styles.friendEmoji}>
                        {friendship.friend.nickname.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className={styles.friendName}>{friendship.friend.nickname}</span>
                  <button
                    className={styles.blockButton}
                    onClick={() => handleDelete(friendship.id, friendship.friend.nickname)}
                    disabled={isDeleting}
                    aria-label={`${friendship.friend.nickname} 삭제`}
                  >
                    <RiUserUnfollowLine size={16} className={styles.blockIcon} />
                    <span className={styles.blockText}>삭제</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 새로고침 중 표시 */}
        {isRefetching && !isLoading && (
          <div className={styles.refreshingIndicator}>
            <p>새로고침 중...</p>
          </div>
        )}

        {/* 버전 정보 */}
        <div className={styles.versionInfo}>
          VERSION 1.0.0 © 2024
        </div>
      </div>
    </div>
  );
}

export default FriendList;
