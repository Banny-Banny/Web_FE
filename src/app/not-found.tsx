'use client';

/**
 * @fileoverview 404 Not Found 페이지
 * @description 존재하지 않는 페이지 접근 시 표시
 */

import { Button } from '@/commons/components';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white-500 px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* 404 텍스트 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold text-red-500">404</h1>
          <h2 className="text-2xl font-bold text-black-500">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-base text-dark-grey-700">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>

        {/* 일러스트레이션 (선택적) */}
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-grey-50">
          <svg
            className="h-20 w-20 text-grey-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <Button label="홈으로 이동" variant="primary" size="L" onPress={() => (window.location.href = '/')} />
          <Button label="이전 페이지" variant="outline" size="L" onPress={() => window.history.back()} />
        </div>
      </div>
    </div>
  );
}
