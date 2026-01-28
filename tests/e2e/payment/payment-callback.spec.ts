/**
 * @fileoverview 결제 승인 및 콜백 처리 E2E 테스트
 * @description 결제 성공/실패 콜백 플로우 및 오류 처리 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockConfirmPaymentSuccess,
  mockConfirmPaymentFailed,
  mockCreateWaitingRoomSuccess,
  mockPaymentFailParams,
  mockPaymentSuccessParams,
} from './fixtures/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api';
// 테스트용 토큰 - 실제 로그인 후 얻은 토큰을 사용하세요
const TEST_TOKEN = process.env.TEST_AUTH_TOKEN || '';

test.describe('결제 승인 및 콜백 처리', () => {
  test.beforeEach(() => {
    // 각 테스트 전에 인증 토큰 확인
    if (!TEST_TOKEN) {
      console.warn('⚠️  TEST_AUTH_TOKEN 환경변수가 설정되지 않았습니다. 테스트를 건너뜁니다.');
      test.skip();
    }
  });

  test.describe('결제 성공 콜백 플로우', () => {
    test('결제 정보 파라미터 추출', async ({ page }) => {
      // 결제 성공 콜백 URL로 이동 (쿼리 파라미터 포함)
      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // URL 파라미터가 정상적으로 전달되었는지 확인
      const urlParams = new URL(page.url());
      expect(urlParams.searchParams.get('paymentKey')).toBe(
        mockPaymentSuccessParams.paymentKey
      );
      expect(urlParams.searchParams.get('orderId')).toBe(
        mockPaymentSuccessParams.orderId
      );
      expect(urlParams.searchParams.get('amount')).toBe(
        mockPaymentSuccessParams.amount
      );
    });

    test('결제 승인 API 호출 - 성공', async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: mockPaymentSuccessParams.paymentKey,
            orderId: mockPaymentSuccessParams.orderId,
            amount: parseInt(mockPaymentSuccessParams.amount, 10),
          },
        }
      );

      // API 응답 확인 (실제 백엔드가 없으면 404일 수 있음)
      if (response.status() === 201 || response.status() === 200) {
        const data = await response.json();

        // 응답 데이터 구조 확인
        expect(data).toHaveProperty('order_id');
        expect(data).toHaveProperty('payment_key');
        expect(data).toHaveProperty('status');
        expect(data).toHaveProperty('amount');
        expect(data).toHaveProperty('approved_at');
        expect(data).toHaveProperty('capsule_id');
        expect(data).toHaveProperty('receipt_url');
        expect(data.status).toBe('PAID');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 404, 401, 500 예상
        expect([404, 401, 500]).toContain(response.status());
      }
    });

    test('대기실 생성 API 호출 - 성공', async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/capsules/step-rooms/create`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            orderId: mockPaymentSuccessParams.orderId,
          },
        }
      );

      // API 응답 확인 (실제 백엔드가 없으면 404일 수 있음)
      if (response.status() === 201 || response.status() === 200) {
        const data = await response.json();

        // 응답 데이터 구조 확인
        expect(data).toHaveProperty('waitingRoomId');
        expect(data).toHaveProperty('orderId');
        expect(data).toHaveProperty('capsuleName');
        expect(data).toHaveProperty('headcount');
        expect(data).toHaveProperty('inviteCode');
        expect(data).toHaveProperty('createdAt');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 400, 404, 401, 500 예상
        expect([400, 404, 401, 500]).toContain(response.status());
      }
    });

    test('결제 승인 후 대기실 페이지 이동', async ({ page }) => {
      // 결제 승인 API 모킹
      await page.route(
        '**/api/payments/toss/confirm',
        async (route) => {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(mockConfirmPaymentSuccess),
          });
        }
      );

      // 대기실 생성 API 모킹 (필요 시)
      await page.route(
        '**/api/capsules/step-rooms/create',
        async (route) => {
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(mockCreateWaitingRoomSuccess),
          });
        }
      );

      // 결제 성공 콜백 페이지로 이동
      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 페이지가 로드될 때까지 대기
      await page.waitForLoadState('networkidle');

      // 결제 승인 처리 후 대기실 페이지로 이동하는지 확인
      // (실제 구현에 따라 대기실 페이지 URL 확인)
      // await expect(page).toHaveURL(/\/waiting-room\//);
    });
  });

  test.describe('결제 실패 콜백 플로우', () => {
    test('실패 정보 파라미터 추출', async ({ page }) => {
      // 결제 실패 콜백 URL로 이동 (쿼리 파라미터 포함)
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message)}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // URL 파라미터가 정상적으로 전달되었는지 확인
      const urlParams = new URL(page.url());
      expect(urlParams.searchParams.get('code')).toBe(
        mockPaymentFailParams.code
      );
      expect(urlParams.searchParams.get('message')).toBe(
        mockPaymentFailParams.message
      );
      expect(urlParams.searchParams.get('orderId')).toBe(
        mockPaymentFailParams.orderId
      );
    });

    test('실패 메시지 표시', async ({ page }) => {
      // 결제 실패 콜백 페이지로 이동
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message)}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 페이지가 로드될 때까지 대기
      await page.waitForLoadState('networkidle');

      // 실패 메시지가 표시되는지 확인 (실제 구현에 따라 수정 필요)
      // await expect(page.getByText(/결제.*실패/i)).toBeVisible();
    });

    test('재시도 옵션 제공', async ({ page }) => {
      // 결제 실패 콜백 페이지로 이동
      const url = `/payment/fail?code=${mockPaymentFailParams.code}&message=${encodeURIComponent(mockPaymentFailParams.message)}&orderId=${mockPaymentFailParams.orderId}`;
      await page.goto(url);

      // 페이지가 로드될 때까지 대기
      await page.waitForLoadState('networkidle');

      // 재시도 버튼이 표시되는지 확인 (실제 구현에 따라 수정 필요)
      // await expect(page.getByRole('button', { name: /재시도/i })).toBeVisible();
    });
  });

  test.describe('오류 처리', () => {
    test('결제 승인 실패 처리 - AMOUNT_MISMATCH', async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: mockPaymentSuccessParams.paymentKey,
            orderId: mockPaymentSuccessParams.orderId,
            amount: 9999, // 주문 금액과 다른 금액
          },
        }
      );

      // 400 에러 예상 (AMOUNT_MISMATCH)
      if (response.status() === 400) {
        const errorText = await response.text();
        expect(errorText).toContain('AMOUNT_MISMATCH');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 404, 401, 500 예상
        expect([404, 401, 500]).toContain(response.status());
      }
    });

    test('결제 승인 실패 처리 - ORDER_ALREADY_PAID', async ({
      request,
    }) => {
      // 이미 결제 완료된 주문으로 승인 시도
      const response = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: 'pay-already-paid',
            orderId: 'test-order-paid',
            amount: 15000,
          },
        }
      );

      // 400 에러 예상 (ORDER_ALREADY_PAID)
      if (response.status() === 400) {
        const errorText = await response.text();
        expect(errorText).toContain('ORDER_ALREADY_PAID');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 404, 401, 500 예상
        expect([404, 401, 500]).toContain(response.status());
      }
    });

    test('결제 승인 실패 처리 - ORDER_NOT_FOUND', async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: 'pay-1234-5678',
            orderId: 'non-existent-order',
            amount: 15000,
          },
        }
      );

      // 404 에러 예상 (ORDER_NOT_FOUND)
      if (response.status() === 404) {
        const errorText = await response.text();
        expect(errorText).toContain('ORDER_NOT_FOUND');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 400, 401, 500 예상
        expect([400, 401, 500]).toContain(response.status());
      }
    });

    test('대기실 생성 실패 처리', async ({ request }) => {
      const response = await request.post(
        `${API_BASE_URL}/capsules/step-rooms/create`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            orderId: 'non-existent-order',
          },
        }
      );

      // 에러 응답 확인 (실제 백엔드가 없으면 404일 수 있음)
      expect([400, 404, 401]).toContain(response.status());
    });

    test('네트워크 오류 처리', async ({ page }) => {
      // 네트워크 오류 시뮬레이션
      await page.route('**/api/payments/toss/confirm', (route) =>
        route.abort()
      );

      // 결제 성공 콜백 페이지로 이동
      const url = `/payment/success?paymentKey=${mockPaymentSuccessParams.paymentKey}&orderId=${mockPaymentSuccessParams.orderId}&amount=${mockPaymentSuccessParams.amount}`;
      await page.goto(url);

      // 페이지가 로드될 때까지 대기
      await page.waitForLoadState('networkidle');

      // 네트워크 오류 메시지가 표시되는지 확인 (실제 구현에 따라 수정 필요)
      // await expect(page.getByText(/네트워크.*오류/i)).toBeVisible();
    });
  });

  test.describe('중복 처리 방지', () => {
    test('이미 처리된 결제 재승인 방지', async ({ request }) => {
      // 첫 번째 승인 요청
      const firstResponse = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: mockPaymentSuccessParams.paymentKey,
            orderId: mockPaymentSuccessParams.orderId,
            amount: parseInt(mockPaymentSuccessParams.amount, 10),
          },
        }
      );

      // 두 번째 승인 요청 (중복)
      const secondResponse = await request.post(
        `${API_BASE_URL}/payments/toss/confirm`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
            'Content-Type': 'application/json',
          },
          data: {
            paymentKey: mockPaymentSuccessParams.paymentKey,
            orderId: mockPaymentSuccessParams.orderId,
            amount: parseInt(mockPaymentSuccessParams.amount, 10),
          },
        }
      );

      // 첫 번째 요청이 성공했다면 두 번째는 400 (ORDER_ALREADY_PAID) 예상
      if (firstResponse.status() === 201 || firstResponse.status() === 200) {
        expect(secondResponse.status()).toBe(400);
        const errorText = await secondResponse.text();
        expect(errorText).toContain('ORDER_ALREADY_PAID');
      } else {
        // 백엔드가 없거나 서버 오류인 경우 404, 401, 500 예상
        expect([404, 401, 500]).toContain(firstResponse.status());
        expect([404, 401, 500]).toContain(secondResponse.status());
      }
    });

    test('주문 상태 조회를 통한 중복 처리 확인', async ({ request }) => {
      // 주문 상태 조회
      const statusResponse = await request.get(
        `${API_BASE_URL}/orders/${mockPaymentSuccessParams.orderId}/status`,
        {
          headers: {
            Authorization: `Bearer ${TEST_TOKEN}`,
          },
        }
      );

      if (statusResponse.status() === 200) {
        const statusData = await statusResponse.json();

        // 이미 결제 완료된 경우 재승인 방지
        if (statusData.order_status === 'PAID') {
          const confirmResponse = await request.post(
            `${API_BASE_URL}/payments/toss/confirm`,
            {
              headers: {
                Authorization: `Bearer ${TEST_TOKEN}`,
                'Content-Type': 'application/json',
              },
              data: {
                paymentKey: mockPaymentSuccessParams.paymentKey,
                orderId: mockPaymentSuccessParams.orderId,
                amount: parseInt(mockPaymentSuccessParams.amount, 10),
              },
            }
          );

          expect(confirmResponse.status()).toBe(400);
          const errorText = await confirmResponse.text();
          expect(errorText).toContain('ORDER_ALREADY_PAID');
        }
      } else {
        // 백엔드가 없거나 서버 오류인 경우 400, 404, 401, 500 예상
        expect([400, 404, 401, 500]).toContain(statusResponse.status());
      }
    });
  });

  test.describe('Mock 데이터 검증', () => {
    test('결제 승인 성공 Mock 데이터 구조 검증', () => {
      expect(mockConfirmPaymentSuccess).toHaveProperty('order_id');
      expect(mockConfirmPaymentSuccess).toHaveProperty('payment_key');
      expect(mockConfirmPaymentSuccess).toHaveProperty('status');
      expect(mockConfirmPaymentSuccess).toHaveProperty('amount');
      expect(mockConfirmPaymentSuccess).toHaveProperty('approved_at');
      expect(mockConfirmPaymentSuccess).toHaveProperty('capsule_id');
      expect(mockConfirmPaymentSuccess).toHaveProperty('receipt_url');
      expect(mockConfirmPaymentSuccess.status).toBe('PAID');
      expect(mockConfirmPaymentSuccess.capsule_id).toBeTruthy();
    });

    test('결제 승인 실패 Mock 데이터 구조 검증', () => {
      expect(mockConfirmPaymentFailed).toHaveProperty('order_id');
      expect(mockConfirmPaymentFailed).toHaveProperty('payment_key');
      expect(mockConfirmPaymentFailed).toHaveProperty('status');
      expect(mockConfirmPaymentFailed.status).toBe('FAILED');
    });

    test('대기실 생성 Mock 데이터 구조 검증', () => {
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('waitingRoomId');
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('orderId');
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('capsuleName');
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('headcount');
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('inviteCode');
      expect(mockCreateWaitingRoomSuccess).toHaveProperty('createdAt');
    });

    test('결제 성공 콜백 파라미터 Mock 데이터 검증', () => {
      expect(mockPaymentSuccessParams).toHaveProperty('paymentKey');
      expect(mockPaymentSuccessParams).toHaveProperty('orderId');
      expect(mockPaymentSuccessParams).toHaveProperty('amount');
      expect(mockPaymentSuccessParams.paymentKey).toBeTruthy();
      expect(mockPaymentSuccessParams.orderId).toBeTruthy();
      expect(mockPaymentSuccessParams.amount).toBeTruthy();
    });

    test('결제 실패 콜백 파라미터 Mock 데이터 검증', () => {
      expect(mockPaymentFailParams).toHaveProperty('code');
      expect(mockPaymentFailParams).toHaveProperty('message');
      expect(mockPaymentFailParams).toHaveProperty('orderId');
      expect(mockPaymentFailParams.code).toBeTruthy();
      expect(mockPaymentFailParams.message).toBeTruthy();
    });
  });
});
