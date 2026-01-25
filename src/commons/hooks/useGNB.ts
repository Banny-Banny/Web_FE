/**
 * useGNB Hook
 * 
 * @description
 * - 경로 기반 GNB 표시 여부 결정 로직
 * - Next.js usePathname 훅 활용
 */

'use client';

import { usePathname } from 'next/navigation';

const HIDE_GNB_PATHS = ['/login', '/signup', '/onboarding'] as const;

export interface UseGNBReturn {
  shouldShowGNB: boolean;
  currentPath: string;
}

export function useGNB(): UseGNBReturn {
  const pathname = usePathname();
  const shouldShowGNB = !HIDE_GNB_PATHS.includes(
    pathname as (typeof HIDE_GNB_PATHS)[number]
  );

  return {
    shouldShowGNB,
    currentPath: pathname,
  };
}
