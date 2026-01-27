/**
 * @fileoverview 결제 콜백 페이지 UI 테스트
 * @description 결제 성공/실패 콜백 페이지의 UI 렌더링, 상호작용, 시각적 검증 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockPaymentSuccessParams,
  mockPaymentFailParams,
  mockConfirmPaymentSuccess,
} from './fixtures/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api';

// Mock 인증 토큰
const MOCK_ACCESS_TOKEN = 'test-access-token-for-e2e';

// Mock 사용자 정보
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: '테스트 사용자',
  createdAt: '2026-01-01T00:00:00Z',
};

test.describe('결제 콜백 페이지 UI 테스트', () => {
  // 375px 모바일 프레임 기준 테스트
  test.use({
    viewport: { width: 375, height: 812 },
  });

  test.beforeEach(async ({ page }) => {
    // 인증 토큰 검증 API 모킹
    await page.route(`${API_BASE_URL}/auth/verify`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: true,
          user: mockUser,
        }),
      });
    });

    // API 응답 모킹 설정
    await page.route(`${API_BASE_URL}/orders/*/status`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          order_id: mockPaymentSuccessParams.orderId,
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

    // 인증 토큰을 localStorage에 설정
    await page.addInitScript((token) => {
      localStorage.setItem('timeEgg_accessToken', token);
    }, MOCK_ACCESS_TOKEN);
  });

  test.describe('결제 성공 페이지 UI', () => {
    test('결제 성공 페이지 렌더링 - 로딩 상태', async ({ page }) => {
      // 결제 성공 콜백 URL로 이동
      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      
      // 결제 승인 API 응답 모킹 (지연 응답)
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        // 1초 지연 후 응답
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockConfirmPaymentSuccess),
        });
      });

      await page.goto(url);

      // 로딩 상태 표시 확인
      const loadingMessage = page.getByText('결제 승인 중...');
      await expect(loadingMessage).toBeVisible();

      // 스피너 표시 확인
      const spinner = page.locator('[class*="spinner"]');
      await expect(spinner).toBeVisible();
    });

    test('결제 성공 페이지 렌더링 - 성공 시 대기실로 리다이렉트', async ({ page }) => {
      // 결제 승인 API 응답 모킹 (즉시 성공)
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockConfirmPaymentSuccess),
        });
      });

      // 대기실 페이지로 리다이렉트 모킹
      await page.route('**/waiting-room/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>Waiting Room Page</body></html>',
        });
      });

      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 결제 성공 시 대기실 페이지로 리다이렉트 확인
      await expect(page).toHaveURL(/\/waiting-room\//, { timeout: 5000 });
    });

    test('결제 성공 페이지 - 에러 메시지 표시', async ({ page }) => {
      // 결제 승인 API 실패 응답 모킹
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'AMOUNT_MISMATCH',
            message: '결제 금액이 주문 금액과 일치하지 않습니다.',
          }),
        });
      });

      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 에러 메시지 표시 확인
      const errorTitle = page.getByRole('heading', { name: '결제 처리 오류' });
      await expect(errorTitle).toBeVisible({ timeout: 5000 });

      // 에러 아이콘 확인
      const errorIcon = page.locator('text=✕').first();
      await expect(errorIcon).toBeVisible();
    });

    test('결제 성공 페이지 - 재시도 버튼 상호작용', async ({ page }) => {
      let requestCount = 0;

      // 결제 승인 API 실패 응답 모킹
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        requestCount++;
        if (requestCount === 1) {
          // 첫 번째 요청 실패
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              code: 'TOSS_CONFIRM_FAILED',
              message: '결제 승인 처리 중 오류가 발생했습니다.',
            }),
          });
        } else {
          // 두 번째 요청 성공
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockConfirmPaymentSuccess),
          });
        }
      });

      // 대기실 페이지로 리다이렉트 모킹
      await page.route('**/waiting-room/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>Waiting Room Page</body></html>',
        });
      });

      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 에러 메시지 표시 확인
      const errorMessage = page.getByText(/결제 처리 오류/);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });

      // 재시도 버튼 클릭
      const retryButton = page.getByRole('button', { name: /다시 시도/ });
      await expect(retryButton).toBeVisible();
      await retryButton.click();

      // 재시도 후 성공 시 대기실 페이지로 리다이렉트 확인
      await expect(page).toHaveURL(/\/waiting-room\//, { timeout: 5000 });
    });

    test('결제 성공 페이지 - 주문 상태 조회 버튼 상호작용', async ({ page }) => {
      // 결제 승인 API 실패 응답 모킹
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'ORDER_NOT_FOUND',
            message: '주문을 찾을 수 없습니다.',
          }),
        });
      });

      // 주문 상태 조회 API 응답 모킹 (결제 완료 상태)
      await page.route(`${API_BASE_URL}/orders/${mockPaymentSuccessParams.orderId}/status`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            order_id: mockPaymentSuccessParams.orderId,
            order_status: 'PAID',
            total_amount: 15000,
            payment_amount: 15000,
            payment_key: 'payment-key-123',
            payment_status: 'DONE',
            approved_at: '2026-01-26T10:05:00Z',
            created_at: '2026-01-26T10:00:00Z',
            updated_at: '2026-01-26T10:05:00Z',
          }),
        });
      });

      // 대기실 페이지로 리다이렉트 모킹
      await page.route('**/waiting-room/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<html><body>Waiting Room Page</body></html>',
        });
      });

      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 에러 메시지 표시 확인
      const errorMessage = page.getByText(/결제 처리 오류/);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });

      // 주문 상태 조회 버튼 클릭
      const checkButton = page.getByRole('button', { name: /주문 상태 확인/ });
      await expect(checkButton).toBeVisible();
      await checkButton.click();

      // 대기실 페이지로 리다이렉트 확인
      await expect(page).toHaveURL(/\/waiting-room\//, { timeout: 5000 });
    });
  });

  test.describe('결제 실패 페이지 UI', () => {
    test('결제 실패 페이지 렌더링', async ({ page }) => {
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message || '')}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 실패 아이콘 확인
      const failIcon = page.locator('text=✕').first();
      await expect(failIcon).toBeVisible();

      // 실패 메시지 확인
      const failMessage = page.getByRole('heading', { name: '결제 실패' });
      await expect(failMessage).toBeVisible();

      // 사용자 친화적인 메시지 확인 (카드 승인 실패 또는 fallback 메시지)
      const userMessage = page.getByText(/카드 승인에 실패했습니다|결제 처리 중 오류가 발생했습니다/);
      await expect(userMessage).toBeVisible();
    });

    test('결제 실패 페이지 - 재시도 버튼 상호작용', async ({ page }) => {
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message || '')}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 재시도 버튼 확인
      const retryButton = page.getByRole('button', { name: /다시 시도/ });
      await expect(retryButton).toBeVisible();

      // 재시도 버튼 클릭
      await retryButton.click();

      // 결제 페이지로 리다이렉트 확인
      await expect(page).toHaveURL(/\/payment\?orderId=/, { timeout: 3000 });
    });

    test('결제 실패 페이지 - 뒤로가기 버튼 상호작용', async ({ page }) => {
      // 이전 페이지로 이동
      await page.goto('/payment?orderId=test-order-123');
      
      // 결제 실패 페이지로 이동
      const failUrl = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message || '')}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(failUrl);

      // 뒤로가기 버튼 확인
      const backButton = page.getByRole('button', { name: /이전 페이지로/ });
      await expect(backButton).toBeVisible();

      // 뒤로가기 버튼 클릭
      await backButton.click();

      // 이전 페이지로 돌아갔는지 확인
      await expect(page).toHaveURL(/\/payment\?orderId=test-order-123/, { timeout: 3000 });
    });
  });

  test.describe('375px 모바일 프레임 기준 테스트', () => {
    test('결제 성공 페이지 - 모바일 레이아웃 검증', async ({ page }) => {
      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockConfirmPaymentSuccess),
        });
      });

      await page.goto(url);

      // 컨테이너 너비 확인 (375px 기준)
      const container = page.locator('[class*="container"]').first();
      const containerBox = await container.boundingBox();
      
      if (containerBox) {
        expect(containerBox.width).toBeLessThanOrEqual(375);
      }

      // 페이지가 모바일 뷰포트에 맞게 렌더링되는지 확인
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      
      if (bodyBox) {
        expect(bodyBox.width).toBeLessThanOrEqual(375);
      }
    });

    test('결제 실패 페이지 - 모바일 레이아웃 검증', async ({ page }) => {
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message || '')}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 컨테이너 너비 확인 (375px 기준)
      const container = page.locator('[class*="container"]').first();
      const containerBox = await container.boundingBox();
      
      if (containerBox) {
        expect(containerBox.width).toBeLessThanOrEqual(375);
      }

      // 버튼들이 모바일 화면에 맞게 배치되는지 확인
      const retryButton = page.getByRole('button', { name: /다시 시도/ });
      const retryButtonBox = await retryButton.boundingBox();
      
      if (retryButtonBox) {
        // 버튼이 화면 너비에 맞게 조정되었는지 확인
        expect(retryButtonBox.width).toBeLessThanOrEqual(375);
      }
    });
  });

  test.describe('접근성 테스트', () => {
    test('결제 성공 페이지 - 키보드 네비게이션', async ({ page }) => {
      // 결제 승인 API 실패 응답 모킹
      await page.route(`${API_BASE_URL}/payments/toss/confirm`, async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            code: 'TOSS_CONFIRM_FAILED',
            message: '결제 승인 처리 중 오류가 발생했습니다.',
          }),
        });
      });

      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 에러 메시지 표시 확인
      await expect(page.getByText(/결제 처리 오류/)).toBeVisible({ timeout: 5000 });

      // Tab 키로 버튼 포커스 이동
      await page.keyboard.press('Tab');
      
      // 재시도 버튼이 포커스되었는지 확인
      const retryButton = page.getByRole('button', { name: /다시 시도/ });
      await expect(retryButton).toBeFocused();
    });

    test('결제 실패 페이지 - 키보드 네비게이션', async ({ page }) => {
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message || '')}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 재시도 버튼 확인
      const retryButton = page.getByRole('button', { name: /다시 시도/ });
      await expect(retryButton).toBeVisible();

      // 버튼에 직접 포커스
      await retryButton.focus();
      await expect(retryButton).toBeFocused();

      // Enter 키로 버튼 클릭
      await page.keyboard.press('Enter');

      // 결제 페이지로 리다이렉트 확인
      await expect(page).toHaveURL(/\/payment\?orderId=/, { timeout: 3000 });
    });
  });
});
