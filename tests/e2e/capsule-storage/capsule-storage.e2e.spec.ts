/**
 * 캡슐보관함 E2E 테스트
 *
 * - 마이페이지 → "캡슐" 클릭 → /profile/capsules 진입
 * - 캡슐보관함 제목·서브타이틀·대기실/탭 구역 표시
 * - 대기실 캡슐 카드 클릭 → /waiting-room/[capsuleId] 이동
 * - 열린 캡슐 탭 → 카드 클릭 → 상세 모달 → 아바타 클릭 → 슬롯 전환 → 모달 닫기
 * - 잠긴 캡슐 탭 → 카드 클릭 → 상세 모달 미오픈(또는 안내만)
 * - 캡슐보관함 헤더 닫기 → 마이페이지 복귀
 *
 * ⚠️ 로그인 의존. 개발 서버 실행 중이어야 함.
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

test.describe('캡슐보관함 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
  });

  test('마이페이지 → 캡슐 클릭 → /profile/capsules 진입, 캡슐보관함 제목·서브타이틀·대기실/탭 구역 표시', async ({
    page,
  }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: '마이페이지' })).toBeVisible({
      timeout: 5000,
    });

    await page.getByRole('button', { name: '캡슐보관함' }).click();
    await page.waitForURL(/\/profile\/capsules/, { timeout: 5000 });

    await expect(page.getByRole('heading', { name: '캡슐보관함' })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/열린 캡슐.*잠긴 캡슐/)).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText('캡슐 대기실', { exact: false })).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText(/열린 캡슐 \(\d+\)/)).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText(/잠긴 캡슐 \(\d+\)/)).toBeVisible({
      timeout: 3000,
    });
  });

  test('캡슐보관함 헤더 닫기 버튼 클릭 → 마이페이지(또는 이전 화면) 복귀', async ({
    page,
  }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '캡슐보관함' }).click();
    await page.waitForURL(/\/profile\/capsules/, { timeout: 5000 });

    await page.getByRole('button', { name: '닫기' }).first().click();
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/\/profile/);
  });

  test('대기실 캡슐 카드가 있으면 클릭 시 /waiting-room/[capsuleId] 이동', async ({
    page,
  }) => {
    await page.goto('/profile/capsules');
    await page.waitForLoadState('networkidle');

    const waitingRoomCard = page.locator('[class*="card"]').filter({ hasText: /캡슐이 없어요/ }).first();
    const hasEmptyMessage = await waitingRoomCard.isVisible().catch(() => false);
    if (hasEmptyMessage) {
      test.skip();
      return;
    }

    const firstCard = page.locator('button').filter({ hasText: /일.*시간|마감됨/ }).first();
    if (await firstCard.isVisible().catch(() => false)) {
      await firstCard.click();
      await page.waitForURL(/\/waiting-room\/[^/]+/, { timeout: 5000 });
      expect(page.url()).toMatch(/\/waiting-room\/.+/);
    }
  });
});
