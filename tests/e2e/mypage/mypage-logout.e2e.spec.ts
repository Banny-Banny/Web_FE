/**
 * 마이페이지 및 로그아웃 E2E 테스트
 *
 * - 마이페이지(/profile) 진입, UI 요소 확인
 * - 로그아웃 플로우: 로그아웃 버튼 클릭 → API 호출 → 홈 리다이렉트
 *
 * ⚠️ 주의:
 * - 로그인 의존 테스트는 .env.local의 NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_PASSWORD 필요
 * - 개발 서버 실행 중이어야 합니다 (npm run dev)
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { localLogin } from '@/commons/apis/auth/login';

const testLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '01030728535',
  password: process.env.NEXT_PUBLIC_PASSWORD || 'test1234!',
};

async function login(page: Page) {
  const loginResponse = await localLogin(testLoginRequest);
  expect(loginResponse.accessToken).toBeDefined();

  await page.goto('/');
  await page.evaluate((token: string) => {
    localStorage.setItem('accessToken', token);
  }, loginResponse.accessToken);

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
}

test.describe('마이페이지 E2E', () => {
  test.describe('비로그인 접근', () => {
    test('인증 없이 /profile 접근 시 로그인 페이지로 리다이렉트', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/profile');
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
  });

  test.describe('로그인 후 마이페이지', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await login(page);
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');
    });

    test('마이페이지 제목 및 로그아웃 버튼이 표시됨', async ({ page }) => {
      await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('button', { name: /^로그아웃$/ })).toBeVisible({ timeout: 3000 });
    });

    test('활동 요약(캡슐, 이스터에그, 친구) 영역이 표시됨', async ({ page }) => {
      await expect(page.getByRole('button', { name: /이스터에그 목록 보기/i })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('button', { name: /친구 목록 보기/i })).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('캡슐', { exact: false })).toBeVisible({ timeout: 3000 });
    });

    test('내비게이션(공지사항, 고객 센터)이 표시됨', async ({ page }) => {
      await expect(page.getByRole('button', { name: /공지사항/i })).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('button', { name: /고객 센터/i })).toBeVisible({ timeout: 3000 });
    });
  });
});

test.describe('로그아웃 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('로그아웃 버튼 클릭 시 POST /api/auth/logout 호출 후 홈(/)으로 리다이렉트', async ({
    page,
  }) => {
    const logoutRequestPromise = page.waitForRequest(
      (req) => {
        const url = req.url();
        return (url.includes('/api/auth/logout') || url.includes('/auth/logout')) && req.method() === 'POST';
      },
      { timeout: 10000 }
    );

    const logoutButton = page.getByRole('button', { name: /^로그아웃$/ });
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();

    await logoutRequestPromise;
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('로그아웃 후 /profile 재접근 시 로그인 페이지로 리다이렉트', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /^로그아웃$/ });
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();

    await expect(page).toHaveURL('/', { timeout: 5000 });

    await page.goto('/profile');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
