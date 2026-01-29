/**
 * 프로필 수정 E2E 테스트
 * 마이페이지 /profile 에서 카메라 버튼 클릭 후 모달 표시 및 닫기/저장 플로우
 */

import { test, expect } from '@playwright/test';
import { mockMeResponse } from './fixtures/mockData';

test.describe('프로필 수정 E2E', () => {
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

  test('T016: 카메라 버튼 클릭 시 프로필 수정 모달 표시', async ({ page }) => {
    const cameraButton = page.getByRole('button', { name: '프로필 사진 변경' });
    await expect(cameraButton).toBeVisible({ timeout: 5000 });
    await cameraButton.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('heading', { name: '프로필 수정' })).toBeVisible();
    await expect(page.getByRole('button', { name: '사진 변경' })).toBeVisible();
    await expect(page.getByRole('button', { name: '취소' })).toBeVisible();
    await expect(page.getByRole('button', { name: '저장' })).toBeVisible();
  });

  test('T017: 취소 클릭 시 모달 닫힘', async ({ page }) => {
    await page.getByRole('button', { name: '프로필 사진 변경' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: '취소' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('T017: 닉네임 수정 후 저장 시 모달 닫힘 (API 모킹)', async ({ page }) => {
    await page.route('**/api/me/update*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...mockMeResponse, nickname: '새닉네임' }),
        });
      } else {
        await route.fallback();
      }
    });

    await page.getByRole('button', { name: '프로필 사진 변경' }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 3000 });
    await page.getByLabel('닉네임').fill('새닉네임');
    await page.getByRole('button', { name: '저장' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });
});
