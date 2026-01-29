/**
 * 친구 관리 API 함수
 */

import type { AxiosError } from 'axios';
import { apiClient } from '@/commons/provider/api-provider/api-client';
import { AUTH_ENDPOINTS } from '@/commons/apis/endpoints';
import { createEndpoint } from '@/commons/apis/endpoints';
import type {
  GetFriendsParams,
  GetFriendsResponse,
  AddFriendRequest,
  AddFriendResponse,
} from './types';

/**
 * 친구 목록 조회 API 엔드포인트
 * 백엔드: GET /api/me/friends (AUTH_ENDPOINTS.ME/friends 아님)
 */
const FRIENDS_ENDPOINT = AUTH_ENDPOINTS.ME_FRIENDS;

/**
 * 친구 목록 조회
 * 
 * 사용자의 친구 목록을 페이지네이션을 통해 조회합니다.
 * 
 * @param params - 조회 파라미터 (limit, offset)
 * @returns 친구 목록 응답
 * @throws ApiError 인증되지 않은 사용자(401) 또는 서버 오류(500) 시
 * 
 * @example
 * ```typescript
 * try {
 *   const friends = await getFriends({ limit: 20, offset: 0 });
 *   console.log('친구 수:', friends.total);
 * } catch (error) {
 *   if (error.status === 401) {
 *     console.error('인증이 필요합니다.');
 *   }
 * }
 * ```
 */
export async function getFriends(
  params: GetFriendsParams = {}
): Promise<GetFriendsResponse> {
  try {
    const { limit = 20, offset = 0 } = params;
    const url = createEndpoint.withQuery(FRIENDS_ENDPOINT, { limit, offset });

    const response = await apiClient.get<GetFriendsResponse>(url);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '친구 목록 조회 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}

/**
 * 친구 추가
 * 
 * 전화번호 또는 이메일을 통해 친구를 추가합니다.
 * 친구 관계는 자동으로 승인됩니다.
 * 
 * @param request - 친구 추가 요청 (phoneNumber 또는 email 중 하나 필수)
 * @returns 친구 추가 응답
 * @throws ApiError 
 *   - 잘못된 요청 데이터(400): 자기 자신 추가 시도
 *   - 인증되지 않은 사용자(401)
 *   - 사용자를 찾을 수 없음(404)
 *   - 이미 친구 관계이거나 차단된 사용자(409)
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await addFriend({ phoneNumber: '01012345678' });
 *   console.log('친구 추가 성공:', result.friendshipId);
 * } catch (error) {
 *   if (error.status === 404) {
 *     console.error('해당 전화번호의 사용자를 찾을 수 없습니다.');
 *   }
 * }
 * ```
 */
export async function addFriend(
  request: AddFriendRequest
): Promise<AddFriendResponse> {
  try {
    const response = await apiClient.post<AddFriendResponse>(
      FRIENDS_ENDPOINT,
      request
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '친구 추가 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}

/**
 * 친구 삭제
 * 
 * 친구 관계를 삭제합니다.
 * 
 * @param friendshipId - 친구 관계 ID
 * @throws ApiError
 *   - 인증되지 않은 사용자(401)
 *   - 친구 관계를 삭제할 권한이 없음(403)
 *   - 친구 관계를 찾을 수 없음(404)
 * 
 * @example
 * ```typescript
 * try {
 *   await deleteFriend('550e8400-e29b-41d4-a716-446655440000');
 *   console.log('친구 삭제 성공');
 * } catch (error) {
 *   if (error.status === 404) {
 *     console.error('친구 관계를 찾을 수 없습니다.');
 *   }
 * }
 * ```
 */
export async function deleteFriend(friendshipId: string): Promise<void> {
  try {
    await apiClient.delete(`${FRIENDS_ENDPOINT}/${friendshipId}`);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const apiError = {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        '친구 삭제 중 오류가 발생했습니다.',
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code || axiosError.code,
      details: axiosError.response?.data,
    };

    throw apiError;
  }
}
