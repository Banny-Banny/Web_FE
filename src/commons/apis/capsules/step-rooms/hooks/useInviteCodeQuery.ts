/**
 * @fileoverview 초대 코드로 방 정보 조회 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { queryRoomByInviteCode } from '../index';
import type { InviteCodeQueryResponse } from '../types';

/**
 * 초대 코드로 방 정보 조회 훅
 *
 * Public API 이므로 인증 여부와 관계없이 호출할 수 있습니다.
 */
export function useInviteCodeQuery(code: string | null) {
  return useQuery<InviteCodeQueryResponse, unknown>({
    queryKey: ['inviteCodeQuery', code],
    queryFn: () => queryRoomByInviteCode(code as string),
    enabled: !!code,
    retry: false,
  });
}

