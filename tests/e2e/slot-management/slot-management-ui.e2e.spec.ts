/**
 * 슬롯 관리 UI 통합 E2E 테스트
 * 
 * 실제 브라우저에서 사용자 시나리오를 테스트합니다.
 * 
 * ⚠️ 주의: 
 * - 실제 서버 연동이 필요한 테스트입니다.
 * - .env.local에 테스트 계정 정보가 설정되어 있어야 합니다.
 * - 개발 서버가 실행 중이어야 합니다 (npm run dev)
 */

import { test, expect } from '@playwright/test';
import { localLogin } from '@/commons/apis/auth/login';
import { testLoginRequest } from './fixtures/mockData';

/**
 * 로그인 헬퍼 함수
 * API를 직접 호출하여 로그인 후 브라우저에 토큰 설정
 */
async function login(page: any) {
  try {
    // API로 직접 로그인
    const loginResponse = await localLogin(testLoginRequest);
    expect(loginResponse.accessToken).toBeDefined();
    
    // 홈 페이지로 이동
    await page.goto('/home');
    
    // 토큰을 localStorage에 저장 (실제 앱의 인증 방식에 따라 조정 필요)
    await page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
    }, loginResponse.accessToken);
    
    // 페이지 새로고침으로 토큰 적용
    await page.reload();
    
    // 홈 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.error('❌ 로그인 실패:', error);
    throw error;
  }
}

/**
 * US1: 슬롯 조회 및 표시 테스트
 */
test.describe('US1: 슬롯 조회 및 표시', () => {
  test('홈 페이지에서 egg-slot이 표시되어야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 컴포넌트가 보이는지 확인
    const eggSlot = page.locator('[data-testid="egg-slot"]');
    await expect(eggSlot).toBeVisible({ timeout: 5000 });
    
    // 알 아이콘들이 표시되는지 확인 (최소 1개 이상)
    await page.waitForSelector('[data-testid="filled-egg"], [data-testid="empty-egg"]', { timeout: 5000 });
  });
  
  test('egg-slot 클릭 시 슬롯 모달이 열려야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot이 보일 때까지 대기
    const eggSlot = page.locator('[data-testid="egg-slot"]');
    await expect(eggSlot).toBeVisible({ timeout: 5000 });
    
    // egg-slot 클릭
    await eggSlot.click();
    
    // 모달이 열리는지 확인
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // 모달 내용 확인
    await expect(modal).toContainText('MY EGGS');
    await expect(modal).toContainText('전체 슬롯');
    await expect(modal).toContainText('사용 중');
    await expect(modal).toContainText('남은 슬롯');
  });
  
  test('슬롯 모달에서 슬롯 정보가 표시되어야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // 슬롯 정보 텍스트 확인
    const detailInfo = modal.locator('.detailInfo, [class*="detailInfo"]');
    await expect(detailInfo).toContainText('전체 슬롯');
    await expect(detailInfo).toContainText('사용 중');
    await expect(detailInfo).toContainText('남은 슬롯');
    
    // 알 이미지들이 표시되는지 확인
    const eggs = modal.locator('img[alt=""]');
    expect(await eggs.count()).toBeGreaterThan(0);
  });
});

/**
 * US3: 슬롯 초기화 테스트
 */
test.describe('US3: 슬롯 초기화', () => {
  test('슬롯 초기화 버튼을 클릭하면 확인 다이얼로그가 열려야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // "슬롯 초기화" 버튼 클릭
    const resetButton = page.locator('[data-testid="reset-button"]');
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // 확인 다이얼로그가 열리는지 확인
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });
    
    // 다이얼로그 내용 확인
    await expect(dialog).toContainText('슬롯 초기화 확인');
    await expect(dialog).toContainText('되돌릴 수 없습니다');
    await expect(dialog).toContainText('확인');
    await expect(dialog).toContainText('취소');
  });
  
  test('확인 다이얼로그에서 확인 버튼 클릭 시 모달들이 닫혀야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // "슬롯 초기화" 버튼 클릭
    await page.click('[data-testid="reset-button"]');
    
    // 확인 다이얼로그 대기
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });
    
    // "확인" 버튼 클릭
    const confirmButton = page.locator('[data-testid="confirm-reset-button"]');
    await confirmButton.click();
    
    // 다이얼로그가 닫히는지 확인
    await expect(dialog).not.toBeVisible({ timeout: 2000 });
    
    // 메인 모달도 닫히는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });
});

/**
 * US4: 초기화 취소 테스트
 */
test.describe('US4: 초기화 취소', () => {
  test('확인 다이얼로그에서 취소 버튼 클릭 시 다이얼로그만 닫혀야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // "슬롯 초기화" 버튼 클릭
    await page.click('[data-testid="reset-button"]');
    
    // 확인 다이얼로그 대기
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });
    
    // "취소" 버튼 클릭
    const cancelButton = page.locator('[data-testid="cancel-reset-button"]');
    await cancelButton.click();
    
    // 다이얼로그가 닫히는지 확인
    await expect(dialog).not.toBeVisible({ timeout: 2000 });
    
    // 메인 모달은 여전히 열려 있어야 함
    await expect(modal).toBeVisible();
    
    // 슬롯 정보가 여전히 표시되는지 확인
    await expect(modal).toContainText('MY EGGS');
  });
  
  test('취소 후 다시 초기화를 시도할 수 있어야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    await page.waitForSelector('[data-testid="egg-slot-modal"]', { timeout: 3000 });
    
    // 첫 번째 시도: 초기화 버튼 클릭 후 취소
    await page.click('[data-testid="reset-button"]');
    await page.waitForSelector('[data-testid="reset-confirm-dialog"]', { timeout: 2000 });
    await page.click('[data-testid="cancel-reset-button"]');
    
    // 다이얼로그가 닫혔는지 확인
    await expect(page.locator('[data-testid="reset-confirm-dialog"]')).not.toBeVisible();
    
    // 두 번째 시도: 다시 초기화 버튼 클릭
    const resetButton = page.locator('[data-testid="reset-button"]');
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toBeEnabled();
    await resetButton.click();
    
    // 다이얼로그가 다시 열리는지 확인
    const dialog = page.locator('[data-testid="reset-confirm-dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });
  });
});

/**
 * 모달 닫기 테스트
 */
test.describe('모달 닫기 기능', () => {
  test('확인 버튼으로 모달을 닫을 수 있어야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달 대기
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // "확인" 버튼 클릭
    const closeButton = page.locator('[data-testid="close-modal-button"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // 모달이 닫히는지 확인
    await expect(modal).not.toBeVisible({ timeout: 2000 });
  });
  
  test('모달을 닫은 후 다시 열 수 있어야 함', async ({ page }) => {
    await login(page);
    
    // 첫 번째: 모달 열고 닫기
    await page.click('[data-testid="egg-slot"]');
    await page.waitForSelector('[data-testid="egg-slot-modal"]', { timeout: 3000 });
    await page.click('[data-testid="close-modal-button"]');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="egg-slot-modal"]')).not.toBeVisible();
    
    // 두 번째: 다시 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달이 다시 열리는지 확인
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    await expect(modal).toContainText('MY EGGS');
  });
});

/**
 * 로딩 및 에러 상태 테스트
 */
test.describe('로딩 및 에러 상태', () => {
  test('슬롯 모달이 로딩 상태를 처리해야 함', async ({ page }) => {
    await login(page);
    
    // egg-slot 클릭하여 모달 열기
    await page.click('[data-testid="egg-slot"]');
    
    // 모달이 열리면서 로딩 또는 데이터가 표시되어야 함
    const modal = page.locator('[data-testid="egg-slot-modal"]');
    await expect(modal).toBeVisible({ timeout: 3000 });
    
    // 로딩 중이거나 데이터가 로드되어야 함
    // (로딩이 빠르면 바로 데이터가 표시될 수 있음)
    const hasContent = await modal.locator('[class*="eggsSection"], [class*="loadingContainer"]').count();
    expect(hasContent).toBeGreaterThan(0);
  });
});
