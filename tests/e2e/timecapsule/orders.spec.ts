/**
 * @fileoverview 타임캡슐 주문 관리 API 테스트
 * @description 타임캡슐 주문 생성, 조회, 상태 관리 API 테스트
 */

import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : 'http://localhost:3000/api';
// 테스트용 토큰 - NEXT_PUBLIC_DEV_TOKEN 환경변수 사용
const TEST_TOKEN = process.env.NEXT_PUBLIC_DEV_TOKEN || '';
const PRODUCT_ID = process.env.NEXT_PUBLIC_TIMECAPSULE_PRODUCT_ID || 'time-capsule-product-1';

test.describe('타임캡슐 주문 관리 API', () => {
  test.beforeEach(() => {
    // 각 테스트 전에 인증 토큰 확인
    if (!TEST_TOKEN) {
      console.warn('⚠️  NEXT_PUBLIC_DEV_TOKEN 환경변수가 설정되지 않았습니다. 테스트를 건너뜁니다.');
      test.skip();
    }
    if (!PRODUCT_ID) {
      test.skip();
    }
  });

  test.describe('POST /api/orders - 주문 생성', () => {
    test('주문 생성 성공', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_MONTH',
          headcount: 5,
          photo_count: 5, // headcount 이하로 설정 (백엔드 제한)
          add_music: false,
          add_video: false,
        },
      });

      // 응답 상태 확인
      if (response.status() !== 201) {
        const errorText = await response.text();
        console.error('주문 생성 실패:', {
          status: response.status(),
          error: errorText,
          url: `${API_BASE_URL}/orders`,
        });
      }

      expect(response.status()).toBe(201);
      
      const data = await response.json();
      
      // 응답 데이터 구조 확인
      expect(data).toHaveProperty('order_id');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('total_amount');
      expect(data).toHaveProperty('time_option');
      expect(data).toHaveProperty('headcount');
      expect(data).toHaveProperty('photo_count');
      expect(data).toHaveProperty('add_music');
      expect(data).toHaveProperty('add_video');
      expect(data.status).toBe('PENDING_PAYMENT');
      expect(typeof data.order_id).toBe('string');
      expect(typeof data.total_amount).toBe('number');
      expect(['1_WEEK', '1_MONTH', '1_YEAR', 'CUSTOM']).toContain(data.time_option);
    });

    test('필수 필드 누락 시 400 에러', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          // product_id 누락
          time_option: '1_MONTH',
          headcount: 5,
        },
      });

      expect(response.status()).toBe(400);
    });

    test('인증 토큰 없이 요청 시 401 에러', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_MONTH',
          headcount: 5,
        },
      });

      expect(response.status()).toBe(401);
    });

    test('CUSTOM 타임 옵션에서 custom_open_at 누락 시 400 에러', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: 'CUSTOM',
          // custom_open_at 누락
          headcount: 5,
        },
      });

      expect(response.status()).toBe(400);
    });

    test('CUSTOM 타임 옵션에서 과거 날짜 선택 시 400 에러', async ({ request }) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: 'CUSTOM',
          custom_open_at: yesterday.toISOString(),
          headcount: 5,
        },
      });

      expect(response.status()).toBe(400);
    });

    test('headcount가 1~10 범위를 벗어날 때 400 에러', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_MONTH',
          headcount: 11, // 범위 초과
        },
      });

      expect(response.status()).toBe(400);
    });

    test('photo_count가 headcount를 초과할 때 400 에러', async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_MONTH',
          headcount: 5,
          photo_count: 6, // headcount 초과
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /api/orders/{id} - 주문 상세 조회', () => {
    let createdOrderId: string;

    test.beforeAll(async ({ request }) => {
      // 테스트용 주문 생성
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_MONTH',
          headcount: 3,
          photo_count: 3, // headcount 이하로 설정 (백엔드 제한)
        },
      });

      if (response.status() !== 201) {
        const errorText = await response.text();
        throw new Error(`주문 생성 실패: ${response.status()} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.order_id) {
        throw new Error(`주문 ID가 응답에 없습니다: ${JSON.stringify(data)}`);
      }
      createdOrderId = data.order_id;
    });

    test('주문 상세 조회 성공', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/${createdOrderId}`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });

      expect(response.status()).toBe(200);

      const data = await response.json();
      // 응답 구조: { order: {...}, product: {...} }
      expect(data).toHaveProperty('order');
      expect(data).toHaveProperty('product');
      expect(data.order).toHaveProperty('order_id', createdOrderId);
      expect(data.order).toHaveProperty('status');
      expect(data.order).toHaveProperty('total_amount');
    });

    test('존재하지 않는 주문 조회 시 에러', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/non-existent-order-id`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });

      // 백엔드에서 잘못된 UUID 형식에 대해 400 반환
      expect([400, 404]).toContain(response.status());
    });

    test('인증 토큰 없이 요청 시 401 에러', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/${createdOrderId}`);

      expect(response.status()).toBe(401);
    });
  });

  test.describe('GET /api/orders/{id}/status - 주문 상태 조회', () => {
    let createdOrderId: string;

    test.beforeAll(async ({ request }) => {
      // 테스트용 주문 생성
      const response = await request.post(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          product_id: PRODUCT_ID,
          time_option: '1_WEEK',
          headcount: 2,
          photo_count: 2, // headcount 이하로 설정 (백엔드 제한)
        },
      });

      if (response.status() !== 201) {
        const errorText = await response.text();
        throw new Error(`주문 생성 실패: ${response.status()} - ${errorText}`);
      }

      const data = await response.json();
      if (!data.order_id) {
        throw new Error(`주문 ID가 응답에 없습니다: ${JSON.stringify(data)}`);
      }
      createdOrderId = data.order_id;
    });

    test('주문 상태 조회 성공', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/orders/${createdOrderId}/status`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('order_id', createdOrderId);
      expect(data).toHaveProperty('order_status');
      expect(data).toHaveProperty('total_amount');
      expect(['PENDING_PAYMENT', 'PAID', 'CANCELLED', 'FAILED']).toContain(data.order_status);
    });
  });
});
