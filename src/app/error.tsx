'use client';

/**
 * @fileoverview 전역 에러 컴포넌트
 * @description 애플리케이션 에러를 처리하는 에러 바운더리
 */

import { useEffect } from 'react';
import { Button } from '@/commons/components';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (추후 에러 모니터링 서비스 연동)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white-500 px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* 에러 아이콘 */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 에러 메시지 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black-500">
            문제가 발생했습니다
          </h2>
          <p className="text-base text-dark-grey-700">
            일시적인 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
        </div>

        {/* 에러 상세 정보 (개발 환경에서만) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="w-full rounded-lg bg-grey-50 p-4 text-left">
            <p className="text-sm font-medium text-dark-grey-800">
              Error Details:
            </p>
            <p className="mt-2 text-xs text-dark-grey-600 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-dark-grey-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <Button variant="primary" onClick={reset}>
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
