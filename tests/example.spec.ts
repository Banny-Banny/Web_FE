import { test, expect } from '@playwright/test';

test.describe('Playwright 점검 테스트', () => {
  test('기본 페이지 로드 테스트', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');
    
    // 페이지가 로드되었는지 확인
    await expect(page).toHaveTitle(/TimeEgg|Bunny/i);
    
    // 페이지가 정상적으로 렌더링되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('페이지 네비게이션 테스트', async ({ page }) => {
    await page.goto('/');
    
    // 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    
    // 기본적인 페이지 요소가 존재하는지 확인
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
