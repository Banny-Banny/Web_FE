/**
 * 친구 관리 E2E 테스트용 Mock 데이터
 */

export const mockGetFriendsResponse = {
  items: [
    {
      id: 'friendship-1',
      status: 'CONNECTED',
      friend: {
        id: 'user-1',
        nickname: '바니친구1',
        profileImg: 'https://s3.amazonaws.com/bucket/profile/1.jpg',
      },
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'friendship-2',
      status: 'CONNECTED',
      friend: {
        id: 'user-2',
        nickname: '바니친구2',
        profileImg: null,
      },
      createdAt: '2024-01-02T00:00:00.000Z',
    },
    {
      id: 'friendship-3',
      status: 'CONNECTED',
      friend: {
        id: 'user-3',
        nickname: '바니친구3',
        profileImg: 'https://s3.amazonaws.com/bucket/profile/3.jpg',
      },
      createdAt: '2024-01-03T00:00:00.000Z',
    },
  ],
  total: 3,
  limit: 20,
  offset: 0,
  hasNext: false,
};

export const mockAddFriendResponse = {
  message: '친구가 추가되었습니다.',
  friendshipId: 'friendship-new',
};

export const mockEmptyFriendsResponse = {
  items: [],
  total: 0,
  limit: 20,
  offset: 0,
  hasNext: false,
};
