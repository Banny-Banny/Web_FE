/**
 * @fileoverview 전역 로딩 컴포넌트
 * @description 페이지 전환 시 표시되는 로딩 UI
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white-500">
      <div className="flex flex-col items-center gap-4">
        {/* 로딩 스피너 */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-grey-200 border-t-red-500" />
        
        {/* 로딩 텍스트 */}
        <p className="text-base font-medium text-dark-grey-700">
          로딩 중...
        </p>
      </div>
    </div>
  );
}
