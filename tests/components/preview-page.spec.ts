import { test, expect } from '@playwright/test';

test.describe('미리보기 페이지 통합 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('미리보기 페이지 접근', async ({ page }) => {
    // 페이지 제목 확인
    const title = page.locator('h1').filter({ hasText: '컴포넌트 미리보기' });
    await expect(title).toBeVisible();
  });

  test('모든 컴포넌트 섹션 표시', async ({ page }) => {
    // 모든 컴포넌트 섹션이 표시되는지 확인
    const sections = [
      'Button',
      'DualButton',
      'Spinner',
      'BottomSheet',
      'TimeCapsuleHeader',
      'Modal',
      'Toast',
    ];

    for (const sectionName of sections) {
      const section = page.locator('section').filter({ hasText: sectionName }).first();
      await expect(section).toBeVisible();
    }
  });

  test('인터랙티브 컴포넌트 동작', async ({ page }) => {
    // Button 클릭 (disabled가 아닌 첫 번째 Primary 버튼)
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    const primaryButton = buttonSection.locator('button[aria-label="Primary"]:not([disabled])').first();
    await primaryButton.click();
    await expect(primaryButton).toBeVisible();

    // Modal 열기
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    const openModalButton = modalSection.getByRole('button', { name: '기본 Modal 열기' });
    await openModalButton.click();
    
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 2000 });

    // Modal 닫기 (확인 버튼으로)
    const confirmButton = modal.getByRole('button', { name: '확인 버튼' });
    await confirmButton.click();
    
    // Modal이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });

    // Toast 표시
    const toastSection = page.locator('section').filter({ hasText: 'Toast' }).first();
    const successToastButton = toastSection.getByRole('button', { name: 'Success Toast' });
    await successToastButton.click();
    
    // Toast 컨테이너 찾기 (Next.js route announcer 제외)
    const toast = page.locator('[role="alert"]:not(#__next-route-announcer__)').first();
    await expect(toast).toBeVisible({ timeout: 2000 });
  });

  test('모든 variant, size, 상태 표시', async ({ page }) => {
    // Button variant 확인 (첫 번째 요소 명시)
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    await expect(buttonSection.getByRole('button', { name: 'Primary' }).first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Outline' }).first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Danger' }).first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Disabled' }).first()).toBeVisible();

    // Button size 확인
    await expect(buttonSection.getByRole('button', { name: 'Large (L)' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Medium (M)' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Small (S)' })).toBeVisible();

    // Spinner size 확인
    const spinnerSection = page.locator('section').filter({ hasText: 'Spinner' }).first();
    const spinners = spinnerSection.locator('[role="status"]');
    const spinnerCount = await spinners.count();
    expect(spinnerCount).toBeGreaterThanOrEqual(2);
  });
});
