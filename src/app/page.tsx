/**
 * @fileoverview 홈페이지
 * @description TimeEgg 웹 애플리케이션의 메인 페이지
 */

import { Button, Icon } from '@/commons/components';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white-500 px-4">
      <main className="flex max-w-4xl flex-col items-center gap-8 text-center">
        {/* 로고/아이콘 영역 */}
        <div className="flex flex-col items-center gap-4">
          <Icon name="egg" size="xl" alt="TimeEgg 로고" />
          <h1 className="text-4xl font-bold text-black-500">
            TimeEgg
          </h1>
          <p className="text-lg text-dark-grey-700">
            시간을 품은 추억
          </p>
        </div>

        {/* 설명 */}
        <div className="flex flex-col gap-4">
          <p className="text-base text-dark-grey-600">
            TimeEgg 웹 프론트엔드 프로젝트가 성공적으로 설정되었습니다.
          </p>
          <p className="text-sm text-grey-600">
            Phase 1 기본 인프라 구축이 완료되었습니다.
          </p>
        </div>

        {/* 액션 버튼 예시 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="lg">
            시작하기
          </Button>
          <Button variant="secondary" size="lg">
            더 알아보기
          </Button>
        </div>

        {/* 기술 스택 정보 */}
        <div className="mt-8 rounded-lg border border-border-light bg-white-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-black-500">
            기술 스택
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-dark-grey-700 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-black-500">Framework</span>
              <span>Next.js 16</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-black-500">Language</span>
              <span>TypeScript</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-black-500">Styling</span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-black-500">State</span>
              <span>React Query</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
