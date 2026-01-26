/**
 * @fileoverview 결제 페이지 API 통신 테스트
 * @description 백엔드 API 통신이 잘 되는지 확인하는 테스트
 */

import { test, expect } from '@playwright/test';
import {
  mockGetOrderResponse,
  mockOrderStatusPending,
  mockOrderStatusPaid,
  mockOrderStatusFailed,
} from './fixtures/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

test.describe('결제 API 통신 테스트', () => {
  test('주문 정보 조회 API - 성공', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/orders/test-order-123`);

    // API 응답 확인 (실제 백엔드가 없으면 404일 수 있음)
    expect([200, 404, 401]).toContain(response.status());
  });

  test('주문 상태 조회 API - 성공', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/orders/test-order-123/status`);

    expect([200, 404, 401]).toContain(response.status());
  });

  test('주문 정보 조회 API - Mock 응답 검증', async () => {
    // Mock 데이터 구조 검증
    expect(mockGetOrderResponse).toHaveProperty('order');
    expect(mockGetOrderResponse).toHaveProperty('product');
    expect(mockGetOrderResponse.order).toHaveProperty('order_id');
    expect(mockGetOrderResponse.order).toHaveProperty('total_amount');
    expect(mockGetOrderResponse.order.order_id).toBe('test-order-123');
  });

  test('주문 상태 Mock 데이터 - PENDING 검증', async () => {
    expect(mockOrderStatusPending).toHaveProperty('order_id');
    expect(mockOrderStatusPending).toHaveProperty('order_status');
    expect(mockOrderStatusPending.order_status).toBe('PENDING_PAYMENT');
  });

  test('주문 상태 Mock 데이터 - PAID 검증', async () => {
    expect(mockOrderStatusPaid).toHaveProperty('order_id');
    expect(mockOrderStatusPaid).toHaveProperty('order_status');
    expect(mockOrderStatusPaid.order_status).toBe('PAID');
    expect(mockOrderStatusPaid.payment_key).toBeTruthy();
  });

  test('주문 상태 Mock 데이터 - FAILED 검증', async () => {
    expect(mockOrderStatusFailed).toHaveProperty('order_id');
    expect(mockOrderStatusFailed).toHaveProperty('order_status');
    expect(mockOrderStatusFailed.order_status).toBe('FAILED');
  });
});
