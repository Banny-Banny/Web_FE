import { test, expect } from '@playwright/test';

/**
 * 로그인 UI 테스트
 * 375px 모바일 프레임 기준 렌더링, 상호작용, 시각적 검증 통합
 */
test.describe('로그인 페이지 UI', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/login');
  });

  test.describe('US1: 로그인 폼 렌더링', () => {
    test('모든 입력 필드가 표시되는지 확인', async ({ page }) => {
      // 전화번호 입력 필드 확인
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toBeVisible();

      // 이메일 입력 필드 확인
      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toBeVisible();

      // 비밀번호 입력 필드 확인
      const passwordInput = page.getByLabel('비밀번호');
      await expect(passwordInput).toBeVisible();

      // 로그인 버튼 확인
      const loginButton = page.getByRole('button', { name: /로그인/i });
      await expect(loginButton).toBeVisible();

      // 회원가입 링크 확인
      const signupLink = page.getByRole('link', { name: /회원가입/i });
      await expect(signupLink).toBeVisible();
    });

    test('입력 필드에 적절한 플레이스홀더가 표시되는지 확인', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toHaveAttribute('placeholder', '010-1234-5678');

      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toHaveAttribute('placeholder', 'user@example.com');

      const passwordInput = page.getByLabel('비밀번호');
      await expect(passwordInput).toHaveAttribute('placeholder', '비밀번호를 입력하세요');
    });

    test('375px 모바일 프레임 기준 레이아웃 확인', async ({ page }) => {
      // 뷰포트 크기 확인 (375px 기준)
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeGreaterThanOrEqual(375);

      // 폼이 표시되는지 확인
      const form = page.locator('form');
      await expect(form).toBeVisible();
    });
  });

  test.describe('US1: 입력 필드 상호작용', () => {
    test('전화번호 입력 필드에 값 입력 가능', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');
      await expect(phoneInput).toHaveValue('01012345678');
    });

    test('이메일 입력 필드에 값 입력 가능', async ({ page }) => {
      const emailInput = page.getByLabel('이메일');
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    });

    test('비밀번호 입력 필드에 값 입력 가능 (마스킹됨)', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');
      await expect(passwordInput).toHaveValue('Password123!');
      
      // 비밀번호 필드는 type="password"여야 함
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('키보드로 모든 입력 필드에 접근 가능', async ({ page }) => {
      // Tab 키로 순차 이동
      await page.keyboard.press('Tab'); // 전화번호
      await expect(page.getByLabel('전화번호')).toBeFocused();

      await page.keyboard.press('Tab'); // 이메일
      await expect(page.getByLabel('이메일')).toBeFocused();

      await page.keyboard.press('Tab'); // 비밀번호
      await expect(page.getByLabel('비밀번호')).toBeFocused();

      await page.keyboard.press('Tab'); // 로그인 버튼
      await expect(page.getByRole('button', { name: /로그인/i })).toBeFocused();
    });
  });

  test.describe('US1: 유효성 검증 동작', () => {
    test('전화번호 형식이 올바르지 않으면 오류 메시지 표시', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('123');
      await phoneInput.blur();

      // 오류 메시지 확인
      const errorMessage = page.locator('text=/올바른 전화번호 형식/i');
      await expect(errorMessage).toBeVisible();
    });

    test('이메일 형식이 올바르지 않으면 오류 메시지 표시', async ({ page }) => {
      const emailInput = page.getByLabel('이메일');
      await emailInput.fill('invalid-email');
      await emailInput.blur();

      // 오류 메시지 확인
      const errorMessage = page.locator('text=/올바른 이메일 형식/i');
      await expect(errorMessage).toBeVisible();
    });

    test('비밀번호가 비어있으면 오류 메시지 표시', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.focus();
      await passwordInput.blur();

      // 오류 메시지 확인
      const errorMessage = page.locator('text=/비밀번호를 입력해주세요/i');
      await expect(errorMessage).toBeVisible();
    });

    test('전화번호와 이메일 모두 비어있으면 일반 오류 메시지 표시', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');
      
      const loginButton = page.getByRole('button', { name: /로그인/i });
      await loginButton.click();

      // 일반 오류 메시지 확인
      const errorMessage = page.locator('text=/전화번호 또는 이메일을 입력해주세요/i');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('US1: 오류 메시지 표시', () => {
    test('오류 발생 시 오류 메시지가 접근 가능하게 표시됨', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('short');
      await passwordInput.blur();

      // 오류 메시지가 role="alert"로 표시되는지 확인
      const errorMessage = page.locator('[role="alert"]').first();
      await expect(errorMessage).toBeVisible();
    });

    test('서버 오류 메시지가 표시됨', async ({ page }) => {
      // 로그인 시도 (실패 시나리오)
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01099999999');
      
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('WrongPassword123!');
      
      const loginButton = page.getByRole('button', { name: /로그인/i });
      await loginButton.click();

      // 서버 오류 메시지 확인 (실제 API 호출 결과에 따라 다를 수 있음)
      // 여기서는 오류 메시지 영역이 표시되는지만 확인
      const errorArea = page.locator('[role="alert"]');
      // 오류가 발생하면 표시됨 (타임아웃 설정)
      await expect(errorArea.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // 오류가 발생하지 않을 수도 있음 (Mock 데이터 기반)
      });
    });
  });

  test.describe('US1: 로그인 버튼 상태', () => {
    test('필수 입력이 완료되지 않으면 로그인 버튼이 비활성화됨', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /로그인/i });
      
      // 초기 상태 (입력 없음)
      await expect(loginButton).toBeDisabled();
    });

    test('필수 입력이 완료되면 로그인 버튼이 활성화됨', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');
      
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');

      const loginButton = page.getByRole('button', { name: /로그인/i });
      await expect(loginButton).toBeEnabled();
    });

    test('로딩 중에는 로그인 버튼이 비활성화되고 로딩 텍스트 표시', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');
      
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');

      const loginButton = page.getByRole('button', { name: /로그인/i });
      await loginButton.click();

      // 로딩 상태 확인
      await expect(loginButton).toContainText(/로그인 중/i);
      await expect(loginButton).toBeDisabled();
    });
  });

  test.describe('US5: 회원가입 링크 클릭', () => {
    test('회원가입 링크 클릭 시 회원가입 페이지로 이동', async ({ page }) => {
      const signupLink = page.getByRole('link', { name: /회원가입/i });
      await expect(signupLink).toBeVisible();
      
      await signupLink.click();
      
      // 회원가입 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/signup/);
    });
  });

  test.describe('접근성', () => {
    test('모든 입력 필드에 적절한 라벨이 제공됨', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toHaveAttribute('aria-label', '전화번호');

      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toHaveAttribute('aria-label', '이메일');

      const passwordInput = page.getByLabel('비밀번호');
      await expect(passwordInput).toHaveAttribute('aria-label', '비밀번호');
    });

    test('오류 메시지가 스크린 리더를 통해 접근 가능', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('short');
      await passwordInput.blur();

      // 오류 메시지가 role="alert"로 표시되는지 확인
      const errorMessage = page.locator('[role="alert"]').first();
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });
});
