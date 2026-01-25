import { test, expect } from '@playwright/test';

test.describe('TimeCapsuleHeader 컴포넌트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('TimeCapsuleHeader 기본 렌더링', async ({ page }) => {
    // TimeCapsuleHeader 섹션 찾기
    const headerSection = page.locator('section').filter({ hasText: 'TimeCapsuleHeader' }).first();
    await expect(headerSection).toBeVisible();

    // 헤더가 표시되는지 확인
    const headers = headerSection.locator('h1');
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TimeCapsuleHeader 인터랙티브 요소', async ({ page }) => {
    const headerSection = page.locator('section').filter({ hasText: 'TimeCapsuleHeader' }).first();
    
    // 뒤로가기 버튼 확인
    const backButtons = headerSection.getByRole('button', { name: '뒤로가기' });
    const backButtonCount = await backButtons.count();
    
    if (backButtonCount > 0) {
      const firstBackButton = backButtons.first();
      await expect(firstBackButton).toBeVisible();
      
      // 뒤로가기 버튼 클릭 가능한지 확인
      await firstBackButton.click();
      await expect(firstBackButton).toBeVisible();
    }
  });

  test('TimeCapsuleHeader 다양한 variant', async ({ page }) => {
    const headerSection = page.locator('section').filter({ hasText: 'TimeCapsuleHeader' }).first();
    
    // 여러 헤더 variant가 표시되는지 확인
    const headers = headerSection.locator('h1');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(2); // 최소 2개 이상의 variant
  });
});
