import { test, expect } from '@playwright/test';

test.describe('DualButton 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('DualButton 기본 렌더링', async ({ page }) => {
    // DualButton 섹션 찾기
    const dualButtonSection = page.locator('section').filter({ hasText: 'DualButton' }).first();
    await expect(dualButtonSection).toBeVisible();

    // DualButton이 표시되는지 확인 (첫 번째 요소 명시)
    const cancelButton = dualButtonSection.getByRole('button', { name: '취소 버튼' }).first();
    const confirmButton = dualButtonSection.getByRole('button', { name: '확인 버튼' }).first();
    
    await expect(cancelButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
  });

  test('DualButton 각 버튼 독립적 클릭', async ({ page }) => {
    const dualButtonSection = page.locator('section').filter({ hasText: 'DualButton' }).first();
    
    const cancelButton = dualButtonSection.getByRole('button', { name: '취소 버튼' }).first();
    const confirmButton = dualButtonSection.getByRole('button', { name: '확인 버튼' }).first();
    
    // 취소 버튼 클릭
    await cancelButton.click();
    await expect(cancelButton).toBeVisible();
    
    // 확인 버튼 클릭
    await confirmButton.click();
    await expect(confirmButton).toBeVisible();
  });

  test('DualButton 다양한 조합 표시', async ({ page }) => {
    const dualButtonSection = page.locator('section').filter({ hasText: 'DualButton' }).first();
    
    // 여러 DualButton이 표시되는지 확인
    const dualButtons = dualButtonSection.locator('[role="group"]');
    const count = await dualButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});
