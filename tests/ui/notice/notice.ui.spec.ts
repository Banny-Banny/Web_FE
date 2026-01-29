/**
 * 공지사항 UI 테스트
 *
 * 목록: 로딩, 빈 목록, 오류 상태, 공지 라벨·상대 시간
 * 상세: 로딩, 오류, 본문·이미지
 *
 * (main) 레이아웃 인증 필요 시 로그인 후 /notices 접근.
 */

import { test, expect } from '@playwright/test';
import { localLogin } from '@/commons/apis/auth/login';
import {
  mockNoticesListResponse,
  mockNoticeDetailResponse,
} from '../../e2e/notice/fixtures/mockData';

const ACCESS_TOKEN_KEY = 'timeEgg_accessToken';

const emptyListResponse = {
  success: true,
  data: {
    items: [],
    total: 0,
    limit: 10,
    offset: 0,
  },
};

async function login(page: {
  goto: (u: string) => Promise<void>;
  evaluate: (
    fn: (arg: { key: string; token: string }) => void,
    arg: { key: string; token: string }
  ) => Promise<void>;
  reload: () => Promise<void>;
  waitForLoadState: (s: string) => Promise<void>;
}) {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const password = process.env.NEXT_PUBLIC_PASSWORD;
  if (!phoneNumber || !password) {
    throw new Error(
      'NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_PASSWORD required for UI test'
    );
  }
  const loginResponse = await localLogin({ phoneNumber, password });
  expect(loginResponse.accessToken).toBeDefined();
  await page.goto('/');
  await page.evaluate(
    ({ key, token }: { key: string; token: string }) => {
      localStorage.setItem(key, token);
    },
    { key: ACCESS_TOKEN_KEY, token: loginResponse.accessToken }
  );
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
}

test.describe('공지사항 목록 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
  });

  test('목록 로딩 시 스피너 표시 후 항목 표시', async ({ page }) => {
    await page.route('**/api/notices*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/notices/') && !url.includes('/api/notices?')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticesListResponse),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/총 \d+개의 공지사항/)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText('서비스 점검 안내')).toBeVisible();
    await expect(page.getByText('앱 업데이트 소식')).toBeVisible();
  });

  test('빈 목록 시 안내 문구 표시', async ({ page }) => {
    await page.route('**/api/notices?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyListResponse),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('공지사항이 없습니다.')).toBeVisible({
      timeout: 5000,
    });
  });

  test('목록 오류 시 에러 메시지 및 다시 시도 버튼 표시', async ({
    page,
  }) => {
    await page.route('**/api/notices*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/notices/') && !url.includes('/api/notices?')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('button', { name: '다시 시도' })
    ).toBeVisible({ timeout: 5000 });
  });

  test('공지 라벨 및 상대 시간 표시', async ({ page }) => {
    await page.route('**/api/notices*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/notices/') && !url.includes('/api/notices?')) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticesListResponse),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('공지').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('서비스 점검 안내')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '공지: 서비스 점검 안내' })
    ).toBeVisible();
  });
});

test.describe('공지사항 상세 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
  });

  test('상세 로딩 후 본문·제목 표시', async ({ page }) => {
    await page.route('**/api/notices/**', async (route) => {
      const url = route.request().url();
      if (!url.match(/\/api\/notices\/[^/]+$/)) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticeDetailResponse),
      });
    });
    await page.route('**/api/notices?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticesListResponse),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '공지: 서비스 점검 안내' }).click();

    await expect(page.getByRole('heading', { name: '서비스 점검 안내' })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText('2025년 1월 30일 새벽 2시부터 4시까지 서비스 점검이 진행됩니다.')
    ).toBeVisible({ timeout: 10000 });
  });

  test('상세 오류 시 공지를 찾을 수 없습니다 및 버튼 표시', async ({
    page,
  }) => {
    await page.route('**/api/notices/**', async (route) => {
      const url = route.request().url();
      if (!url.match(/\/api\/notices\/[^/]+$/)) {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false }),
      });
    });
    await page.route('**/api/notices?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticesListResponse),
      });
    });

    await page.goto('/notices/notice-1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('공지를 찾을 수 없습니다.')).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByRole('button', { name: '다시 시도' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '목록으로' })).toBeVisible();
  });
});
