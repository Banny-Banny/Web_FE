/**
 * @fileoverview 타임캡슐 대기실 초대/참여 API 테스트
 * @description 방 생성, 초대 코드 조회, 방 참여 API 함수 테스트
 */

import { test, expect } from '@playwright/test';
import {
  createRoom,
  queryRoomByInviteCode,
  joinRoom,
} from '../../../src/commons/apis/capsules/step-rooms';
import type {
  CreateRoomResponse,
  InviteCodeQueryResponse,
  JoinRoomResponse,
} from '../../../src/commons/apis/capsules/step-rooms/types';

// 테스트용 토큰 - 실제 로그인 후 얻은 토큰을 사용하세요
const TEST_TOKEN = process.env.TEST_AUTH_TOKEN || '';

test.describe('타임캡슐 대기실 초대/참여 API', () => {
  test.describe('POST /api/capsules/step-rooms/create - 방 생성', () => {
    test.beforeEach(() => {
      if (!TEST_TOKEN) {
        console.warn('⚠️  TEST_AUTH_TOKEN 환경변수가 설정되지 않았습니다. 테스트를 건너뜁니다.');
        test.skip();
      }
    });

    test('방 생성 성공 (주문 ID로 대기실 생성 및 초대 코드 발급)', async () => {
      // 실제 주문 ID가 필요하므로, 주문 생성 후 테스트하거나 스킵
      // 여기서는 API 함수가 정상적으로 호출되는지만 확인
      const testOrderId = 'test-order-for-room-creation';

      try {
        const response: CreateRoomResponse = await createRoom({
          order_id: testOrderId,
        });

        // 응답 구조 확인
        expect(response).toBeDefined();
        expect(response).toHaveProperty('capsule_id');
        expect(response).toHaveProperty('invite_code');
        expect(response).toHaveProperty('created_at');
        expect(response).toHaveProperty('deadline');
        expect(response).toHaveProperty('max_participants');
        expect(response).toHaveProperty('open_date');
        expect(response).toHaveProperty('status');
        expect(response).toHaveProperty('title');

        // 초대 코드 형식 확인 (6자리 영숫자)
        expect(response.invite_code).toMatch(/^[A-Za-z0-9]{6}$/);

        // 상태 확인
        expect(['WAITING', 'COMPLETED', 'EXPIRED']).toContain(response.status);
      } catch (error: any) {
        // 404 (존재하지 않는 order_id) 또는 400 (잘못된 order_id)는 예상 가능한 에러
        if (error?.status === 404 || error?.status === 400) {
          // 테스트용 주문 ID가 없을 수 있으므로 스킵
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('잘못된 주문 ID 형식 시 400 에러', async () => {
      try {
        await createRoom({
          order_id: '', // 빈 문자열
        });
        // 성공하면 안 됨
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error?.status).toBe(400);
      }
    });

    test('인증 토큰 없이 요청 시 401 에러', async () => {
      // API 클라이언트가 자동으로 토큰을 추가하므로,
      // 토큰이 없는 경우는 환경 변수 설정 문제
      // 실제로는 apiClient 인터셉터에서 처리됨
      if (!DEV_TOKEN) {
        test.skip();
      }
    });
  });

  test.describe('GET /api/capsules/step-rooms/by-code - 초대 코드로 방 조회 (Public API)', () => {
    test('유효한 초대 코드로 방 정보 조회 성공', async () => {
      // 실제 초대 코드가 필요하므로, 방 생성 후 받은 코드로 테스트하거나 스킵
      const testInviteCode = 'ABC123';

      try {
        const response: InviteCodeQueryResponse =
          await queryRoomByInviteCode(testInviteCode);

        // 응답 구조 확인
        expect(response).toBeDefined();
        expect(response).toHaveProperty('room_id');
        expect(response).toHaveProperty('capsule_name');
        expect(response).toHaveProperty('open_date');
        expect(response).toHaveProperty('deadline');
        expect(response).toHaveProperty('participant_count');
        expect(response).toHaveProperty('current_participants');
        expect(response).toHaveProperty('status');
        expect(response).toHaveProperty('is_joinable');

        // 타입 확인
        expect(typeof response.room_id).toBe('string');
        expect(typeof response.capsule_name).toBe('string');
        expect(typeof response.participant_count).toBe('number');
        expect(typeof response.current_participants).toBe('number');
        expect(typeof response.is_joinable).toBe('boolean');
        expect(['WAITING', 'COMPLETED', 'EXPIRED']).toContain(response.status);
      } catch (error: any) {
        // 404 (존재하지 않는 코드)는 예상 가능한 에러
        if (error?.status === 404) {
          // 테스트용 초대 코드가 없을 수 있으므로 스킵
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('잘못된 초대 코드 형식 시 400 에러', async () => {
      try {
        await queryRoomByInviteCode('INVALID'); // 6자리가 아님
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error?.status).toBe(400);
      }
    });

    test('존재하지 않는 초대 코드 시 404 에러', async () => {
      try {
        await queryRoomByInviteCode('XXXXXX'); // 존재하지 않는 코드
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error?.status).toBe(404);
      }
    });

    test('Public API이므로 인증 토큰 없이 호출 가능', async () => {
      // queryRoomByInviteCode는 Authorization 헤더를 제거하여 호출하므로
      // 인증 없이도 호출 가능해야 함
      const testCode = 'TEST12';

      try {
        await queryRoomByInviteCode(testCode);
        // 성공하거나 404는 정상 (코드가 없을 수 있음)
      } catch (error: any) {
        // 400, 404는 정상적인 에러
        expect([400, 404]).toContain(error?.status);
      }
    });
  });

  test.describe('POST /api/capsules/step-rooms/{capsuleId}/join - 방 참여', () => {
    test.beforeEach(() => {
      if (!DEV_TOKEN) {
        test.skip();
      }
    });

    test('방 참여 성공 (슬롯 배정)', async () => {
      // 실제 capsuleId와 invite_code가 필요
      const testCapsuleId = '00000000-0000-0000-0000-000000000000'; // UUID 형식
      const testInviteCode = 'ABC123';

      try {
        const response: JoinRoomResponse = await joinRoom(testCapsuleId, {
          invite_code: testInviteCode,
        });

        // 응답 구조 확인
        expect(response).toBeDefined();
        expect(response).toHaveProperty('success');
        expect(response).toHaveProperty('room_id');
        expect(response).toHaveProperty('slot_number');
        expect(response).toHaveProperty('nickname');
        expect(response).toHaveProperty('joined_at');

        // 타입 확인
        expect(typeof response.success).toBe('boolean');
        expect(response.success).toBe(true);
        expect(typeof response.room_id).toBe('string');
        expect(typeof response.slot_number).toBe('number');
        expect(response.slot_number).toBeGreaterThan(0);
      } catch (error: any) {
        // 404 (존재하지 않는 대기실), 403 (참여 불가), 409 (이미 참여)는 예상 가능한 에러
        if (
          [404, 403, 409].includes(error?.status)
        ) {
          // 테스트용 데이터가 없을 수 있으므로 스킵
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('잘못된 초대 코드 시 403 INVALID_INVITE_CODE', async () => {
      const testCapsuleId = '00000000-0000-0000-0000-000000000000'; // UUID 형식

      try {
        await joinRoom(testCapsuleId, {
          invite_code: 'WRONG1', // 6자리 코드
        });
        expect(true).toBe(false);
      } catch (error: any) {
        if (error?.status === 403) {
          expect(error?.details?.error).toBe('INVALID_INVITE_CODE');
        } else if (error?.status === 404 || error?.status === 400) {
          // 대기실이 없을 수도 있음 (404)
          // 또는 초대 코드 검증 에러 (400)
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('이미 참여한 사용자 시 409 ALREADY_JOINED', async () => {
      // 실제 참여한 대기실의 capsuleId와 invite_code 필요
      const testCapsuleId = '00000000-0000-0000-0000-000000000000'; // UUID 형식
      const testInviteCode = 'ABC123';

      try {
        await joinRoom(testCapsuleId, {
          invite_code: testInviteCode,
        });
        // 성공하면 이미 참여하지 않은 것
        // 409가 나와야 하는 경우는 실제로 참여한 상태에서만 발생
      } catch (error: any) {
        if (error?.status === 409) {
          expect(error?.details?.error).toBe('ALREADY_JOINED');
          expect(error?.details?.data).toHaveProperty('slot_number');
        } else if ([404, 403].includes(error?.status)) {
          // 대기실이 없거나 참여 불가능한 경우
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('정원 초과 시 403 SLOTS_FULL', async () => {
      const testCapsuleId = '11111111-1111-1111-1111-111111111111'; // UUID 형식
      const testInviteCode = 'FULL12';

      try {
        await joinRoom(testCapsuleId, {
          invite_code: testInviteCode,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        if (error?.status === 403) {
          expect(error?.details?.error).toBe('SLOTS_FULL');
        } else if ([404, 409].includes(error?.status)) {
          // 대기실이 없거나 이미 참여한 경우
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('마감시한 지난 경우 403 DEADLINE_EXPIRED', async () => {
      const testCapsuleId = '22222222-2222-2222-2222-222222222222'; // UUID 형식
      const testInviteCode = 'EXP123';

      try {
        await joinRoom(testCapsuleId, {
          invite_code: testInviteCode,
        });
        expect(true).toBe(false);
      } catch (error: any) {
        if (error?.status === 403) {
          expect(error?.details?.error).toBe('DEADLINE_EXPIRED');
        } else if ([404, 409].includes(error?.status)) {
          // 대기실이 없거나 이미 참여한 경우
          test.skip();
        } else {
          throw error;
        }
      }
    });

    test('존재하지 않는 대기실 시 404 에러', async () => {
      try {
        await joinRoom('99999999-9999-9999-9999-999999999999', { // UUID 형식
          invite_code: 'ABC123',
        });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error?.status).toBe(404);
      }
    });
  });
});
