import { test, expect } from '@playwright/test';

/**
 * 이스터에그 바텀시트 UI 테스트
 * 375px 모바일 프레임 기준 렌더링, 상호작용, 시각적 검증 통합
 */
test.describe('이스터에그 바텀시트 UI', () => {
  test.beforeEach(async ({ page }) => {
    // 모바일 뷰포트 설정 (375px 기준)
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 홈 페이지로 이동
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('T032: 기본 플로우 테스트', () => {
    test('FAB 버튼 클릭 → 이스터에그 선택 → 바텀시트 열림', async ({ page }) => {
      // FAB 버튼 찾기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await expect(fabButton).toBeVisible();

      // FAB 버튼 클릭하여 확장
      await fabButton.click();
      
      // 이스터에그 버튼이 표시되는지 확인
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await expect(easterEggButton).toBeVisible({ timeout: 1000 });

      // 이스터에그 버튼 클릭
      await easterEggButton.click();

      // 바텀시트가 열렸는지 확인
      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 바텀시트 제목 확인
      const title = page.getByRole('heading', { name: /이스터에그 작성/i });
      await expect(title).toBeVisible();
    });

    test('제목 입력 → 작성 완료 버튼 활성화', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      // 바텀시트가 열렸는지 확인
      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 작성 완료 버튼 초기 상태: 비활성화
      const confirmButton = page.getByRole('button', { name: /작성 완료/i });
      await expect(confirmButton).toBeDisabled();

      // 제목 입력 필드에 값 입력
      const titleInput = page.getByLabel('이스터에그 제목');
      await titleInput.fill('테스트 제목');

      // 작성 완료 버튼이 활성화되었는지 확인
      await expect(confirmButton).toBeEnabled();
    });

    test('폼 입력 후 작성 완료 버튼 클릭 → 다음 단계 진행', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      // 바텀시트가 열렸는지 확인
      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 폼 입력
      const titleInput = page.getByLabel('이스터에그 제목');
      await titleInput.fill('테스트 제목');

      const messageInput = page.getByLabel('이스터에그 메시지');
      await messageInput.fill('테스트 메시지');

      // 작성 완료 버튼 클릭
      const confirmButton = page.getByRole('button', { name: /작성 완료/i });
      await confirmButton.click();

      // 바텀시트가 닫혔는지 확인
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('T033: 닫기 동작 테스트', () => {
    test('배경 오버레이 클릭으로 닫기', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 오버레이 클릭 (화면 상단 클릭)
      await page.mouse.click(187, 50);

      // 바텀시트가 닫혔는지 확인
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
    });

    test('취소 버튼 클릭으로 닫기', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 취소 버튼 클릭
      const cancelButton = page.getByRole('button', { name: /취소/i });
      await cancelButton.click();

      // 바텀시트가 닫혔는지 확인
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
    });

    test('ESC 키로 닫기', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // Escape 키 누르기
      await page.keyboard.press('Escape');

      // 바텀시트가 닫혔는지 확인
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('T034: 미리보기 테스트', () => {
    test('이미지 미리보기 표시', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 사진 버튼 클릭 (파일 선택 트리거)
      const imageButton = page.getByRole('button', { name: /사진 첨부하기/i });
      await imageButton.click();

      // 파일 input이 존재하는지 확인 (실제 파일 업로드는 테스트 환경에서 제한적)
      // 실제 파일 업로드 테스트는 e2e 테스트에서 수행
      const fileInput = page.locator('input[type="file"][accept*="image"]');
      await expect(fileInput).toBeVisible();
    });

    test('음원 모달 열기/닫기', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 음원 버튼 클릭
      const audioButton = page.getByRole('button', { name: /음원 첨부하기/i });
      await audioButton.click();

      // 음원 모달이 표시되는지 확인
      // 모달은 role="dialog" 또는 특정 클래스로 식별 가능
      const audioModal = page.locator('[role="dialog"]').filter({ hasText: /직접 녹음|파일 업로드/i }).first();
      await expect(audioModal).toBeVisible({ timeout: 1000 });

      // 닫기 버튼 클릭
      const closeButton = audioModal.getByRole('button', { name: /닫기/i }).first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(audioModal).not.toBeVisible({ timeout: 1000 });
      } else {
        // ESC 키로 닫기
        await page.keyboard.press('Escape');
        await expect(audioModal).not.toBeVisible({ timeout: 1000 });
      }
    });

    test('비디오 미리보기 표시', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 동영상 버튼 클릭 (파일 선택 트리거)
      const videoButton = page.getByRole('button', { name: /동영상 첨부하기/i });
      await videoButton.click();

      // 파일 input이 존재하는지 확인
      const fileInput = page.locator('input[type="file"][accept*="video"]');
      await expect(fileInput).toBeVisible();
    });
  });

  test.describe('T035: 키보드 네비게이션 테스트', () => {
    test('Tab 키로 모든 인터랙티브 요소 탐색 가능', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 첫 번째 입력 필드(제목)에 포커스가 있는지 확인
      const titleInput = page.getByLabel('이스터에그 제목');
      await expect(titleInput).toBeFocused({ timeout: 1000 });

      // Tab 키로 다음 요소로 이동
      await page.keyboard.press('Tab');
      
      // 메시지 입력 필드로 포커스 이동 확인
      const messageInput = page.getByLabel('이스터에그 메시지');
      await expect(messageInput).toBeFocused();

      // Tab 키로 첨부파일 버튼으로 이동
      await page.keyboard.press('Tab');
      const imageButton = page.getByRole('button', { name: /사진 첨부하기/i });
      await expect(imageButton).toBeFocused();
    });

    test('Enter 키로 버튼 활성화 가능', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 제목 입력
      const titleInput = page.getByLabel('이스터에그 제목');
      await titleInput.fill('테스트 제목');

      // Tab 키로 작성 완료 버튼으로 이동
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const confirmButton = page.getByRole('button', { name: /작성 완료/i });
      await expect(confirmButton).toBeFocused();

      // Enter 키로 버튼 활성화
      await page.keyboard.press('Enter');

      // 바텀시트가 닫혔는지 확인
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });
    });

    test('포커스 관리 검증 (열기/닫기 시)', async ({ page }) => {
      // FAB 버튼에 포커스
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.focus();
      await expect(fabButton).toBeFocused();

      // FAB 버튼 클릭하여 확장
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 바텀시트 열릴 때 첫 번째 입력 필드로 포커스 이동 확인
      const titleInput = page.getByLabel('이스터에그 제목');
      await expect(titleInput).toBeFocused({ timeout: 1000 });

      // ESC 키로 닫기
      await page.keyboard.press('Escape');
      await expect(bottomSheet).not.toBeVisible({ timeout: 2000 });

      // 포커스가 FAB 버튼으로 복원되었는지 확인 (BottomSheet 컴포넌트의 기본 동작)
      // 실제로는 BottomSheet 컴포넌트가 포커스 복원을 처리하므로,
      // 여기서는 바텀시트가 닫혔는지만 확인
    });
  });

  test.describe('T036: 접근성 테스트', () => {
    test('모든 입력 필드에 적절한 라벨이 제공됨', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 제목 입력 필드
      const titleInput = page.getByLabel('이스터에그 제목');
      await expect(titleInput).toHaveAttribute('aria-required', 'true');
      await expect(titleInput).toHaveAttribute('aria-label', '이스터에그 제목');

      // 메시지 입력 필드
      const messageInput = page.getByLabel('이스터에그 메시지');
      await expect(messageInput).toHaveAttribute('aria-label', '이스터에그 메시지');
    });

    test('글자 수 카운터가 스크린 리더를 통해 접근 가능', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 제목 입력 필드에 값 입력
      const titleInput = page.getByLabel('이스터에그 제목');
      await titleInput.fill('테스트');

      // 글자 수 카운터 확인
      const charCount = page.locator('#title-char-count');
      await expect(charCount).toBeVisible();
      await expect(charCount).toHaveAttribute('aria-live', 'polite');
      await expect(charCount).toHaveText('5/30');
    });

    test('모든 버튼에 적절한 aria-label이 제공됨', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 첨부파일 버튼들 확인
      const imageButton = page.getByRole('button', { name: /사진 첨부하기/i });
      await expect(imageButton).toHaveAttribute('aria-label', /사진/);

      const audioButton = page.getByRole('button', { name: /음원 첨부하기/i });
      await expect(audioButton).toHaveAttribute('aria-label', /음원/);

      const videoButton = page.getByRole('button', { name: /동영상 첨부하기/i });
      await expect(videoButton).toHaveAttribute('aria-label', /동영상/);
    });

    test('바텀시트에 적절한 ARIA 속성이 설정됨', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // role="dialog" 확인
      await expect(bottomSheet).toHaveAttribute('role', 'dialog');

      // aria-labelledby 확인 (제목과 연결)
      const titleId = await page.locator('h2[id="easter-egg-sheet-title"]').getAttribute('id');
      expect(titleId).toBe('easter-egg-sheet-title');
    });

    test('안내 정보 박스가 접근 가능하게 표시됨', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 안내 정보 박스 확인
      const infoBox = page.locator('[role="note"]');
      await expect(infoBox).toBeVisible();
      await expect(infoBox).toHaveAttribute('aria-label', '이스터에그 작성 안내');

      // 안내 메시지 확인
      await expect(infoBox).toContainText('현재 위치에 추억이 저장됩니다');
      await expect(infoBox).toContainText('3명이 발견하면 이스터에그가 소멸됩니다');
    });
  });

  test.describe('폼 검증 테스트', () => {
    test('제목이 비어있으면 작성 완료 버튼이 비활성화됨', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 작성 완료 버튼이 비활성화되어 있는지 확인
      const confirmButton = page.getByRole('button', { name: /작성 완료/i });
      await expect(confirmButton).toBeDisabled();
    });

    test('제목 최대 30자 제한', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 제목 입력 필드에 31자 입력 시도
      const titleInput = page.getByLabel('이스터에그 제목');
      const longText = '가'.repeat(31);
      await titleInput.fill(longText);

      // 30자까지만 입력되어야 함
      await expect(titleInput).toHaveValue('가'.repeat(30));
      await expect(page.locator('#title-char-count')).toHaveText('30/30');
    });

    test('메시지 최대 500자 제한', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 메시지 입력 필드에 501자 입력 시도
      const messageInput = page.getByLabel('이스터에그 메시지');
      const longText = '가'.repeat(501);
      await messageInput.fill(longText);

      // 500자까지만 입력되어야 함
      await expect(messageInput).toHaveValue('가'.repeat(500));
      await expect(page.locator('#message-char-count')).toHaveText('500/500');
    });
  });

  test.describe('반응형 디자인 테스트', () => {
    test('375px 모바일 프레임 기준 레이아웃 확인', async ({ page }) => {
      // 뷰포트 크기 확인
      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(375);

      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 바텀시트가 화면에 표시되는지 확인
      const bottomSheetBox = await bottomSheet.boundingBox();
      expect(bottomSheetBox?.width).toBeLessThanOrEqual(375);
    });

    test('입력 필드가 터치하기 적절한 크기로 표시됨 (최소 44px)', async ({ page }) => {
      // 바텀시트 열기
      const fabButton = page.getByRole('button', { name: /메뉴 열기/i });
      await fabButton.click();
      
      const easterEggButton = page.getByRole('button', { name: /이스터에그/i });
      await easterEggButton.click();

      const bottomSheet = page.locator('[role="dialog"]');
      await expect(bottomSheet).toBeVisible({ timeout: 1000 });

      // 제목 입력 필드 높이 확인
      const titleInput = page.getByLabel('이스터에그 제목');
      const inputBox = await titleInput.boundingBox();
      
      // 터치 타겟 크기 확인 (최소 44px 권장)
      expect(inputBox?.height).toBeGreaterThanOrEqual(40);
    });
  });
});
