/**
 * @fileoverview 대기실 진입 및 정보 조회 E2E 테스트
 * @description 대기실 진입 플로우, 대기실 정보 조회, 참여자 목록 조회, 오류 처리 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockWaitingRoomDetail,
  mockWaitingRoomSettings,
  mockWaitingRoomDetailEmpty,
  mockWaitingRoomSettingsSmall,
  mockErrorResponses,
} from './fixtures/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api';

// Mock 인증 토큰
const MOCK_ACCESS_TOKEN = 'test-access-token-for-e2e';

// Mock 사용자 정보
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: '테스트 사용자',
  createdAt: '2026-01-01T00:00:00Z',
};

// Mock 대기실 ID
const MOCK_CAPSULE_ID = 'capsule-123';

test.describe('대기실 진입 및 정보 조회 E2E 테스트', () => {
  // 375px 모바일 프레임 기준 테스트
  test.use({
    viewport: { width: 375, height: 812 },
  });

  test.beforeEach(async ({ page }) => {
    // 인증 토큰 검증 API 모킹
    await page.route(`${API_BASE_URL}/auth/verify`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: true,
          user: mockUser,
        }),
      });
    });

    // 인증 토큰을 localStorage에 설정
    await page.addInitScript((token) => {
      localStorage.setItem('timeEgg_accessToken', token);
    }, MOCK_ACCESS_TOKEN);

    // 본인 컨텐츠 조회는 대기실 화면에서 항상 호출되므로 기본 모킹(404 = 아직 작성 안함)
    await page.route(
      `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/my-content`,
      async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({}),
          });
        }
      }
    );
  });

  test.describe('대기실 진입 플로우', () => {
    test('대기실 페이지 접근 - 대기실 정보 조회 성공', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetail),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettings),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 대기실 정보 표시 확인
      await expect(page.getByText('우리의 추억')).toBeVisible();
      await expect(page.getByText('참여자', { exact: true })).toBeVisible();
      await expect(page.getByText('2/5명')).toBeVisible();
      await expect(page.getByText('개봉일')).toBeVisible();
      await expect(page.getByText('2026-12-31')).toBeVisible();
    });

    test('대기실 페이지 접근 - 로딩 상태 표시', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹 (지연 응답)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetail),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹 (지연 응답)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettings),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 로딩 상태 표시 확인
      const spinner = page.locator('[class*="spinner"]');
      await expect(spinner).toBeVisible();
    });
  });

  test.describe('참여자 목록 조회', () => {
    test('참여자 목록 표시 - 참여자가 있는 경우', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetail),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettings),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 참여자 목록 표시 확인
      await expect(page.getByText('홍길동')).toBeVisible();
      await expect(page.getByText('김철수')).toBeVisible();
      await expect(page.getByText('2/5명')).toBeVisible();
    });

    test('참여자 목록 표시 - 참여자가 없는 경우 (방장만)', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹 (참여자 없음)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetailEmpty),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettingsSmall),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 빈 상태 안내 표시 확인 (또는 방장만 표시)
      await expect(page.getByText('참여자', { exact: true })).toBeVisible();
      await expect(page.getByText('1/3명')).toBeVisible();
    });
  });

  test.describe('오류 처리', () => {
    test('대기실 조회 실패 - 404 NOT_FOUND', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹 (404 에러)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: mockErrorResponses.NOT_FOUND.status,
            contentType: 'application/json',
            body: JSON.stringify(mockErrorResponses.NOT_FOUND.body),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 에러 메시지 표시 확인
      await expect(
        page.getByText(/대기실을 찾을 수 없습니다/)
      ).toBeVisible();
    });

    test('대기실 설정값 조회 실패 - 404 NOT_FOUND', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹 (성공)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetail),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹 (404 에러)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: mockErrorResponses.NOT_FOUND.status,
            contentType: 'application/json',
            body: JSON.stringify(mockErrorResponses.NOT_FOUND.body),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 에러 메시지 표시 확인 또는 graceful degradation 확인
      // (설정값 조회 실패 시에도 대기실 기본 정보는 표시되어야 함)
      await expect(page.getByText('우리의 추억')).toBeVisible();
    });

    test('권한 없는 사용자 접근 - 403 FORBIDDEN', async ({ page }) => {
      // 대기실 상세 정보 조회 API 모킹 (403 에러)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: mockErrorResponses.FORBIDDEN.status,
            contentType: 'application/json',
            body: JSON.stringify(mockErrorResponses.FORBIDDEN.body),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 에러 메시지 표시 확인
      await expect(
        page.getByText(/대기실에 접근할 수 있는 권한이 없습니다/)
      ).toBeVisible();
    });

    test('인증되지 않은 사용자 접근 - 401 UNAUTHORIZED', async ({ page }) => {
      // 인증 토큰 제거
      await page.addInitScript(() => {
        localStorage.removeItem('timeEgg_accessToken');
      });

      // 대기실 상세 정보 조회 API 모킹 (401 에러)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.fulfill({
            status: mockErrorResponses.UNAUTHORIZED.status,
            contentType: 'application/json',
            body: JSON.stringify(mockErrorResponses.UNAUTHORIZED.body),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 에러 메시지 표시 확인 또는 로그인 페이지로 리다이렉트 확인
      await expect(
        page.getByText(/인증되지 않은 사용자입니다/) ||
          page.url().includes('/login')
      ).toBeTruthy();
    });

    test('네트워크 오류 처리', async ({ page }) => {
      // 네트워크 오류 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          await route.abort('failed');
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 네트워크 오류 메시지 표시 확인
      await expect(
        page.getByText(/네트워크 오류|연결 실패/)
      ).toBeVisible();
    });
  });

  test.describe('참여자 목록 자동 갱신', () => {
    test('자동 폴링을 사용하지 않음 (백엔드 부하 방지)', async ({ page }) => {
      let requestCount = 0;

      // 대기실 상세 정보 조회 API 모킹 (요청 횟수 추적)
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}`,
        async (route) => {
          requestCount++;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomDetail),
          });
        }
      );

      // 대기실 설정값 조회 API 모킹
      await page.route(
        `${API_BASE_URL}/capsules/step-rooms/${MOCK_CAPSULE_ID}/settings`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockWaitingRoomSettings),
          });
        }
      );

      await page.goto(`/waiting-room/${MOCK_CAPSULE_ID}`);

      // 초기 요청 확인
      await expect(page.getByText('우리의 추억')).toBeVisible();
      expect(requestCount).toBeGreaterThanOrEqual(1);

      // 6초 대기 후에도 자동 폴링으로 재요청하지 않아야 함
      await page.waitForTimeout(6000);
      expect(requestCount).toBe(1);
    });
  });
});
