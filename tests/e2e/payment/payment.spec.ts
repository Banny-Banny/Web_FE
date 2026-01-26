/**
 * @fileoverview 결제 페이지 E2E 테스트
 * @description 결제 페이지의 주문 정보 조회, 결제 플로우, 에러 처리 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockGetOrderResponse,
  mockOrderStatusPending,
  mockOrderStatusPaid,
  mockOrderStatusFailed,
} from './fixtures/mockData';

const DEV_TOKEN = process.env.NEXT_PUBLIC_DEV_TOKEN || '';

test.describe('결제 페이지', () => {
  test.beforeEach(async ({ page, context }) => {
    // 인증 토큰 설정
    await context.addCookies([
      {
        name: 'timeEgg_accessToken',
        value: DEV_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);

    // localStorage에 토큰 설정
    await page.goto('/payment?orderId=test-order-123');
    await page.evaluate((token) => {
      localStorage.setItem('timeEgg_accessToken', token);
    }, DEV_TOKEN);
  });

  test('주문 ID로 결제 페이지 접근 및 주문 정보 표시', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    // 주문 정보가 표시되는지 확인
    // TODO: 실제 UI 컴포넌트 구현 후 구체적인 선택자로 업데이트 필요
    await expect(page).toHaveURL(/.*\/payment\?orderId=test-order-123/);
  });

  test('주문 정보 조회 성공 시 주문 상세 정보 표시', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    // 주문 정보 로딩 완료 대기
    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 구체적인 검증 추가
    // 예: 참여 인원수, 총 금액 등 표시 확인
  });

  test('결제 금액 표시 확인', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 결제 금액 표시 확인
    // 예: "15,000원" 형식으로 표시되는지 확인
  });

  test('주문 ID가 없을 때 에러 메시지 표시', async ({ page }) => {
    await page.goto('/payment');

    // 주문 ID가 없을 때 에러 메시지 표시 확인
    // TODO: 실제 UI 컴포넌트 구현 후 에러 메시지 확인
    await expect(page).toHaveURL(/.*\/payment/);
  });

  test('주문 정보 조회 실패 시 에러 메시지 표시', async ({ page }) => {
    // 주문 정보 조회 API 에러 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '주문을 찾을 수 없습니다.',
          success: false,
        }),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 에러 메시지 확인
    // 예: "주문을 찾을 수 없습니다." 메시지 표시 확인
  });

  test('네트워크 오류 시 에러 메시지 및 재시도 옵션 표시', async ({ page }) => {
    // 네트워크 오류 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.abort('failed');
    });

    await page.goto('/payment?orderId=test-order-123');

    // 네트워크 오류 발생 대기
    await page.waitForTimeout(1000);

    // TODO: 실제 UI 컴포넌트 구현 후 에러 메시지 및 재시도 버튼 확인
  });

  test('주문 정보 로딩 중 로딩 상태 표시', async ({ page }) => {
    // 주문 정보 조회 API 지연 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 로딩 상태 표시 확인
    // 예: 스피너 또는 로딩 메시지 표시 확인
  });

  test('결제 진행 플로우 (모킹)', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    // 주문 상태 조회 API 모킹 (결제 대기)
    await page.route('**/api/orders/test-order-123/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderStatusPending),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 결제 버튼 클릭 및 결제 진행 확인
    // 예: 토스페이먼츠 위젯 표시 확인 (모킹)
  });

  test('결제 완료 후 주문 상태 업데이트 확인', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    // 주문 상태 조회 API 모킹 (결제 완료)
    await page.route('**/api/orders/test-order-123/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderStatusPaid),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 결제 완료 상태 표시 확인
  });

  test('결제 실패 시 에러 메시지 및 재시도 옵션 표시', async ({ page }) => {
    // 주문 정보 조회 API 모킹
    await page.route('**/api/orders/test-order-123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGetOrderResponse),
      });
    });

    // 주문 상태 조회 API 모킹 (결제 실패)
    await page.route('**/api/orders/test-order-123/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrderStatusFailed),
      });
    });

    await page.goto('/payment?orderId=test-order-123');

    await page.waitForResponse('**/api/orders/test-order-123');

    // TODO: 실제 UI 컴포넌트 구현 후 결제 실패 메시지 및 재시도 버튼 확인
  });

  test('유효하지 않은 주문 ID로 접근 시 에러 처리', async ({ page }) => {
    // 주문 정보 조회 API 에러 모킹
    await page.route('**/api/orders/invalid-order-id', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '주문을 찾을 수 없습니다.',
          success: false,
        }),
      });
    });

    await page.goto('/payment?orderId=invalid-order-id');

    await page.waitForResponse('**/api/orders/invalid-order-id');

    // TODO: 실제 UI 컴포넌트 구현 후 에러 메시지 및 이전 페이지로 이동 버튼 확인
  });
});
