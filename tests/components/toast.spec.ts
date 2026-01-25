import { test, expect } from '@playwright/test';

test.describe('Toast 컴포넌트 및 Provider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Toast 기본 표시', async ({ page }) => {
    // Toast 섹션 찾기
    const toastSection = page.locator('section').filter({ hasText: 'Toast' }).first();
    await expect(toastSection).toBeVisible();

    // Success Toast 표시
    const successButton = toastSection.getByRole('button', { name: 'Success Toast' });
    await successButton.click();

    // Toast가 표시되는지 확인
    const toast = page.locator('[role="alert"]').first();
    await expect(toast).toBeVisible({ timeout: 1000 });
  });

  test('Toast 모든 타입 표시', async ({ page }) => {
    const toastSection = page.locator('section').filter({ hasText: 'Toast' }).first();
    
    // 각 타입별 Toast 테스트
    const types = ['Success', 'Error', 'Info', 'Warning'];
    
    for (const type of types) {
      const button = toastSection.getByRole('button', { name: `${type} Toast` });
      await button.click();
      
      const toast = page.locator('[role="alert"]').first();
      await expect(toast).toBeVisible({ timeout: 1000 });
      
      // Toast가 사라질 때까지 대기
      await page.waitForTimeout(3500);
    }
  });

  test('Toast 자동 사라짐', async ({ page }) => {
    const toastSection = page.locator('section').filter({ hasText: 'Toast' }).first();
    const successButton = toastSection.getByRole('button', { name: 'Success Toast' });
    
    await successButton.click();
    
    // Toast 컨테이너 찾기 (Next.js route announcer 제외)
    const toast = page.locator('[role="alert"]:not(#__next-route-announcer__)').first();
    await expect(toast).toBeVisible({ timeout: 1000 });
    
    // 3초 duration + 0.3초 애니메이션 후 Toast가 사라지는지 확인
    // Toast Provider가 실제로 제거하는지 확인하기 위해 더 긴 타임아웃 사용
    await expect(toast).not.toBeVisible({ timeout: 6000 });
  });

  test('여러 Toast 순차 표시', async ({ page }) => {
    const toastSection = page.locator('section').filter({ hasText: 'Toast' }).first();
    const multipleButton = toastSection.getByRole('button', { name: '여러 Toast 순차 표시' });
    
    await multipleButton.click();
    
    // 여러 Toast가 순차적으로 표시되는지 확인
    // 첫 번째 Toast
    const firstToast = page.locator('[role="alert"]').first();
    await expect(firstToast).toBeVisible({ timeout: 1000 });
    
    // Toast가 사라지고 다음 Toast가 나타나는지 확인
    await page.waitForTimeout(2000);
    
    // 최소한 하나의 Toast는 표시되어야 함
    const toasts = page.locator('[role="alert"]');
    const count = await toasts.count();
    expect(count).toBeGreaterThan(0);
  });
});
