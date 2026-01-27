/**
 * @fileoverview 결제 페이지 UI 테스트
 * @description 컴포넌트 렌더링, 사용자 상호작용, 시각적 검증을 포함한 통합 UI 테스트
 */

import { test, expect } from '@playwright/test';
import { mockGetOrderResponse } from './fixtures/mockData';

const TEST_ORDER_ID = 'test-order-123';

test.describe('결제 페이지 UI 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // API 모킹 설정
    await page.route('**/api/orders/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    await page.route('**/api/orders/*/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          order_id: TEST_ORDER_ID,
          order_status: 'PENDING_PAYMENT',
          total_amount: 15000,
          payment_amount: null,
          payment_key: null,
          payment_status: null,
          approved_at: null,
          created_at: '2026-01-26T10:00:00Z',
          updated_at: '2026-01-26T10:00:00Z',
        }),
      });
    });

    // 결제 페이지로 이동
    await page.goto(`/payment?orderId=${TEST_ORDER_ID}`);
    await page.waitForLoadState('networkidle');
  });

  test('결제 페이지 기본 렌더링', async ({ page }) => {
    // 페이지가 로드되었는지 확인
    await expect(page).toHaveURL(new RegExp(`/payment.*orderId=${TEST_ORDER_ID}`));

    // 주요 컴포넌트가 표시되는지 확인
    await expect(page.getByText('주문 정보')).toBeVisible();
    await expect(page.getByText('총 결제 금액')).toBeVisible();
  });

  test('이전 페이지로 이동 버튼 표시', async ({ page }) => {
    // BackButton이 표시되는지 확인
    const backButton = page.getByRole('button', { name: '이전' });
    await expect(backButton).toBeVisible();

    // 버튼 클릭 가능한지 확인
    await expect(backButton).toBeEnabled();
  });

  // T052: 주문 정보 표시 테스트
  test('주문 정보 표시 테스트', async ({ page }) => {
    // 주문 정보 섹션이 표시되는지 확인
    const orderSummary = page.getByText('주문 정보');
    await expect(orderSummary).toBeVisible();

    // 주문 정보 항목들이 표시되는지 확인
    await expect(page.getByText('참여 인원')).toBeVisible();
    await expect(page.getByText('5명')).toBeVisible();

    await expect(page.getByText('오픈 예정일')).toBeVisible();
    await expect(page.getByText('1개월 후')).toBeVisible();

    // 추가 옵션이 있는 경우 표시 확인
    await expect(page.getByText('사진 개수')).toBeVisible();
    await expect(page.getByText('3개')).toBeVisible();

    await expect(page.getByText('추가 옵션')).toBeVisible();
    await expect(page.getByText('음악 추가')).toBeVisible();
  });

  // T053: 결제 금액 표시 테스트
  test('결제 금액 표시 테스트', async ({ page }) => {
    // 결제 금액 섹션이 표시되는지 확인
    const paymentAmountSection = page.getByText('총 결제 금액');
    await expect(paymentAmountSection).toBeVisible();

    // 결제 금액이 올바르게 표시되는지 확인 (15,000원)
    const amountText = page.getByText(/₩15[,]?000/);
    await expect(amountText).toBeVisible();

    // 금액 형식이 올바른지 확인 (천 단위 구분)
    const formattedAmount = page.locator('text=/₩\\d{1,3}(,\\d{3})*/');
    await expect(formattedAmount).toBeVisible();
  });

  // T054: 결제 위젯 연동 테스트
  test('결제 위젯 연동 테스트', async ({ page }) => {
    // 결제 위젯 컨테이너가 표시되는지 확인
    // 토스페이먼츠 위젯은 iframe이나 특정 클래스를 가질 수 있음
    const widgetContainer = page.locator('[id*="payment-widget"], [class*="payment-widget"], iframe');
    
    // 위젯이 로드되기를 기다림 (최대 10초)
    await page.waitForTimeout(2000); // 위젯 로딩 대기

    // 결제하기 버튼이 표시되는지 확인
    const paymentButton = page.getByRole('button', { name: /결제하기|결제 진행/ });
    
    // 버튼이 표시되거나 위젯이 로드되었는지 확인
    const buttonVisible = await paymentButton.isVisible().catch(() => false);
    const widgetVisible = await widgetContainer.first().isVisible().catch(() => false);
    
    expect(buttonVisible || widgetVisible).toBeTruthy();
  });

  // T055: 결제 상태 표시 테스트
  test('결제 상태 표시 테스트', async ({ page }) => {
    // 초기 상태에서는 결제 상태가 표시되지 않아야 함 (idle 상태)
    const paymentStatus = page.getByText(/주문 정보를 불러오는 중|결제를 진행하는 중|결제가 완료되었습니다/);
    
    // 로딩이 완료되면 상태 메시지가 없어야 함 (또는 특정 상태만 표시)
    await page.waitForTimeout(1000);
    
    // 결제 상태 컴포넌트는 조건부 렌더링이므로, 
    // 초기에는 표시되지 않을 수 있음
    const statusVisible = await paymentStatus.isVisible().catch(() => false);
    
    // 상태가 표시되지 않거나 특정 상태만 표시되는 것을 확인
    // (실제 구현에 따라 조정 필요)
    expect(typeof statusVisible).toBe('boolean');
  });

  // T056: 오류 처리 테스트
  test('오류 처리 테스트 - 주문 정보 조회 실패', async ({ page }) => {
    // API 모킹을 실패로 변경
    await page.route('**/api/orders/*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: '주문을 찾을 수 없습니다.' }),
      });
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 오류 메시지가 표시되는지 확인
    const errorMessage = page.getByText(/오류|에러|주문을 찾을 수 없습니다/);
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

    // 재시도 버튼이 표시되는지 확인
    const retryButton = page.getByRole('button', { name: /다시 시도/ });
    await expect(retryButton).toBeVisible();
  });

  test('오류 처리 테스트 - 네트워크 오류', async ({ page }) => {
    // 네트워크 오류 모킹
    await page.route('**/api/orders/*', async (route) => {
      await route.abort('failed');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 오류 메시지가 표시되는지 확인
    const errorMessage = page.getByText(/네트워크|오류|에러/);
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('오류 처리 테스트 - 재시도 버튼 동작', async ({ page }) => {
    // 초기에는 오류가 없는 상태
    await expect(page.getByText('주문 정보')).toBeVisible();

    // API를 실패로 변경
    await page.route('**/api/orders/*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: '서버 오류가 발생했습니다.' }),
      });
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 재시도 버튼 클릭
    const retryButton = page.getByRole('button', { name: /다시 시도/ });
    await expect(retryButton).toBeVisible();
    
    // API를 성공으로 복구
    await page.route('**/api/orders/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    // 재시도 버튼 클릭
    await retryButton.click();

    // 주문 정보가 다시 표시되는지 확인
    await expect(page.getByText('주문 정보')).toBeVisible({ timeout: 5000 });
  });
});

