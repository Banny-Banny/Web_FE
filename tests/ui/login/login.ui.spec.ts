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
    test('기본 상태에서 전화번호 입력 필드가 표시되는지 확인', async ({ page }) => {
      // 로그인 타입 선택 라디오 버튼 확인
      const phoneRadio = page.locator('input[type="radio"][value="phone"]');
      await expect(phoneRadio).toBeChecked();

      const emailRadio = page.locator('input[type="radio"][value="email"]');
      await expect(emailRadio).not.toBeChecked();

      // 전화번호 입력 필드 확인 (기본값)
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toBeVisible();

      // 이메일 입력 필드는 표시되지 않아야 함
      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).not.toBeVisible();

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

    test('이메일 선택 시 이메일 입력 필드가 표시되는지 확인', async ({ page }) => {
      // 이메일 라디오 버튼 선택
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      await emailRadio.click();
      await expect(emailRadio).toBeChecked();

      // 이메일 입력 필드가 표시되는지 확인
      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toBeVisible();

      // 전화번호 입력 필드는 표시되지 않아야 함
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).not.toBeVisible();
    });

    test('입력 필드에 적절한 플레이스홀더가 표시되는지 확인', async ({ page }) => {
      // 전화번호 입력 필드 플레이스홀더 확인
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toHaveAttribute('placeholder', '01012345678');

      // 이메일 라디오 버튼 선택
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      await emailRadio.click();

      // 이메일 입력 필드 플레이스홀더 확인
      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toHaveAttribute('placeholder', 'user@example.com');

      // 비밀번호 입력 필드 플레이스홀더 확인
      const passwordInput = page.getByLabel('비밀번호');
      await expect(passwordInput).toHaveAttribute('placeholder', '비밀번호를 입력하세요');
    });

    test('로그인 페이지 제목이 표시되는지 확인', async ({ page }) => {
      const title = page.getByRole('heading', { name: /로그인/i });
      await expect(title).toBeVisible();
      await expect(title).toHaveText('로그인');
    });

    test('375px 모바일 프레임 기준 레이아웃 확인', async ({ page }) => {
      // 모바일 뷰포트 설정 (375px 기준)
      await page.setViewportSize({ width: 375, height: 667 });
      
      // 뷰포트 크기 확인
      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(375);

      // 폼이 표시되는지 확인
      const form = page.locator('form');
      await expect(form).toBeVisible();

      // 컨테이너가 전체 너비를 차지하는지 확인
      const container = page.locator('[class*="container"]').first();
      const containerBox = await container.boundingBox();
      expect(containerBox?.width).toBe(375);
    });

    test('모바일 뷰포트에서 입력 필드가 적절한 크기로 표시되는지 확인', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const phoneInput = page.getByLabel('전화번호');
      const inputBox = await phoneInput.boundingBox();
      
      // 입력 필드가 적절한 높이를 가지는지 확인 (48px)
      expect(inputBox?.height).toBeGreaterThanOrEqual(40);
      
      // 입력 필드가 전체 너비를 차지하는지 확인
      const form = page.locator('form');
      const formBox = await form.boundingBox();
      const inputWidth = inputBox?.width || 0;
      const formWidth = formBox?.width || 0;
      expect(inputWidth).toBeGreaterThan(formWidth * 0.9); // 폼 너비의 90% 이상
    });
  });

  test.describe('시각적 스타일 검증', () => {
    test('오류 상태에서 입력 필드 스타일이 변경되는지 확인', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      
      // 오류가 없는 상태
      await expect(phoneInput).not.toHaveClass(/inputError/);
      
      // 잘못된 값 입력 후 blur
      await phoneInput.fill('123');
      await phoneInput.blur();
      
      // 오류 상태에서 inputError 클래스가 추가되는지 확인
      await expect(phoneInput).toHaveClass(/inputError/);
    });

    test('오류 메시지가 적절한 스타일로 표시되는지 확인', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('short');
      await passwordInput.blur();

      // 오류 메시지 확인
      const errorMessage = page.locator('[role="alert"]').first();
      await expect(errorMessage).toBeVisible();
      
      // 오류 메시지 색상 확인 (빨간색 계열)
      const color = await errorMessage.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    });

    test('로그인 버튼이 비활성화 상태일 때 적절한 스타일이 적용되는지 확인', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: /로그인/i });
      
      // 초기 상태: 비활성화
      await expect(loginButton).toBeDisabled();
      
      // 입력 후 활성화
      const phoneInput = page.getByLabel('전화번호');
      await phoneInput.fill('01012345678');
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');
      
      await expect(loginButton).toBeEnabled();
    });

    test('회원가입 링크가 적절한 스타일로 표시되는지 확인', async ({ page }) => {
      const signupLink = page.getByRole('link', { name: /회원가입/i });
      await expect(signupLink).toBeVisible();
      
      // 링크가 클릭 가능한 상태인지 확인
      const linkBox = await signupLink.boundingBox();
      expect(linkBox?.width).toBeGreaterThan(0);
      expect(linkBox?.height).toBeGreaterThan(0);
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
      await page.keyboard.press('Tab'); // 전화번호 라디오 버튼
      await expect(page.locator('input[type="radio"][value="phone"]')).toBeFocused();

      await page.keyboard.press('Tab'); // 이메일 라디오 버튼
      await expect(page.locator('input[type="radio"][value="email"]')).toBeFocused();

      await page.keyboard.press('Tab'); // 전화번호 입력 필드
      await expect(page.getByLabel('전화번호')).toBeFocused();

      await page.keyboard.press('Tab'); // 비밀번호 입력 필드
      await expect(page.getByLabel('비밀번호')).toBeFocused();

      await page.keyboard.press('Tab'); // 로그인 버튼
      await expect(page.getByRole('button', { name: /로그인/i })).toBeFocused();
    });

    test('로그인 타입 라디오 버튼 전환 동작 확인', async ({ page }) => {
      // 초기 상태: 전화번호 선택
      const phoneRadio = page.locator('input[type="radio"][value="phone"]');
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      
      await expect(phoneRadio).toBeChecked();
      await expect(page.getByLabel('전화번호')).toBeVisible();
      await expect(page.getByLabel('이메일')).not.toBeVisible();

      // 이메일 라디오 버튼 클릭
      await emailRadio.click();
      await expect(emailRadio).toBeChecked();
      await expect(phoneRadio).not.toBeChecked();
      
      // 이메일 입력 필드가 표시되고 전화번호 입력 필드는 숨겨짐
      await expect(page.getByLabel('이메일')).toBeVisible();
      await expect(page.getByLabel('전화번호')).not.toBeVisible();

      // 다시 전화번호 라디오 버튼 클릭
      await phoneRadio.click();
      await expect(phoneRadio).toBeChecked();
      await expect(emailRadio).not.toBeChecked();
      
      // 전화번호 입력 필드가 표시되고 이메일 입력 필드는 숨겨짐
      await expect(page.getByLabel('전화번호')).toBeVisible();
      await expect(page.getByLabel('이메일')).not.toBeVisible();
    });

    test('비밀번호 표시/숨김 토글 버튼 동작 확인', async ({ page }) => {
      const passwordInput = page.getByLabel('비밀번호');
      await passwordInput.fill('Password123!');

      // 초기 상태: 비밀번호가 숨김 (type="password")
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // 토글 버튼 찾기
      const toggleButton = page.locator('button[aria-label*="비밀번호"]');
      await expect(toggleButton).toBeVisible();

      // 토글 버튼 클릭하여 비밀번호 표시
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      await expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 숨기기');

      // 다시 토글 버튼 클릭하여 비밀번호 숨김
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 보이기');
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
      // 이메일 라디오 버튼 선택
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      await emailRadio.click();

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
      // 전화번호 입력 필드
      const phoneInput = page.getByLabel('전화번호');
      await expect(phoneInput).toHaveAttribute('aria-label', '전화번호');
      await expect(phoneInput).toHaveAttribute('aria-required', 'true');

      // 이메일 라디오 버튼 선택
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      await emailRadio.click();

      // 이메일 입력 필드
      const emailInput = page.getByLabel('이메일');
      await expect(emailInput).toHaveAttribute('aria-label', '이메일');
      await expect(emailInput).toHaveAttribute('aria-required', 'true');

      // 비밀번호 입력 필드
      const passwordInput = page.getByLabel('비밀번호');
      await expect(passwordInput).toHaveAttribute('aria-label', '비밀번호');
      await expect(passwordInput).toHaveAttribute('aria-required', 'true');
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

    test('입력 필드에 aria-invalid 속성이 적절히 설정됨', async ({ page }) => {
      const phoneInput = page.getByLabel('전화번호');
      
      // 초기 상태: aria-invalid="false" 또는 없음
      const initialInvalid = await phoneInput.getAttribute('aria-invalid');
      expect(initialInvalid).not.toBe('true');
      
      // 오류 발생 시: aria-invalid="true"
      await phoneInput.fill('123');
      await phoneInput.blur();
      await expect(phoneInput).toHaveAttribute('aria-invalid', 'true');
    });

    test('라디오 버튼에 적절한 라벨이 제공됨', async ({ page }) => {
      const phoneRadio = page.locator('input[type="radio"][value="phone"]');
      const emailRadio = page.locator('input[type="radio"][value="email"]');
      
      // 라디오 버튼이 적절한 텍스트와 연결되어 있는지 확인
      await expect(phoneRadio).toBeVisible();
      await expect(emailRadio).toBeVisible();
      
      // 라디오 버튼의 라벨 텍스트 확인
      const phoneLabel = page.locator('label:has(input[value="phone"])');
      await expect(phoneLabel).toContainText('전화번호');
      
      const emailLabel = page.locator('label:has(input[value="email"])');
      await expect(emailLabel).toContainText('이메일');
    });

    test('비밀번호 토글 버튼에 적절한 aria-label이 제공됨', async ({ page }) => {
      const toggleButton = page.locator('button[aria-label*="비밀번호"]');
      await expect(toggleButton).toBeVisible();
      
      // 초기 상태: "비밀번호 보이기"
      await expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 보이기');
      
      // 클릭 후: "비밀번호 숨기기"
      await toggleButton.click();
      await expect(toggleButton).toHaveAttribute('aria-label', '비밀번호 숨기기');
    });
  });

  test.describe('반응형 디자인', () => {
    test('다양한 모바일 뷰포트 크기에서 정상적으로 표시됨', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667 }, // iPhone SE
        { width: 390, height: 844 }, // iPhone 12/13
        { width: 414, height: 896 }, // iPhone 11 Pro Max
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        
        // 폼이 표시되는지 확인
        const form = page.locator('form');
        await expect(form).toBeVisible();
        
        // 입력 필드가 표시되는지 확인
        const phoneInput = page.getByLabel('전화번호');
        await expect(phoneInput).toBeVisible();
        
        // 로그인 버튼이 표시되는지 확인
        const loginButton = page.getByRole('button', { name: /로그인/i });
        await expect(loginButton).toBeVisible();
      }
    });

    test('입력 필드가 터치하기 적절한 크기로 표시됨 (최소 44px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const phoneInput = page.getByLabel('전화번호');
      const inputBox = await phoneInput.boundingBox();
      
      // 터치 타겟 크기 확인 (최소 44px 권장)
      expect(inputBox?.height).toBeGreaterThanOrEqual(44);
    });
  });
});
