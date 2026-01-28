/**
 * 친구 관리 API 타입 정의
 */

/**
 * 친구 정보
 */
export interface Friend {
  id: string;
  nickname: string;
  profileImg: string | null;
}

/**
 * 친구 관계 정보
 */
export interface Friendship {
  id: string;
  status: 'CONNECTED' | 'PENDING' | 'BLOCKED';
  friend: Friend;
  createdAt: string;
}

/**
 * 친구 목록 조회 요청 파라미터
 */
export interface GetFriendsParams {
  limit?: number;
  offset?: number;
}

/**
 * 친구 목록 조회 응답
 */
export interface GetFriendsResponse {
  items: Friendship[];
  total: number;
  limit: number;
  offset: number;
  hasNext: boolean;
}

/**
 * 친구 추가 요청
 */
export interface AddFriendRequest {
  phoneNumber?: string;
  email?: string;
}

/**
 * 친구 추가 응답
 */
export interface AddFriendResponse {
  message: string;
  friendshipId: string;
}
