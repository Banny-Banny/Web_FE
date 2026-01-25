import { test, expect } from '@playwright/test';

test.describe('Modal 컴포넌트 및 Provider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Modal 열기/닫기', async ({ page }) => {
    // Modal 섹션 찾기
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    await expect(modalSection).toBeVisible();

    // 모달 열기 버튼 클릭
    const openButton = modalSection.getByRole('button', { name: '기본 Modal 열기' });
    await openButton.click();

    // 모달이 표시되는지 확인
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // 확인 버튼으로 모달 닫기
    const confirmButton = modal.getByRole('button', { name: '확인 버튼' });
    await confirmButton.click();

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });

  test('Modal 오버레이 클릭으로 닫기', async ({ page }) => {
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    const openButton = modalSection.getByRole('button', { name: '기본 Modal 열기' });
    await openButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // 오버레이 클릭 (모달 외부 클릭)
    await page.mouse.click(100, 100);

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });

  test('Modal Escape 키로 닫기', async ({ page }) => {
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    const openButton = modalSection.getByRole('button', { name: '기본 Modal 열기' });
    await openButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // Escape 키 누르기
    await page.keyboard.press('Escape');

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });

  test('여러 Modal 동시 표시', async ({ page }) => {
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    
    // 여러 모달 열기 버튼 클릭
    const openMultipleButton = modalSection.getByRole('button', { name: '여러 Modal 동시 열기' });
    await openMultipleButton.click();

    // 첫 번째 모달 확인
    const firstModal = page.locator('[role="dialog"]').first();
    await expect(firstModal).toBeVisible();

    // 두 번째 모달 열기
    const openSecondButton = firstModal.getByRole('button', { name: '두 번째 Modal 열기' });
    await openSecondButton.click();

    // 두 개의 모달이 모두 표시되는지 확인
    const modals = page.locator('[role="dialog"]');
    const count = await modals.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Modal 포커스 트랩', async ({ page }) => {
    const modalSection = page.locator('section').filter({ hasText: 'Modal' }).first();
    const openButton = modalSection.getByRole('button', { name: '기본 Modal 열기' });
    await openButton.click();

    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // 모달 내부의 첫 번째 포커스 가능한 요소 확인
    const firstFocusable = modal.locator('button').first();
    await expect(firstFocusable).toBeFocused();
  });
});
