'use client';

/**
 * 카카오 소셜 로그인 콜백 페이지
 * 백엔드에서 리다이렉트된 토큰을 처리하고 로그인을 완료합니다.
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { saveTokens } from '@/commons/utils/auth';
import { verifyAuth } from '@/commons/apis/auth/verify';

/**
 * 카카오 로그인 콜백 페이지 컴포넌트
 */
export default function KakaoAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URL에서 token 파라미터 추출
        const token = searchParams.get('token');

        if (!token) {
          setError('인증 토큰이 없습니다.');
          setIsProcessing(false);
          // 에러 페이지로 리다이렉트하거나 로그인 페이지로 돌아가기
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        // 토큰 저장
        saveTokens({
          accessToken: token,
          refreshToken: '', // 백엔드에서 refreshToken을 별도로 제공하지 않는 경우
        });

        // 토큰으로 사용자 정보 조회
        try {
          const verifyResult = await verifyAuth();
          
          if (verifyResult.valid && verifyResult.user) {
            // 사용자 정보를 React Query 캐시에 저장
            queryClient.setQueryData(['auth', 'user'], verifyResult.user);
            
            // 온보딩 완료 여부 확인
            const onboardingStatus = queryClient.getQueryData<{ completed: boolean }>(['onboarding', 'status']);
            const isOnboardingCompleted = onboardingStatus?.completed === true;

            // 온보딩이 완료되지 않았다면 온보딩 페이지로, 완료되었다면 홈으로 리다이렉트
            if (!isOnboardingCompleted) {
              router.push('/onboarding');
            } else {
              router.push('/');
            }
          } else {
            // 토큰이 유효하지 않은 경우
            setError('인증에 실패했습니다.');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        } catch (verifyError: unknown) {
          // 토큰 검증 실패
          console.error('토큰 검증 실패:', verifyError);
          setError('인증에 실패했습니다.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (err: unknown) {
        console.error('카카오 로그인 콜백 처리 실패:', err);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, router, queryClient]);

  // 처리 중
  if (isProcessing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>카카오 로그인 처리 중...</div>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ color: 'red' }}>{error}</div>
        <div>잠시 후 로그인 페이지로 이동합니다.</div>
      </div>
    );
  }

  // 리다이렉트 중
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div>로그인 완료! 이동 중...</div>
    </div>
  );
}
