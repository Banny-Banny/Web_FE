/**
 * 프로필 수정 UI 테스트
 *
 * - 프로필 페이지에서 모달 열기 후 렌더링·취소·배경 클릭·저장 시 onClose/onSuccess 검증
 */

import { test, expect } from '@playwright/test';
import { mockMeResponse } from '../../e2e/profile-edit/fixtures/mockData';

test.describe('프로필 수정 UI 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.route('**/api/me*', async (route) => {
      const url = route.request().url();
      if (
        route.request().method() === 'GET' &&
        !url.includes('/update') &&
        !url.includes('/profile-image')
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMeResponse),
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test.describe('T018: ProfileEditModal 렌더 및 상호작용', () => {
    test('모달 열기 → 취소 클릭 시 모달 닫힘', async ({ page }) => {
      await page.getByRole('button', { name: '프로필 사진 변경' }).click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });

      await page.getByRole('button', { name: '취소' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('모달 열기 → 배경 클릭 시 모달 닫힘', async ({ page }) => {
      await page.getByRole('button', { name: '프로필 사진 변경' }).click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });

      const overlay = page.locator('[role="dialog"]').locator('..');
      await overlay.click({ position: { x: 5, y: 5 } });
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('모달 열기 → 저장 클릭 시 API 호출 후 모달 닫힘 (모킹)', async ({
      page,
    }) => {
      let updateCalled = false;
      await page.route('**/api/me/update*', async (route) => {
        if (route.request().method() === 'POST') {
          updateCalled = true;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockMeResponse),
          });
        } else {
          await route.fallback();
        }
      });

      await page.getByRole('button', { name: '프로필 사진 변경' }).click();
      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });

      await page.getByRole('button', { name: '저장' }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
      expect(updateCalled).toBe(true);
    });
  });
});
