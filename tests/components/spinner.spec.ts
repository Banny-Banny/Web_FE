import { test, expect } from '@playwright/test';

test.describe('Spinner 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Spinner 기본 렌더링', async ({ page }) => {
    // Spinner 섹션 찾기
    const spinnerSection = page.locator('section').filter({ hasText: 'Spinner' }).first();
    await expect(spinnerSection).toBeVisible();

    // Spinner가 표시되는지 확인 (첫 번째 요소 명시)
    const spinner = spinnerSection.locator('[role="status"]').first();
    await expect(spinner).toBeVisible();
  });

  test('Spinner 모든 size 표시', async ({ page }) => {
    const spinnerSection = page.locator('section').filter({ hasText: 'Spinner' }).first();
    
    // Small과 Large 스피너 확인
    const spinners = spinnerSection.locator('[role="status"]');
    const count = await spinners.count();
    expect(count).toBeGreaterThanOrEqual(2); // Small과 Large 최소 2개
  });

  test('Spinner 접근성', async ({ page }) => {
    const spinnerSection = page.locator('section').filter({ hasText: 'Spinner' }).first();
    const spinner = spinnerSection.locator('[role="status"]').first();
    
    // aria-label 확인
    const ariaLabel = await spinner.getAttribute('aria-label');
    expect(ariaLabel).toBe('로딩 중');
  });
});
