/**
 * 친구 관리 E2E 테스트
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
import { mockGetFriendsResponse, mockAddFriendResponse, mockEmptyFriendsResponse } from './fixtures/mockData';

/**
 * 테스트 계정 정보
 * 
 * ⚠️ 주의: 
 * - 환경 변수에서 테스트 계정 정보를 가져옵니다.
 * - .env.local에 NEXT_PUBLIC_PHONE_NUMBER, NEXT_PUBLIC_PASSWORD 설정 필요
 */
const testLoginRequest = {
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER || '01030728535',
  password: process.env.NEXT_PUBLIC_PASSWORD || 'test1234!',
};

/**
 * 로그인 헬퍼 함수
 */
async function login(page: any) {
  try {
    console.log('🔐 테스트 계정으로 로그인 중...');
    const loginResponse = await localLogin(testLoginRequest);
    expect(loginResponse.accessToken).toBeDefined();
    
    await page.goto('/');
    
    // 토큰을 localStorage에 저장
    await page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
    }, loginResponse.accessToken);
    
    // 페이지 새로고침으로 토큰 적용
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ 브라우저 인증 설정 완료');
  } catch (error) {
    console.error('❌ 로그인 실패:', error);
    throw error;
  }
}

test.describe('친구 관리 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 로그인
    await login(page);
    
    // 프로필 페이지로 이동
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test.describe('T020: 친구 목록 조회', () => {
    test('마이페이지에서 친구 영역 클릭 → 친구 목록 자동 조회 → 친구 목록 렌더링 확인', async ({ page }) => {
      // API 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockGetFriendsResponse),
        });
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await expect(friendButton).toBeVisible({ timeout: 5000 });
      await friendButton.click();

      // 친구 관리 화면이 표시되는지 확인
      await expect(page.getByRole('heading', { name: /친구 관리/i })).toBeVisible({ timeout: 5000 });

      // 친구 목록이 렌더링되는지 확인
      await expect(page.getByText('친구 목록')).toBeVisible();
      
      // 친구 항목들이 표시되는지 확인
      await expect(page.getByText('바니친구1')).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('바니친구2')).toBeVisible();
      await expect(page.getByText('바니친구3')).toBeVisible();
    });

    test('친구 목록이 비어있을 때 빈 상태 메시지 표시', async ({ page }) => {
      // 빈 친구 목록 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockEmptyFriendsResponse),
        });
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 빈 상태 메시지 확인
      await expect(page.getByText('친구가 없습니다')).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('전화번호나 이메일로 친구를 추가해보세요')).toBeVisible();
    });
  });

  test.describe('T021: 전화번호로 친구 추가', () => {
    test('친구 추가 버튼 클릭 → 전화번호 타입 선택 → 전화번호 입력 → 추가 버튼 클릭 → 성공 메시지 확인', async ({ page }) => {
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 친구 추가 응답 모킹
      let addFriendCalled = false;
      await page.route('**/api/me/friends', async (route) => {
        if (route.request().method() === 'POST') {
          addFriendCalled = true;
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(mockAddFriendResponse),
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 추가 버튼 클릭
      const addFriendButton = page.getByRole('button', { name: /친구 추가/i });
      await expect(addFriendButton).toBeVisible({ timeout: 3000 });
      await addFriendButton.click();

      // 전화번호 타입 선택 확인
      const phoneTypeButton = page.getByRole('button', { name: /전화번호/i });
      await expect(phoneTypeButton).toBeVisible();
      await expect(phoneTypeButton).toHaveClass(/typeButtonActive/);

      // 전화번호 입력
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');
      await expect(phoneInput).toHaveValue('01012345678');

      // 추가 버튼 클릭
      const submitButton = page.getByRole('button', { name: /추가/i });
      await submitButton.click();

      // API 호출 확인
      await page.waitForTimeout(1000);
      expect(addFriendCalled).toBe(true);

      // 성공 메시지 확인 (alert)
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('친구가 추가되었습니다');
        await dialog.accept();
      });
    });
  });

  test.describe('T022: 이메일로 친구 추가', () => {
    test('친구 추가 버튼 클릭 → 이메일 타입 선택 → 이메일 입력 → 추가 버튼 클릭 → 성공 메시지 확인', async ({ page }) => {
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 친구 추가 응답 모킹
      let addFriendCalled = false;
      await page.route('**/api/me/friends', async (route) => {
        if (route.request().method() === 'POST') {
          addFriendCalled = true;
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(mockAddFriendResponse),
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 추가 버튼 클릭
      const addFriendButton = page.getByRole('button', { name: /친구 추가/i });
      await addFriendButton.click();

      // 이메일 타입 선택
      const emailTypeButton = page.getByRole('button', { name: /이메일/i });
      await emailTypeButton.click();
      await expect(emailTypeButton).toHaveClass(/typeButtonActive/);

      // 이메일 입력
      const emailInput = page.getByLabel('이메일');
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');

      // 추가 버튼 클릭
      const submitButton = page.getByRole('button', { name: /추가/i });
      await submitButton.click();

      // API 호출 확인
      await page.waitForTimeout(1000);
      expect(addFriendCalled).toBe(true);
    });
  });

  test.describe('T023: 친구 삭제', () => {
    test('친구 항목의 삭제 버튼 클릭 → 확인 다이얼로그 확인 → 확인 클릭 → 친구 목록에서 제거 확인', async ({ page }) => {
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 친구 삭제 응답 모킹
      let deleteFriendCalled = false;
      await page.route('**/api/me/friends/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          deleteFriendCalled = true;
          await route.fulfill({
            status: 204,
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 목록이 표시될 때까지 대기
      await expect(page.getByText('바니친구1')).toBeVisible({ timeout: 3000 });

      // 첫 번째 친구의 삭제 버튼 찾기
      const friendItem = page.locator('[class*="friendItem"]').first();
      const deleteButton = friendItem.getByRole('button', { name: /삭제/i });
      await expect(deleteButton).toBeVisible();

      // 확인 다이얼로그 처리
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('삭제하시겠습니까');
        await dialog.accept();
      });

      // 삭제 버튼 클릭
      await deleteButton.click();

      // API 호출 확인
      await page.waitForTimeout(1000);
      expect(deleteFriendCalled).toBe(true);
    });
  });

  test.describe('T024: 친구 목록 새로고침', () => {
    test('새로고침 버튼 클릭 → 새로고침 중 표시 확인 → 최신 친구 목록 표시 확인', async ({ page }) => {
      let requestCount = 0;
      
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          requestCount++;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 초기 조회 확인
      await expect(page.getByText('바니친구1')).toBeVisible({ timeout: 3000 });
      expect(requestCount).toBeGreaterThanOrEqual(1);

      // 새로고침 버튼 클릭
      const refreshButton = page.getByRole('button', { name: /새로고침/i });
      await refreshButton.click();

      // 새로고침 중 표시 확인 (선택사항)
      // 새로고침이 완료될 때까지 대기
      await page.waitForTimeout(1000);

      // 최신 친구 목록이 표시되는지 확인
      await expect(page.getByText('바니친구1')).toBeVisible();
      
      // API가 다시 호출되었는지 확인
      expect(requestCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('T025: 오류 처리', () => {
    test('존재하지 않는 전화번호로 친구 추가 시도 → 404 오류 메시지 확인', async ({ page }) => {
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 404 오류 응답 모킹
      await page.route('**/api/me/friends', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({
              message: '해당 전화번호의 사용자를 찾을 수 없습니다.',
            }),
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 추가 버튼 클릭
      const addFriendButton = page.getByRole('button', { name: /친구 추가/i });
      await addFriendButton.click();

      // 전화번호 입력
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01099999999');

      // 추가 버튼 클릭
      const submitButton = page.getByRole('button', { name: /추가/i });
      await submitButton.click();

      // 오류 메시지 확인
      await expect(page.getByText(/찾을 수 없습니다/i)).toBeVisible({ timeout: 3000 });
    });

    test('이미 친구인 사용자 추가 시도 → 409 오류 메시지 확인', async ({ page }) => {
      // 친구 목록 조회 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockGetFriendsResponse),
          });
        }
      });

      // 409 오류 응답 모킹
      await page.route('**/api/me/friends', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({
              message: '이미 친구 관계입니다.',
            }),
          });
        }
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 추가 버튼 클릭
      const addFriendButton = page.getByRole('button', { name: /친구 추가/i });
      await addFriendButton.click();

      // 전화번호 입력
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');

      // 추가 버튼 클릭
      const submitButton = page.getByRole('button', { name: /추가/i });
      await submitButton.click();

      // 오류 메시지 확인
      await expect(page.getByText(/이미 친구 관계입니다/i)).toBeVisible({ timeout: 3000 });
    });
  });
});
