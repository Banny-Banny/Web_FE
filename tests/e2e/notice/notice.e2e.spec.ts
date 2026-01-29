/**
 * 공지사항 API 연동 E2E 테스트
 *
 * 검증: GET /api/notices·GET /api/notices/:id 호출 여부,
 * 목록/상세 응답 데이터가 화면에 반영되는지
 * UI 테스트·스타일 검증은 하지 않음.
 *
 * (main) 레이아웃이 인증을 요구하므로 로그인 후 /notices 접근.
 */

import { test, expect } from '@playwright/test';
import { localLogin } from '@/commons/apis/auth/login';
import {
  mockNoticesListResponse,
  mockNoticeDetailResponse,
} from './fixtures/mockData';

const ACCESS_TOKEN_KEY = 'timeEgg_accessToken';

async function login(page: { goto: (u: string) => Promise<void>; evaluate: (fn: (arg: { key: string; token: string }) => void, arg: { key: string; token: string }) => Promise<void>; reload: () => Promise<void>; waitForLoadState: (s: string) => Promise<void> }) {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const password = process.env.NEXT_PUBLIC_PASSWORD;
  if (!phoneNumber || !password) {
    throw new Error('NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_PASSWORD required for E2E');
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

test.describe('공지사항 API 연동 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
  });

  test('GET /api/notices 호출 후 목록 데이터가 화면에 반영됨', async ({
    page,
  }) => {
    let listRequested = false;
    await page.route('**/api/notices*', async (route) => {
      const url = route.request().url();
      if (url.includes('/api/notices/') && !url.includes('/api/notices?')) {
        await route.fallback();
        return;
      }
      listRequested = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNoticesListResponse),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    expect(listRequested).toBe(true);

    const subtitle = page.getByText(/총 \d+개의 공지사항/);
    await expect(subtitle).toBeVisible({ timeout: 5000 });

    await expect(page.getByText('서비스 점검 안내')).toBeVisible();
    await expect(page.getByText('앱 업데이트 소식')).toBeVisible();
  });

  test('목록 항목 클릭 시 GET /api/notices/:id 호출 후 상세 데이터가 화면에 반영됨', async ({
    page,
  }) => {
    // 상세 요청: pathname이 /api/notices/:id 형태 (목록은 /api/notices? 쿼리)
    // * 는 / 를 매칭하지 않으므로 ** 로 상세 경로(/api/notices/notice-1)까지 포함
    const isDetailRequest = (url: string) =>
      /\/api\/notices\/[^/]+$/.test(new URL(url).pathname);
    await page.route('**/api/notices**', async (route) => {
      const url = route.request().url();
      if (isDetailRequest(url)) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNoticeDetailResponse),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNoticesListResponse),
        });
      }
    });

    await page.goto('/notices');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('서비스 점검 안내').first()).toBeVisible({
      timeout: 10000,
    });
    await page.getByText('서비스 점검 안내').first().click();

    await expect(page).toHaveURL(/\/notices\/notice-1/, { timeout: 10000 });

    // 상세 페이지: h1 먼저 보일 때까지 대기 후 본문 검증 (모킹된 API 응답 반영)
    await expect(
      page.locator('h1').filter({ hasText: '서비스 점검 안내' })
    ).toBeVisible({ timeout: 15000 });
    // 본문은 mock content와 동일한 문자열로 검증 (fixture와 일치)
    const expectedContent = mockNoticeDetailResponse.data.content;
    await expect(
      page.getByRole('article').getByText(expectedContent)
    ).toBeVisible({ timeout: 10000 });
  });

  test('목록이 비어 있을 때 빈 상태 메시지 표시', async ({ page }) => {
    await page.route('**/api/notices?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { items: [], total: 0, limit: 10, offset: 0 },
        }),
      });
    });

    await page.goto('/notices');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('공지사항이 없습니다.')).toBeVisible({
      timeout: 5000,
    });
  });
});
