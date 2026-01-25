import { QueryClient } from '@tanstack/react-query';

/**
 * React Query 클라이언트 설정
 * 서버 상태 관리를 위한 기본 옵션 정의
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 1000 * 60 * 5,
      // 백그라운드에서 자동 리페치 비활성화 (개발 중 안정성을 위해)
      refetchOnWindowFocus: false,
      // 네트워크 재연결 시 리페치 활성화
      refetchOnReconnect: true,
      // 재시도 횟수 설정
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 3번까지 재시도
        return failureCount < 3;
      },
      // 재시도 간격 (지수 백오프)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // 뮤테이션 재시도 설정
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 1번까지 재시도
        return failureCount < 1;
      },
    },
  },
});

/**
 * 개발 환경에서 QueryClient 디버깅 설정
 */
if (process.env.NODE_ENV === 'development') {
  queryClient.setDefaultOptions({
    queries: {
      // 개발 환경에서는 더 자주 리페치
      staleTime: 1000 * 60 * 2, // 2분
    },
  });
}