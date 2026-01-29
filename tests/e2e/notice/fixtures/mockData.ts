/**
 * 공지사항 E2E 테스트용 Mock 데이터
 * API 응답 형식: { success, data }
 */

export const mockNoticesListResponse = {
  success: true,
  data: {
    items: [
      {
        id: 'notice-1',
        title: '서비스 점검 안내',
        imageUrl: null,
        isPinned: true,
        isVisible: true,
        createdAt: '2025-01-28T10:00:00.000Z',
      },
      {
        id: 'notice-2',
        title: '앱 업데이트 소식',
        imageUrl: null,
        isPinned: false,
        isVisible: true,
        createdAt: '2025-01-27T14:00:00.000Z',
      },
    ],
    total: 2,
    limit: 10,
    offset: 0,
  },
};

export const mockNoticeDetailResponse = {
  success: true,
  data: {
    id: 'notice-1',
    title: '서비스 점검 안내',
    content: '2025년 1월 30일 새벽 2시부터 4시까지 서비스 점검이 진행됩니다.',
    imageUrl: null,
    isPinned: true,
    isVisible: true,
    createdAt: '2025-01-28T10:00:00.000Z',
    updatedAt: '2025-01-28T10:00:00.000Z',
  },
};
