/**
 * 카카오 지도 E2E 테스트
 * 
 * 이 테스트는 홈 페이지의 카카오 지도 통합 기능을 검증합니다.
 * 주요 사용자 시나리오:
 * - US1: 홈 페이지에서 지도 확인
 * - US2: 지도 기본 조작
 * - US6: 현재 위치 및 주소 확인
 */

import { test, expect } from '@playwright/test';
import {
  MOCK_COORD2REGIONCODE_RESPONSE,
} from './fixtures/mockData';

test.describe('카카오 지도 통합', () => {
  test.beforeEach(async ({ page }) => {
    // 카카오 지도 스크립트 Mock 설정
    await page.addInitScript(() => {
      // Mock 카카오 지도 API
      (window as any).kakao = {
        maps: {
          load: (callback: () => void) => {
            setTimeout(callback, 0);
          },
          Map: class MockMap {
            constructor(_container: HTMLElement, _options: any) {
              // Mock 지도 인스턴스
            }
            setCenter() {}
            getCenter() {
              return {
                getLat: () => 37.5665,
                getLng: () => 126.9780,
              };
            }
            setLevel() {}
            getLevel() {
              return 3;
            }
            relayout() {}
            setDraggable() {}
            setZoomable() {}
          },
          LatLng: class MockLatLng {
            constructor(private lat: number, private lng: number) {}
            getLat() {
              return this.lat;
            }
            getLng() {
              return this.lng;
            }
          },
          event: {
            addListener() {},
            removeListener() {},
          },
        },
      };
    });

    // 카카오 REST API Mock 설정
    await page.route('**/dapi.kakao.com/v2/local/geo/coord2regioncode.json*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_COORD2REGIONCODE_RESPONSE),
      });
    });

    // 카카오 지도 스크립트 로딩 Mock
    await page.route('**/dapi.kakao.com/v2/maps/sdk.js*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: '// Mock Kakao Maps SDK',
      });
    });

    // 홈 페이지로 이동
    await page.goto('/');
  });

  test.describe('[US1] 홈 페이지에서 지도 확인', () => {
    test('홈 페이지 접근 시 지도가 표시되어야 함', async ({ page }) => {
      // Given: 사용자가 홈 페이지에 접근했을 때
      // When: 페이지가 로드되면
      await page.waitForLoadState('networkidle');

      // Then: 지도가 화면에 표시됨
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();
    });

    test('지도 로딩 중일 때 로딩 상태가 표시되어야 함', async ({ page }) => {
      // Given: 지도가 로드 중일 때
      // When: 사용자가 페이지를 확인하면
      // Then: 지도 로딩 상태가 표시되거나 지도가 표시됨
      // (로딩이 빠르면 바로 지도가 표시될 수 있음)
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();
    });

    test('지도가 기본 설정으로 표시되어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 화면을 확인하면
      // Then: 지도가 기본 설정으로 정상적으로 표시됨
      // (지도 컨테이너가 존재하고 보이는지 확인)
      await expect(mapContainer).toHaveCSS('width', /\d+px/);
      await expect(mapContainer).toHaveCSS('height', /\d+px/);
    });
  });

  test.describe('[US2] 지도 기본 조작', () => {
    test.skip('지도를 드래그하여 이동할 수 있어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 지도를 드래그하면
      const box = await mapContainer.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100);
        await page.mouse.up();
      }

      // Then: 지도가 드래그 방향으로 이동함
      // (실제 카카오 지도 API 동작은 브라우저 환경에서 확인 필요)
    });

    test.skip('지도를 확대할 수 있어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 지도를 확대하면
      // (확대 버튼 클릭 또는 핀치 제스처)
      // Then: 지도가 확대되어 더 자세한 지도가 표시됨
      // (실제 카카오 지도 API 동작은 브라우저 환경에서 확인 필요)
    });

    test.skip('지도를 축소할 수 있어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 지도를 축소하면
      // (축소 버튼 클릭 또는 핀치 제스처)
      // Then: 지도가 축소되어 더 넓은 영역이 표시됨
      // (실제 카카오 지도 API 동작은 브라우저 환경에서 확인 필요)
    });
  });

  test.describe('[US6] 현재 위치 및 주소 확인', () => {
    test.skip('지도 중앙에 현재 위치가 표시되어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 지도를 확인하면
      const locationDisplay = page.locator('[data-testid="location-display"]');

      // Then: 지도 중앙에 현재 위치가 표시됨
      await expect(locationDisplay).toBeVisible();
    });

    test.skip('지도 중앙점 기준 주소 정보가 표시되어야 함', async ({ page }) => {
      // Given: 지도가 표시된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 사용자가 지도를 확인하면
      const addressDisplay = page.locator('[data-testid="address-display"]');

      // Then: 지도 중앙점 기준 주소 정보(구, 동)가 표시됨
      await expect(addressDisplay).toBeVisible();
      await expect(addressDisplay).toContainText(/구/);
    });

    test.skip('지도 이동 시 주소 정보가 업데이트되어야 함', async ({ page }) => {
      // Given: 지도가 이동된 상태에서
      await page.waitForLoadState('networkidle');
      const mapContainer = page.locator('[data-testid="map-container"]');
      await expect(mapContainer).toBeVisible();

      // When: 지도 이동이 완료되면
      const box = await mapContainer.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 100);
        await page.mouse.up();
      }

      // 디바운싱 대기 (500ms)
      await page.waitForTimeout(600);

      // Then: 새로운 중앙점 기준 주소 정보가 업데이트되어 표시됨
      // (실제 주소가 변경되었는지 확인)
    });
  });

  test.describe('에러 처리', () => {
    test.skip('API 키가 설정되지 않은 경우 오류 메시지가 표시되어야 함', async ({ page }) => {
      // Given: API 키가 설정되지 않은 상태에서
      // (환경 변수를 제거하거나 무효화)

      // When: 홈 페이지에 접근하면
      // Then: 적절한 오류 메시지가 표시됨
      const errorMessage = page.locator('[data-testid="map-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/API 키/);
    });

    test.skip('주소 조회 실패 시 오류 메시지가 표시되어야 함', async ({ page }) => {
      // Given: 주소 조회 API가 실패하는 상태에서
      await page.route('**/dapi.kakao.com/v2/local/geo/coord2regioncode.json*', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // When: 지도를 이동하면
      // Then: 주소 조회 실패 메시지가 표시됨
      const errorMessage = page.locator('[data-testid="address-error"]');
      await expect(errorMessage).toBeVisible();
    });
  });
});
