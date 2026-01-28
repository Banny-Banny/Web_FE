/**
 * app/(main)/room/join/page.tsx
 * 타임캡슐 대기실 초대 참여 페이지
 *
 * 케이스 1: 딥링크 초대 (invite_code 파라미터)
 *   - URL 형식: /room/join?invite_code=ABC123
 *   - 플로우: invite_code → queryRoomByInviteCode() → joinRoom() → 대기실 입장 (guest)
 *
 * 케이스 2: 내 캡슐에서 입장 (capsuleId 파라미터)
 *   - URL 형식: /room/join?capsuleId=xxx-xxx-xxx
 *   - 플로우: capsuleId → 대기실 입장 (host)
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@/commons/hooks/useAuth';
import { useInviteCodeQuery } from '@/commons/apis/capsules/step-rooms/hooks';
import { useJoinRoom } from '@/commons/apis/capsules/step-rooms/hooks';
import styles from './styles.module.css';

const PENDING_INVITE_CODE_KEY = 'pending_invite_code';

export default function RoomJoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthState();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capsuleId, setCapsuleId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [role, setRole] = useState<'host' | 'guest'>('guest');

  // 참여 시도 중복 방지
  const joinAttemptedRef = useRef(false);

  // 초대 코드로 방 정보 조회
  const { data: roomData, isError: isRoomQueryError, error: roomQueryError } = useInviteCodeQuery(inviteCode);

  // 방 참여 mutation
  const joinRoomMutation = useJoinRoom();

  // URL 파라미터 추출 및 로그인 상태 처리
  useEffect(() => {
    console.log('🔍 [RoomJoin] URL 파라미터 추출 시작');
    
    const directCapsuleId = searchParams.get('capsuleId');
    let code = searchParams.get('invite_code');

    console.log('🔍 [RoomJoin] 파라미터:', { directCapsuleId, code, isAuthLoading, isAuthenticated });

    // 케이스 1: 내 캡슐에서 입장 (capsuleId 직접 전달)
    if (directCapsuleId) {
      console.log('✅ [RoomJoin] 케이스 1: 내 캡슐에서 입장');
      setCapsuleId(directCapsuleId);
      setRole('host');
      setIsLoading(false);
      return;
    }

    // URL에 초대 코드가 없지만 로컬스토리지에 저장된 초대 코드가 있는 경우
    // (로그인 후 다시 /room/join으로 돌아온 경우)
    if (!code && typeof window !== 'undefined') {
      const pendingCode = localStorage.getItem(PENDING_INVITE_CODE_KEY);
      console.log('🔍 [RoomJoin] 로컬스토리지 초대 코드 확인:', { pendingCode });
      
      if (pendingCode) {
        console.log('✅ [RoomJoin] LocalStorage에서 초대 코드 복원:', pendingCode);
        code = pendingCode;
        localStorage.removeItem(PENDING_INVITE_CODE_KEY);
      }
    }

    // 케이스 2: 딥링크 초대 (invite_code로 조회)
    if (code) {
      console.log('✅ [RoomJoin] 케이스 2: 초대 코드로 입장:', code);
      setInviteCode(code);
      setRole('guest');

      // 인증 로딩이 끝날 때까지 대기
      if (isAuthLoading) {
        console.log('⏳ [RoomJoin] 인증 로딩 중...');
        return;
      }

      // 토큰 확인 - 없으면 초대 코드 저장 후 로그인으로 리다이렉트
      if (!isAuthenticated) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(PENDING_INVITE_CODE_KEY, code);
          console.log('✅ [RoomJoin] LocalStorage에 초대 코드 저장 후 로그인으로 이동:', code);
          router.replace('/login');
        }
        return;
      }

      // 토큰이 있으면 초대 코드로 대기실 조회 진행
      // (useInviteCodeQuery가 자동으로 조회)
      console.log('✅ [RoomJoin] 로그인 상태 확인됨, 대기실 조회 시작');
      return;
    }

    // 파라미터가 없는 경우
    if (!isAuthLoading) {
      console.error('❌ [RoomJoin] 초대 코드 또는 캡슐 ID 없음');
      setError('초대 코드 또는 캡슐 ID가 없습니다.');
      setIsLoading(false);
    }
  }, [searchParams, isAuthenticated, isAuthLoading, router]);

  // 방 정보 조회 결과 처리
  useEffect(() => {
    if (!inviteCode || !isAuthenticated) return;

    if (roomData && !joinAttemptedRef.current) {
      // 방 정보 조회 성공 - 자동으로 참여 시도 (한 번만)
      joinAttemptedRef.current = true;
      const foundCapsuleId = roomData.room_id;

      joinRoomMutation.mutate(
        { capsuleId: foundCapsuleId, invite_code: inviteCode },
        {
          onSuccess: (data) => {
            // 참여 성공 - 서버 상태 동기화를 위해 짧은 딜레이 후 대기실로 이동
            setCapsuleId(foundCapsuleId);
            setIsLoading(false);
            
            // 서버가 참여 상태를 반영할 시간을 주기 위해 500ms 대기
            setTimeout(() => {
              router.push(`/waiting-room/${foundCapsuleId}`);
            }, 500);
          },
          onError: (err: any) => {
            // 409 ALREADY_JOINED 에러도 성공으로 처리
            if (err?.status === 409) {
              // 이미 참여한 경우에도 딜레이 추가
              setTimeout(() => {
                router.push(`/waiting-room/${foundCapsuleId}`);
              }, 500);
              return;
            }

            setError(err?.message || '대기실에 참여할 수 없습니다.');
            setIsLoading(false);
          },
        }
      );
    }

    if (isRoomQueryError) {
      setError('대기실 정보를 불러올 수 없습니다. 초대 코드를 확인해주세요.');
      setIsLoading(false);
    }
  }, [roomData, isRoomQueryError, inviteCode, isAuthenticated, joinRoomMutation, router]);

  // 내 캡슐에서 입장하는 경우 (호스트)
  useEffect(() => {
    if (role === 'host' && capsuleId && !isLoading) {
      router.push(`/waiting-room/${capsuleId}`);
    }
  }, [role, capsuleId, isLoading, router]);

  // 로딩 중
  if (isLoading || isAuthLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => router.back()}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className={styles.title}>대기실 참여 중...</h1>
        </div>
        <div className={styles.centerContent}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>대기실 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.backButton}
            onClick={() => router.back()}
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className={styles.title}>참여 실패</h1>
        </div>
        <div className={styles.centerContent}>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.errorDescription}>초대 링크가 올바른지 확인해주세요.</p>
          <button
            className={styles.homeButton}
            onClick={() => router.push('/')}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return null;
}
