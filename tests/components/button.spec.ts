import { test, expect } from '@playwright/test';

test.describe('Button 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Button 기본 렌더링', async ({ page }) => {
    // Button 섹션 찾기
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    await expect(buttonSection).toBeVisible();

    // Primary 버튼이 표시되는지 확인 (disabled가 아닌 첫 번째 버튼)
    const primaryButton = buttonSection.locator('button[aria-label="Primary"]:not([disabled])').first();
    await expect(primaryButton).toBeVisible();
  });

  test('Button 모든 variant 표시', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    
    // 모든 variant 버튼 확인 (첫 번째 요소 명시, Primary는 disabled가 아닌 것만)
    await expect(buttonSection.locator('button[aria-label="Primary"]:not([disabled])').first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Outline' }).first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Danger' }).first()).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Disabled' }).first()).toBeVisible();
  });

  test('Button 모든 size 표시', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    
    // 모든 size 버튼 확인
    await expect(buttonSection.getByRole('button', { name: 'Large (L)' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Medium (M)' })).toBeVisible();
    await expect(buttonSection.getByRole('button', { name: 'Small (S)' })).toBeVisible();
  });

  test('Button disabled 상태', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    
    // Disabled 버튼 확인
    const disabledButton = buttonSection.getByRole('button', { name: 'Disabled Primary' });
    await expect(disabledButton).toBeDisabled();
    
    const disabledOutlineButton = buttonSection.getByRole('button', { name: 'Disabled Outline' });
    await expect(disabledOutlineButton).toBeDisabled();
  });

  test('Button 클릭 이벤트', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    
    // Primary 버튼 클릭 (이벤트 핸들러가 있으면 정상 작동) - disabled가 아닌 첫 번째 버튼
    const primaryButton = buttonSection.locator('button[aria-label="Primary"]:not([disabled])').first();
    await primaryButton.click();
    
    // 버튼이 여전히 표시되는지 확인 (에러 없이 정상 작동)
    await expect(primaryButton).toBeVisible();
  });

  test('Button 키보드 접근성', async ({ page }) => {
    const buttonSection = page.locator('section').filter({ hasText: 'Button' }).first();
    // disabled가 아닌 첫 번째 Primary 버튼
    const primaryButton = buttonSection.locator('button[aria-label="Primary"]:not([disabled])').first();
    
    // Tab 키로 포커스 이동
    await primaryButton.focus();
    await expect(primaryButton).toBeFocused();
    
    // Enter 키로 클릭 가능한지 확인 (실제 클릭은 발생하지 않지만 포커스는 유지)
    await page.keyboard.press('Enter');
    await expect(primaryButton).toBeVisible();
  });
});
