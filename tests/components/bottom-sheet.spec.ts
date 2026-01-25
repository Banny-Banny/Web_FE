import { test, expect } from '@playwright/test';

test.describe('BottomSheet 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('BottomSheet 열기/닫기', async ({ page }) => {
    // BottomSheet 섹션 찾기
    const bottomSheetSection = page.locator('section').filter({ hasText: 'BottomSheet' }).first();
    await expect(bottomSheetSection).toBeVisible();

    // BottomSheet 열기 버튼 클릭
    const openButton = bottomSheetSection.getByRole('button', { name: 'BottomSheet 열기' });
    await openButton.click();

    // BottomSheet가 표시되는지 확인
    const bottomSheet = page.locator('[role="dialog"]').filter({ hasText: 'BottomSheet' }).first();
    await expect(bottomSheet).toBeVisible({ timeout: 1000 });

    // 확인 버튼으로 닫기
    const confirmButton = bottomSheet.getByRole('button', { name: '확인 버튼' });
    await confirmButton.click();

    // BottomSheet가 닫혔는지 확인
    await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
  });

  test('BottomSheet 오버레이 클릭으로 닫기', async ({ page }) => {
    const bottomSheetSection = page.locator('section').filter({ hasText: 'BottomSheet' }).first();
    const openButton = bottomSheetSection.getByRole('button', { name: 'BottomSheet 열기' });
    await openButton.click();

    const bottomSheet = page.locator('[role="dialog"]').filter({ hasText: 'BottomSheet' }).first();
    await expect(bottomSheet).toBeVisible({ timeout: 1000 });

    // 오버레이 클릭 (화면 상단 클릭)
    await page.mouse.click(200, 100);

    // BottomSheet가 닫혔는지 확인
    await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
  });

  test('BottomSheet Escape 키로 닫기', async ({ page }) => {
    const bottomSheetSection = page.locator('section').filter({ hasText: 'BottomSheet' }).first();
    const openButton = bottomSheetSection.getByRole('button', { name: 'BottomSheet 열기' });
    await openButton.click();

    const bottomSheet = page.locator('[role="dialog"]').filter({ hasText: 'BottomSheet' }).first();
    await expect(bottomSheet).toBeVisible({ timeout: 1000 });

    // Escape 키 누르기
    await page.keyboard.press('Escape');

    // BottomSheet가 닫혔는지 확인
    await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
  });
});
