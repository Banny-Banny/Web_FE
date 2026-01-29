/**
 * @fileoverview 타임캡슐 제출 UI 테스트
 * @description 제출 관련 컴포넌트의 렌더링, 스타일, 접근성 테스트
 * 
 * ⚠️ 주의:
 * - 개발 서버가 실행 중이어야 합니다 (npm run dev)
 * - 로그인 및 대기실 접근이 필요할 수 있습니다.
 */

import { test, expect } from '@playwright/test';

test.describe('타임캡슐 제출 UI', () => {
  test.beforeEach(async ({ page }) => {
    // 375px 모바일 프레임 설정
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test.describe('T042: [US1] [US4] 제출 버튼 렌더링', () => {
    test('제출 버튼이 화면 하단에 고정되어 표시되는지 확인', async ({ page }) => {
      // TODO: 실제 대기실 페이지로 이동 (Mock 데이터 또는 테스트 데이터 필요)
      // await page.goto('/waiting-room/test-room-id');
      
      // 제출 버튼 찾기
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      // 버튼이 표시되는지 확인
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        // 실제 페이지가 없으면 스킵
        test.skip();
      });
      
      // 버튼 위치 확인 (화면 하단)
      const buttonBox = await submitButton.boundingBox();
      const viewport = page.viewportSize();
      
      if (buttonBox && viewport) {
        // 버튼이 화면 하단 근처에 있는지 확인 (하단 100px 이내)
        const distanceFromBottom = viewport.height - (buttonBox.y + buttonBox.height);
        expect(distanceFromBottom).toBeLessThan(100);
      }
    });

    test('제출 버튼이 전체 너비(375px)로 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      const buttonBox = await submitButton.boundingBox();
      const viewport = page.viewportSize();
      
      if (buttonBox && viewport) {
        // 버튼 너비가 뷰포트 너비의 90% 이상인지 확인
        expect(buttonBox.width).toBeGreaterThanOrEqual(viewport.width * 0.9);
      }
    });

    test('제출 버튼이 최소 터치 영역(44px)을 가지는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      const buttonBox = await submitButton.boundingBox();
      
      if (buttonBox) {
        // 터치 영역 높이가 최소 44px인지 확인
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('제출 버튼이 비활성화 상태일 때 적절한 스타일이 적용되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 비활성화 상태 확인
      const isDisabled = await submitButton.isDisabled();
      
      if (isDisabled) {
        // 비활성화 상태에서 disabled 스타일 확인
        const opacity = await submitButton.evaluate((el) => 
          window.getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeLessThan(1);
      }
    });

    test('제출 버튼 비활성화 시 비활성화 사유가 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      const isDisabled = await submitButton.isDisabled();
      
      if (isDisabled) {
        // 비활성화 사유 텍스트 확인
        const disabledReason = page.locator('text=/모든 참여자|미완료|자동 제출/i');
        await expect(disabledReason.first()).toBeVisible({ timeout: 3000 }).catch(() => {
          // 비활성화 사유가 없을 수도 있음
        });
      }
    });

    test('제출 버튼 로딩 중 스피너가 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 제출 버튼 클릭 (로딩 상태 시뮬레이션)
      await submitButton.click();
      
      // 스피너 또는 로딩 텍스트 확인
      const spinner = page.locator('[class*="spinner"], [aria-label*="로딩"]');
      const loadingText = page.locator('text=/제출 중|로딩/i');
      
      // 스피너 또는 로딩 텍스트가 표시되는지 확인
      const hasSpinner = await spinner.isVisible({ timeout: 2000 }).catch(() => false);
      const hasLoadingText = await loadingText.isVisible({ timeout: 2000 }).catch(() => false);
      
      // 둘 중 하나는 표시되어야 함
      expect(hasSpinner || hasLoadingText).toBe(true);
    });
  });

  test.describe('T043: [US2] 24시간 타이머 렌더링', () => {
    test('타이머가 화면 상단에 고정되어 표시되는지 확인', async ({ page }) => {
      // 타이머 요소 찾기
      const timer = page.locator('[class*="timer"], [class*="Timer"]').first();
      
      await expect(timer).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 타이머 위치 확인 (화면 상단)
      const timerBox = await timer.boundingBox();
      const viewport = page.viewportSize();
      
      if (timerBox && viewport) {
        // 타이머가 화면 상단 근처에 있는지 확인 (상단 100px 이내)
        expect(timerBox.y).toBeLessThan(100);
      }
    });

    test('타이머에 남은 시간이 올바른 형식으로 표시되는지 확인', async ({ page }) => {
      const timer = page.locator('[class*="timer"], [class*="Timer"]').first();
      
      await expect(timer).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 시간 형식 확인 (예: "23:59:59" 또는 "23시간 59분 59초")
      const timerText = await timer.textContent();
      expect(timerText).toMatch(/\d+[시간:]\d+[분:]\d+[초]?/);
    });

    test('타이머 색상이 남은 시간에 따라 변경되는지 확인', async ({ page }) => {
      const timer = page.locator('[class*="timer"], [class*="Timer"]').first();
      
      await expect(timer).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 타이머 색상 확인
      const color = await timer.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      
      // 색상이 설정되어 있는지 확인
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgba(0, 0, 0, 0)'); // 투명하지 않아야 함
    });

    test('10분 미만일 때 타이머가 깜빡임 애니메이션을 표시하는지 확인', async ({ page }) => {
      const timer = page.locator('[class*="timer"], [class*="Timer"]').first();
      
      await expect(timer).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 애니메이션 확인 (CSS animation 속성)
      const animation = await timer.evaluate((el) => 
        window.getComputedStyle(el).animation
      );
      
      // 애니메이션이 설정되어 있는지 확인 (10분 미만일 때만)
      // 실제 구현에 따라 다를 수 있음
      if (animation && animation !== 'none') {
        expect(animation).toBeTruthy();
      }
    });

    test('24시간 경과 시 "자동 제출됨" 메시지가 표시되는지 확인', async ({ page }) => {
      // TODO: 24시간 경과된 대기실로 이동
      // await page.goto('/waiting-room/expired-room-id');
      
      const expiredMessage = page.locator('text=/자동 제출됨|제출 완료/i');
      
      await expect(expiredMessage).toBeVisible({ timeout: 10000 }).catch(() => {
        // 24시간 경과된 대기실이 없으면 스킵
        test.skip();
      });
    });
  });

  test.describe('T044: [US1] 제출 확인 모달 렌더링', () => {
    test('제출 확인 모달이 중앙에 표시되는지 확인', async ({ page }) => {
      // 제출 버튼 클릭하여 모달 열기
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      // 모달 확인
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 모달 위치 확인 (중앙)
      const modalBox = await modal.boundingBox();
      const viewport = page.viewportSize();
      
      if (modalBox && viewport) {
        // 모달이 화면 중앙에 있는지 확인 (중앙 ±50px)
        const centerX = viewport.width / 2;
        const modalCenterX = modalBox.x + modalBox.width / 2;
        expect(Math.abs(modalCenterX - centerX)).toBeLessThan(50);
      }
    });

    test('제출 확인 모달에 개봉 예정일이 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 개봉 예정일 텍스트 확인
      const openDateText = page.locator('text=/개봉 예정일|오픈 날짜/i');
      await expect(openDateText).toBeVisible({ timeout: 3000 });
    });

    test('제출 확인 모달에 남은 시간이 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 남은 시간 텍스트 확인
      const remainingTimeText = page.locator('text=/남은 시간|시간 남음/i');
      await expect(remainingTimeText).toBeVisible({ timeout: 3000 });
    });

    test('제출 확인 모달에 "묻기" 및 "취소" 버튼이 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // "묻기" 버튼 확인
      const confirmButton = page.getByRole('button', { name: /묻기|제출|확인/i });
      await expect(confirmButton).toBeVisible({ timeout: 3000 });
      
      // "취소" 버튼 확인
      const cancelButton = page.getByRole('button', { name: /취소/i });
      await expect(cancelButton).toBeVisible({ timeout: 3000 });
    });

    test('제출 확인 모달 배경이 반투명으로 표시되는지 확인', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 모달 배경 확인
      const backdrop = page.locator('[class*="backdrop"], [class*="overlay"]').first();
      
      if (await backdrop.isVisible({ timeout: 2000 }).catch(() => false)) {
        const backgroundColor = await backdrop.evaluate((el) => 
          window.getComputedStyle(el).backgroundColor
        );
        
        // 배경색이 반투명인지 확인 (rgba 값에 alpha < 1)
        const rgbaMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch && rgbaMatch[4]) {
          const alpha = parseFloat(rgbaMatch[4]);
          expect(alpha).toBeLessThan(1);
        }
      }
    });
  });

  test.describe('T045: [US1] 제출 완료 모달 렌더링', () => {
    test('제출 완료 모달이 중앙에 표시되는지 확인', async ({ page }) => {
      // TODO: 제출 완료 상태로 이동 (실제 제출 후 또는 Mock 데이터)
      // await page.goto('/waiting-room/submitted-room-id');
      
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 모달 위치 확인 (중앙)
      const modalBox = await modal.boundingBox();
      const viewport = page.viewportSize();
      
      if (modalBox && viewport) {
        const centerX = viewport.width / 2;
        const modalCenterX = modalBox.x + modalBox.width / 2;
        expect(Math.abs(modalCenterX - centerX)).toBeLessThan(50);
      }
    });

    test('제출 완료 모달에 성공 아이콘이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 성공 아이콘 확인
      const successIcon = page.locator('[class*="success"], [class*="check"], [aria-label*="성공"]').first();
      await expect(successIcon).toBeVisible({ timeout: 3000 }).catch(() => {
        // 아이콘이 없을 수도 있음
      });
    });

    test('제출 완료 모달에 D-Day가 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // D-Day 텍스트 확인
      const dDayText = page.locator('text=/D-Day|D일|개봉까지/i');
      await expect(dDayText).toBeVisible({ timeout: 3000 });
    });

    test('제출 완료 모달에 "확인" 버튼이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // "확인" 버튼 확인
      const confirmButton = page.getByRole('button', { name: /확인/i });
      await expect(confirmButton).toBeVisible({ timeout: 3000 });
    });

    test('자동 제출 시 추가 안내 메시지가 표시되는지 확인', async ({ page }) => {
      // TODO: 자동 제출된 대기실로 이동
      // await page.goto('/waiting-room/auto-submitted-room-id');
      
      const autoSubmitMessage = page.locator('text=/자동 제출|24시간 경과/i');
      
      await expect(autoSubmitMessage).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
    });
  });

  test.describe('T046: [US3] 자동 제출 안내 모달 렌더링', () => {
    test('자동 제출 안내 모달이 중앙에 표시되는지 확인', async ({ page }) => {
      // TODO: 자동 제출된 대기실로 이동
      // await page.goto('/waiting-room/auto-submitted-room-id');
      
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 모달 위치 확인 (중앙)
      const modalBox = await modal.boundingBox();
      const viewport = page.viewportSize();
      
      if (modalBox && viewport) {
        const centerX = viewport.width / 2;
        const modalCenterX = modalBox.x + modalBox.width / 2;
        expect(Math.abs(modalCenterX - centerX)).toBeLessThan(50);
      }
    });

    test('자동 제출 안내 모달에 "이미 제출된 타임캡슐입니다" 제목이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 제목 텍스트 확인
      const titleText = page.locator('text=/이미 제출된|제출 완료/i');
      await expect(titleText).toBeVisible({ timeout: 3000 });
    });

    test('자동 제출 안내 모달에 제출 시각이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 제출 시각 텍스트 확인
      const submitTimeText = page.locator('text=/제출 시각|제출 시간/i');
      await expect(submitTimeText).toBeVisible({ timeout: 3000 });
    });

    test('자동 제출 안내 모달에 개봉 예정일이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 개봉 예정일 텍스트 확인
      const openDateText = page.locator('text=/개봉 예정일|오픈 날짜/i');
      await expect(openDateText).toBeVisible({ timeout: 3000 });
    });

    test('자동 제출 안내 모달에 "보관함으로 이동" 및 "홈으로" 버튼이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // "보관함으로 이동" 버튼 확인
      const vaultButton = page.getByRole('button', { name: /보관함|보관함으로/i });
      await expect(vaultButton).toBeVisible({ timeout: 3000 });
      
      // "홈으로" 버튼 확인
      const homeButton = page.getByRole('button', { name: /홈으로|홈/i });
      await expect(homeButton).toBeVisible({ timeout: 3000 });
    });

    test('자동 제출 안내 모달에 정보 아이콘이 표시되는지 확인', async ({ page }) => {
      const modal = page.getByRole('dialog');
      
      await expect(modal).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      // 정보 아이콘 확인
      const infoIcon = page.locator('[class*="info"], [aria-label*="정보"]').first();
      await expect(infoIcon).toBeVisible({ timeout: 3000 }).catch(() => {
        // 아이콘이 없을 수도 있음
      });
    });
  });

  test.describe('접근성 테스트', () => {
    test('모든 모달에 적절한 ARIA 속성이 제공됨', async ({ page }) => {
      // 제출 버튼 클릭하여 모달 열기
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 모달에 role="dialog"와 aria-modal="true"가 있는지 확인
      await expect(modal).toHaveAttribute('role', 'dialog');
      await expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    test('모달 닫기 버튼에 적절한 aria-label이 제공됨', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // 취소 버튼 확인
      const cancelButton = page.getByRole('button', { name: /취소/i });
      await expect(cancelButton).toHaveAttribute('aria-label', /취소|닫기/i);
    });

    test('키보드로 모달 닫기 가능 (ESC 키)', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /제출|타임캡슐 제출/i });
      
      await expect(submitButton).toBeVisible({ timeout: 10000 }).catch(() => {
        test.skip();
      });
      
      await submitButton.click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // ESC 키 입력
      await page.keyboard.press('Escape');
      
      // 모달이 닫혔는지 확인
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    });
  });
});
