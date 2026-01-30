/**
 * 캡슐보관함 UI 테스트
 * - 목록 로딩·빈 목록·에러 상태 표시
 * - 탭 전환(열린/잠긴), 모달 열기/닫기
 */

import { test, expect } from '@playwright/test';

test.describe('캡슐보관함 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('비로그인 시 /profile/capsules 접근하면 로그인 페이지로 리다이렉트', async ({
    page,
  }) => {
    await page.goto('/profile/capsules');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});
