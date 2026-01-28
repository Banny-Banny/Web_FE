/**
 * 친구 관리 UI 테스트
 * 375px 모바일 프레임 기준 렌더링, 상호작용, 시각적 검증 통합
 */

import { test, expect } from '@playwright/test';
import { mockGetFriendsResponse, mockEmptyFriendsResponse } from './fixtures/mockData';

test.describe('친구 관리 UI 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 모바일 뷰포트 설정 (375px 기준)
    await page.setViewportSize({ width: 375, height: 667 });
    
    // API 모킹 설정
    await page.route('**/api/me/friends*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockGetFriendsResponse),
        });
      }
    });

    // 프로필 페이지로 이동
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test.describe('T026: 컴포넌트 렌더링', () => {
    test('친구 목록 컴포넌트 렌더링 확인 → 헤더, 정보 섹션, 친구 목록 영역 확인', async ({ page }) => {
      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 헤더 확인
      await expect(page.getByRole('heading', { name: /친구 관리/i })).toBeVisible({ timeout: 3000 });
      
      // 정보 섹션 확인
      await expect(page.getByText(/친구 목록/)).toBeVisible();
      
      // 친구 목록 영역 확인
      await expect(page.getByText('바니친구1')).toBeVisible({ timeout: 3000 });
      await expect(page.getByText('바니친구2')).toBeVisible();
    });
  });

  test.describe('T027: 로딩 상태 표시', () => {
    test('친구 목록 조회 중 로딩 메시지 표시 확인', async ({ page }) => {
      // 느린 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockGetFriendsResponse),
        });
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 로딩 메시지 확인
      await expect(page.getByText(/불러오는 중/i)).toBeVisible({ timeout: 500 });
    });
  });

  test.describe('T028: 오류 상태 표시', () => {
    test('API 오류 발생 시 오류 메시지 표시 확인 → 재시도 버튼 표시 확인', async ({ page }) => {
      // 오류 응답 모킹
      await page.route('**/api/me/friends*', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: '서버 오류가 발생했습니다.',
          }),
        });
      });

      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 오류 메시지 확인
      await expect(page.getByText(/오류가 발생했습니다/i)).toBeVisible({ timeout: 3000 });
      
      // 재시도 버튼 확인
      await expect(page.getByRole('button', { name: /다시 시도/i })).toBeVisible();
    });
  });

  test.describe('T029: 빈 상태 표시', () => {
    test('친구 목록이 비어있을 때 안내 메시지 표시 확인', async ({ page }) => {
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
      await expect(page.getByText(/전화번호나 이메일로 친구를 추가해보세요/i)).toBeVisible();
    });
  });

  test.describe('T030: 친구 추가 폼 상호작용', () => {
    test('친구 추가 버튼 클릭 시 폼 표시 확인 → 전화번호/이메일 타입 전환 확인 → 입력 필드 검증 오류 메시지 표시 확인', async ({ page }) => {
      // 친구 영역 클릭
      const friendButton = page.getByRole('button', { name: /친구/i });
      await friendButton.click();

      // 친구 추가 버튼 클릭
      const addFriendButton = page.getByRole('button', { name: /친구 추가/i });
      await addFriendButton.click();

      // 폼이 표시되는지 확인
      await expect(page.getByLabel('전화번호')).toBeVisible({ timeout: 1000 });

      // 전화번호 타입이 기본 선택되어 있는지 확인
      const phoneTypeButton = page.getByRole('button', { name: /전화번호/i });
      await expect(phoneTypeButton).toHaveClass(/typeButtonActive/);

      // 이메일 타입으로 전환
      const emailTypeButton = page.getByRole('button', { name: /이메일/i });
      await emailTypeButton.click();
      await expect(emailTypeButton).toHaveClass(/typeButtonActive/);
      await expect(page.getByLabel('이메일')).toBeVisible();

      // 전화번호 타입으로 다시 전환
      await phoneTypeButton.click();
      await expect(phoneTypeButton).toHaveClass(/typeButtonActive/);
      await expect(page.getByLabel('전화번호')).toBeVisible();

      // 잘못된 전화번호 입력
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('123');
      
      // 추가 버튼 클릭
      const submitButton = page.getByRole('button', { name: /추가/i });
      await submitButton.click();

      // 검증 오류 메시지 확인
      await expect(page.getByText(/올바른 전화번호 형식이 아닙니다/i)).toBeVisible({ timeout: 1000 });
    });
  });

  test.describe('T031: 친구 삭제 확인 다이얼로그', () => {
    test('삭제 버튼 클릭 시 확인 다이얼로그 표시 확인', async ({ page }) => {
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
      let dialogShown = false;
      page.on('dialog', async (dialog) => {
        dialogShown = true;
        expect(dialog.message()).toContain('삭제하시겠습니까');
        await dialog.dismiss(); // 테스트를 위해 취소
      });

      // 삭제 버튼 클릭
      await deleteButton.click();

      // 다이얼로그가 표시되었는지 확인
      expect(dialogShown).toBe(true);
    });
  });
});
