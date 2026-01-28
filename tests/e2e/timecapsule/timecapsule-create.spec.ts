/**
 * @fileoverview 타임캡슐 생성 페이지 E2E 테스트
 * @description 타임캡슐 생성 폼 입력 및 주문 생성 플로우 테스트
 */

import { test, expect } from '@playwright/test';

// 테스트용 토큰 - 실제 로그인 후 얻은 토큰을 사용하세요
const TEST_TOKEN = process.env.TEST_AUTH_TOKEN || '';

test.describe('타임캡슐 생성 페이지', () => {
  test.beforeEach(async ({ page, context }) => {
    if (!TEST_TOKEN) {
      console.warn('⚠️  TEST_AUTH_TOKEN 환경변수가 설정되지 않았습니다. 테스트를 건너뜁니다.');
      test.skip();
      return;
    }

    // 인증 토큰 설정
    await context.addCookies([
      {
        name: 'timeEgg_accessToken',
        value: TEST_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);

    // localStorage에 토큰 설정
    await page.goto('/timecapsule/create');
    await page.evaluate((token) => {
      localStorage.setItem('timeEgg_accessToken', token);
    }, TEST_TOKEN);
  });

  test('페이지 로드 및 기본 UI 확인', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 헤더 확인
    await expect(page.getByRole('heading', { name: '타임캡슐 만들기' })).toBeVisible();

    // 입력 필드 확인
    await expect(page.getByLabel('캡슐 이름')).toBeVisible();
    await expect(page.getByText('개봉일 선택')).toBeVisible();
    await expect(page.getByText('PERSONNEL')).toBeVisible();
    await expect(page.getByText('STORAGE')).toBeVisible();

    // 제출 버튼 확인
    await expect(page.getByRole('button', { name: '결제하기' })).toBeVisible();
  });

  test('폼 입력 및 유효성 검사', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 캡슐 이름 입력
    await page.getByLabel('캡슐 이름').fill('우리들의 추억');

    // 개봉일 선택 (1개월 후) - 옵션 카드 클릭
    await page.getByText('1개월 후').click();

    // 참여 인원 수 증가 (기본 2명 → 5명)
    const increasePersonnelBtn = page.getByRole('button', { name: 'PERSONNEL 증가' });
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();

    // 모든 필드가 올바르게 입력되었는지 확인
    await expect(page.getByLabel('캡슐 이름')).toHaveValue('우리들의 추억');
    await expect(page.getByText('5 명')).toBeVisible();
  });

  test('필수 필드 누락 시 에러 메시지 표시', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 캡슐 이름을 입력하고 지워서 터치 상태로 만듦 (실시간 검증 트리거)
    const capsuleNameInput = page.getByLabel('캡슐 이름');
    await capsuleNameInput.fill('테스트');
    await capsuleNameInput.clear();
    // 포커스 이동하여 blur 트리거
    await capsuleNameInput.blur();

    // 에러 메시지 확인 - 캡슐 이름 에러 (실시간 검증)
    await expect(page.getByText('캡슐 이름을 입력해주세요')).toBeVisible();

    // 필수 필드 미입력 시 버튼이 비활성화되어 있는지 확인
    await expect(page.getByRole('button', { name: '결제하기' })).toBeDisabled();
  });

  test('커스텀 날짜 선택 시 과거 날짜 선택 불가', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 캡슐 이름 입력
    await page.getByLabel('캡슐 이름').fill('테스트');

    // 커스텀 옵션 선택 - 텍스트로 클릭
    await page.getByText('커스텀').click();

    // 커스텀 날짜 입력 필드가 표시되는지 확인
    await expect(page.getByLabel('커스텀 오픈일')).toBeVisible();

    // 과거 날짜 입력 시도 - 과거 날짜는 자동 초기화됨
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await page.getByLabel('커스텀 오픈일').fill(yesterdayStr);
    await page.getByLabel('커스텀 오픈일').blur();

    // 과거 날짜 입력 시 필드가 초기화되므로 버튼이 여전히 비활성화 상태
    await expect(page.getByRole('button', { name: '결제하기' })).toBeDisabled();

    // 미래 날짜 입력 시 버튼 활성화 확인
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await page.getByLabel('커스텀 오픈일').fill(tomorrowStr);

    // 버튼이 활성화되는지 확인
    await expect(page.getByRole('button', { name: '결제하기' })).toBeEnabled();
  });

  test('주문 생성 성공 시 결제 페이지로 이동', async ({ page }) => {
    // API 응답 모킹
    await page.route('**/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          order_id: 'test-order-123',
          total_amount: 10000,
          time_option: '1_MONTH',
          headcount: 5,
          photo_count: 0,
          add_music: false,
          add_video: false,
          status: 'PENDING_PAYMENT',
        }),
      });
    });

    await page.goto('/timecapsule/create');

    // 폼 입력
    await page.getByLabel('캡슐 이름').fill('우리들의 추억');
    await page.getByText('1개월 후').click();

    // 참여 인원 수 증가 (기본 2명 → 5명)
    const increasePersonnelBtn = page.getByRole('button', { name: 'PERSONNEL 증가' });
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();

    // 제출 버튼 클릭
    await page.getByRole('button', { name: '결제하기' }).click();

    // 결제 페이지로 이동 확인
    await page.waitForURL('**/payment?orderId=test-order-123');
    expect(page.url()).toContain('/payment');
    expect(page.url()).toContain('orderId=test-order-123');
  });

  test('주문 생성 실패 시 에러 메시지 표시', async ({ page }) => {
    // API 에러 응답 모킹
    await page.route('**/orders', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: '주문 생성에 실패했습니다.',
          success: false,
        }),
      });
    });

    await page.goto('/timecapsule/create');

    // 폼 입력
    await page.getByLabel('캡슐 이름').fill('우리들의 추억');
    await page.getByText('1개월 후').click();

    // 참여 인원 수 증가
    const increasePersonnelBtn = page.getByRole('button', { name: 'PERSONNEL 증가' });
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();

    // 제출 버튼 클릭
    await page.getByRole('button', { name: '결제하기' }).click();

    // 에러 메시지 확인
    await expect(page.getByText('주문 생성에 실패했습니다')).toBeVisible();
  });

  test('로딩 중 버튼 비활성화', async ({ page }) => {
    // API 응답 지연 모킹
    await page.route('**/orders', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          order_id: 'test-order-123',
          total_amount: 10000,
          time_option: '1_MONTH',
          headcount: 5,
          photo_count: 0,
          add_music: false,
          add_video: false,
          status: 'PENDING_PAYMENT',
        }),
      });
    });

    await page.goto('/timecapsule/create');

    // 폼 입력
    await page.getByLabel('캡슐 이름').fill('우리들의 추억');
    await page.getByText('1개월 후').click();

    // 참여 인원 수 증가
    const increasePersonnelBtn = page.getByRole('button', { name: 'PERSONNEL 증가' });
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();
    await increasePersonnelBtn.click();

    // 제출 버튼 클릭
    const submitButton = page.getByRole('button', { name: '결제하기' });
    await submitButton.click();

    // 로딩 중 버튼 텍스트 변경 및 비활성화 확인
    await expect(page.getByRole('button', { name: '처리 중...' })).toBeDisabled();
  });

  test('이미지 슬롯 수량 조절', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 기본 이미지 슬롯 수 확인 (기본값 1개)
    await expect(page.getByText('1 개')).toBeVisible();

    // 이미지 슬롯 증가
    const increaseStorageBtn = page.getByRole('button', { name: 'STORAGE 증가' });
    await increaseStorageBtn.click();
    await increaseStorageBtn.click();

    // 3개로 증가했는지 확인
    await expect(page.getByText('3 개')).toBeVisible();

    // 이미지 슬롯 감소
    const decreaseStorageBtn = page.getByRole('button', { name: 'STORAGE 감소' });
    await decreaseStorageBtn.click();

    // 2개로 감소했는지 확인
    await expect(page.getByText('2 개')).toBeVisible();
  });

  test('추가 옵션 토글', async ({ page }) => {
    await page.goto('/timecapsule/create');

    // 추가 옵션 영역 확인
    await expect(page.getByText('추가 옵션')).toBeVisible();

    // 음악 파일 옵션 카드 클릭
    const musicCard = page.getByText('음악 파일').first();
    await musicCard.click();

    // 음악 파일 체크박스 선택 확인
    const musicCheckbox = page.getByLabel('음악 파일');
    await expect(musicCheckbox).toBeChecked();

    // 영상 추가 옵션 카드 클릭
    const videoCard = page.getByText('영상 추가').first();
    await videoCard.click();

    // 영상 추가 체크박스 선택 확인
    const videoCheckbox = page.getByLabel('영상 추가');
    await expect(videoCheckbox).toBeChecked();
  });
});
